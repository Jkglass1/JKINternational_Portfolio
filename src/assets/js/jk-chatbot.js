/* ==========================================================================
   JK International - Website sales assistant ("JK Glasses Assistant")

   A guided, multilingual (English / Hindi / Punjabi) sales assistant that
   creates and updates the visitor's lead DIRECTLY in the JK International ERP
   (POST {erpEndpoint} = /api/public/website-chatbot). The ERP is the only
   place leads and conversations are stored.

   Journey: greeting -> language -> name + mobile (email optional) -> menu ->
   Category -> Subcategory -> Product -> questions / requirements -> summary ->
   submit (success is shown ONLY after the ERP confirms). A subcategory with one
   product skips the product step: Aluminium / uPVC visitors choose Windows or
   Doors, never a window or door style they may not know.

   Photos & drawings: once the visitor has given their details (and the ERP
   reports `attachments: true`), the paper-clip in the message bar, the "Send a
   photo or drawing" option and the "Add a photo or drawing" button on the
   summary / Edit form send files to the ERP's `attach` action, which keeps
   them with the lead's conversation (max 5). Photos are resized to a ~1600 px
   JPEG in the browser; PDF drawings go as-is (max 3 MB).

   Answers are NOT AI-generated. They come from:
     - assets/js/jk-chatbot-catalog.js  (verified product catalogue)  KNOWLEDGE_BASE
     - assets/js/jk-chatbot-faq.js      (verified FAQ)                KNOWLEDGE_BASE
     - fixed flow / policy messages in this file                      RULE
   Anything else gets an honest "no verified information" reply and the
   sales-team options. The ERP response says `ai: true` only once an AI
   provider is configured server-side (src/lib/website-chatbot/ai/ in the ERP).

   Every message is numbered (seq) and sent to the ERP in small batches; the
   ERP ignores a seq it already has, so retries never duplicate anything.
   State lives in sessionStorage, so a refresh or closing/reopening the chat
   keeps the conversation. Paired with assets/css/jk-chatbot.css.
   ========================================================================== */

(function () {
  'use strict';

  var config = window.JK_LEAD_CONFIG || {};
  var options = config.chatbot || {};
  if (options.enabled === false || document.querySelector('.jk-cb')) return;

  var FAQ = window.JK_CHATBOT_FAQ || { items: [] };
  FAQ.items = FAQ.items || [];
  FAQ.popular = FAQ.popular || [];
  FAQ.smalltalk = FAQ.smalltalk || {};
  var CATALOG = window.JK_CHATBOT_CATALOG || { categories: [], facts: {}, contacts: {} };
  var CONTACTS = CATALOG.contacts || {};

  var ENDPOINT = String(options.erpEndpoint || '').trim();
  var STATE_KEY = 'jk-sales-chat';
  var STATE_VERSION = 3;
  var STATE_MAX_AGE = 24 * 3600 * 1000;
  var LANGS = ['en', 'hi', 'pa'];
  var LANG_NAMES = { en: 'English', hi: 'हिंदी', pa: 'ਪੰਜਾਬੀ' };
  var LANG_SHORT = { en: 'EN', hi: 'हि', pa: 'ਪੰ' };
  var REQ_FIELDS = ['quantity', 'specifications', 'deliveryLocation', 'timeline', 'quotationDetails', 'message'];
  var COUNTRY_CODES = [
    ['91', 'India'], ['971', 'UAE'], ['966', 'Saudi Arabia'], ['974', 'Qatar'], ['965', 'Kuwait'], ['968', 'Oman'],
    ['973', 'Bahrain'], ['977', 'Nepal'], ['880', 'Bangladesh'], ['94', 'Sri Lanka'], ['44', 'UK'], ['1', 'USA / Canada'], ['61', 'Australia']
  ];
  var BATCH = 60;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ Text */
  var TEXT = {
    en: {
      title: 'JK Glasses Assistant',
      status: 'Online · Sales assistant',
      statusTyping: 'Typing…',
      launcher: 'Chat with JK Glasses',
      launcherHint: 'Need help choosing glass, windows or doors?',
      close: 'Close chat', back: 'Back', home: 'Main menu', language: 'Change language',
      send: 'Send', placeholder: 'Type your question…', placeholderLocked: 'Please choose an option above',
      placeholderAnswer: 'Type your answer…',
      note: 'Answers come from JK Glasses’ verified product information.',
      greet: 'Hello! 👋\nWelcome to **JK Glasses**.\nThank you for visiting us. I’m your virtual assistant, and I’m here to help you explore our products and answer your questions.\nLet’s get started!',
      askLang: 'Which language would you prefer for our conversation?',
      trust: ['ISO 9001:2015 certified', 'Since 1996', 'Factory-direct rates'],
      langChanged: 'Language changed to English.',
      askDetails: 'Great! Before we proceed, may I know a few details so our team can assist you better?',
      fName: 'Full name', fPhone: 'Mobile number', fEmail: 'Email address', fOptional: 'optional', fCountry: 'Country code',
      fContinue: 'Continue', fSave: 'Save changes', fCancel: 'Cancel',
      privacy: 'By continuing, you agree that JK Glasses may contact you about this enquiry.',
      errName: 'Please enter your full name.',
      errPhone: 'Please enter a valid mobile number.',
      errEmail: 'Please enter a valid email address, or leave it empty.',
      detailsUser: '{name} · {phone}',
      menu: 'Thank you, {name}!\nHow can I help you today?',
      menuAgain: 'What would you like to do next, {name}?',
      mExplore: 'Explore our products', mInfo: 'Product information', mQuote: 'Request a quotation',
      mTech: 'Technical questions', mSales: 'Talk to our sales team', mOther: 'Other enquiries',
      pickCategory: 'Please choose a product category:',
      pickCategoryInfo: 'Which product would you like information about? Choose a category:',
      pickCategoryQuote: 'Which product would you like a quotation for?',
      pickSub: '**{cat}**: please choose a type:',
      pickProduct: '**{sub}**: please choose a product:',
      notSure: 'Not sure yet / several products',
      readMore: 'Read more on our website',
      keyPoints: 'Key features', usedFor: 'Used for',
      productNext: 'What would you like to do next?',
      aAsk: 'Ask about this product', aQuote: 'Get a quote', aAnother: 'Explore another product', aMenu: 'Main menu',
      aAskMore: 'Ask another question', aCallback: 'Request a call back', aSendTeam: 'Send my question to the team',
      askPrompt: 'What would you like to know about **{product}**? Choose a topic or type your question.',
      qSpecs: 'Specifications / thickness', qPrice: 'Price', qMoq: 'Minimum order quantity', qDelivery: 'Delivery time',
      qCert: 'Certifications', qDiff: 'Compare with similar products', qUses: 'Where is it used?',
      techPrompt: 'Please type your technical question, or choose a common one:',
      specsNone: 'Detailed specifications for **{product}** are not published on our website. Our technical team will confirm the right specification for your project.',
      price: 'Prices depend on the **product, size, thickness / specification, quantity and site location**, so we don’t publish a fixed price list. We quote each requirement individually at **direct factory rates**.',
      noVerified: 'I’m sorry, I don’t have verified information about this specific question right now.\nWould you like me to connect you with our sales team?',
      noVerifiedMoq: 'I’m sorry, I don’t have verified information about the minimum order quantity right now.\nWould you like me to connect you with our sales team?',
      noVerifiedDelivery: 'I’m sorry, I don’t have verified information about delivery time right now. It depends on the product, quantity and location, and our sales team confirms it with your quotation.\nWould you like me to connect you with our sales team?',
      compareIntro: 'Here is how the **{sub}** options compare:',
      compareSingle: '**{product}** is our only product in this group. You can explore another category to compare.',
      repeat: 'I’ve shared the verified information I have on this. For more detail, our sales team can help.',
      hello: 'Hello! How can I help you today?',
      thanks: 'You’re welcome! Is there anything else I can help you with?',
      pickProductFirst: 'Which product is your question about? Please choose a category:',
      related: 'Related questions',
      reqIntro: 'Let me note a few details for your quotation. You can skip any question.',
      reqIntroSales: 'Sure. I’ll ask our sales team to call you back.',
      rq_quantity: 'What quantity do you require?',
      rq_specifications: 'What thickness, size or specifications do you need?',
      rq_deliveryLocation: 'What is your delivery or site location?',
      rq_timeline: 'When do you need the product?',
      rq_quotationDetails: 'Anything specific to include in the quotation?',
      rq_message: 'Do you have any additional requirements or a message for our team?',
      rq_messageOther: 'Please type your enquiry and our team will get back to you.',
      hintLocation: 'City / site location', hintMessage: 'Type here…',
      tNow: 'Immediately', t1m: 'Within 1 month', t3m: '1–3 months', tLater: 'Just exploring',
      skip: 'Skip', skipped: '(skipped)',
      salesIntro: 'You can reach our sales team directly:',
      salesWa: 'WhatsApp us', salesCall: 'Call {area}', salesEmail: 'Email sales',
      salesNext: 'Or request a call back and our team will contact you.',
      summaryTitle: 'Here is your enquiry. Please check the details, then confirm below.',
      sName: 'Name', sPhone: 'Mobile', sEmail: 'Email', sLang: 'Language', sCat: 'Product category', sSub: 'Subcategory',
      sProduct: 'Product', sQuantity: 'Quantity', sSpecs: 'Size / specifications', sLocation: 'Delivery location',
      sTimeline: 'Timeline', sQuote: 'Quotation required', sMessage: 'Message', sCall: 'Call back requested',
      sYes: 'Yes', sNo: 'No', sNone: '—',
      sumDetails: 'Your details', sumRequirement: 'Your requirement', sPhotos: 'Photos & drawings', sPhotosN: '{n} attached',
      sNotSure: 'Not decided yet', tagQuote: 'Quotation requested', tagCall: 'Call back requested',
      sumNote: 'Our sales team will contact you shortly after you submit.',
      confirm: 'Confirm & submit', edit: 'Edit details',
      qStyles: 'Types available',
      stylesIntro: '**{product}** come in these types:',
      stylesHelp: 'You don’t need to choose now: our team will suggest the right type for your space.',
      attachPhoto: 'Attach a photo or drawing', photoOption: '📎 Send a photo or drawing',
      attachAdd: 'Add a photo or drawing', attachHint: 'Photos (JPG, PNG) or PDF drawings up to 3 MB · up to {n} files',
      pdfLabel: 'PDF drawing',
      rq_specificationsPhoto: 'What size, thickness or specifications do you need?\nNot sure? You can also send a photo or drawing.',
      photoUploading: 'Uploading…',
      photoAdded: 'Thank you! It has been added to your enquiry, so our team can see it.',
      photosAdded: 'Thank you! All {n} files have been added to your enquiry, so our team can see them.',
      photoFailed: 'Sorry, your file could not be uploaded just now. Please try again, or send it to us on WhatsApp.',
      photoUnsupported: 'Sorry, I couldn’t open that file. Please choose a photo (JPG or PNG) or a PDF drawing.',
      photoTooBig: 'That PDF is larger than 3 MB, so it can’t be sent here. Please send it to us on WhatsApp.',
      photoTooMany: 'You can add up to {n} photos or drawings to one enquiry. You can send more to us on WhatsApp.',
      photoUnavailable: 'Sorry, uploading files isn’t available right now. You can send it to us on WhatsApp.',
      photoContinue: 'Continue', photoAlt: 'Photo you sent',
      editTitle: 'Update your details:',
      submitting: 'Submitting your enquiry…',
      success: 'Thank you for contacting JK Glasses!\nYour enquiry has been successfully submitted.\nOur sales team will contact you shortly.',
      successRef: 'Reference: {ref}',
      failed: 'Sorry, we couldn’t submit your enquiry just now. Your conversation is safe, nothing has been lost.\nPlease try again, or reach us directly on WhatsApp or by phone.',
      retry: 'Try again',
      closing: 'Is there anything else I can help you with?',
      newEnquiry: 'Start a new enquiry', closeChat: 'Close chat',
      userLang: 'Language: {lang}',
      edited: 'Updated my details',
      confirmed: 'Confirm & submit'
    },
    hi: {
      title: 'JK Glasses असिस्टेंट',
      status: 'ऑनलाइन · सेल्स असिस्टेंट',
      statusTyping: 'लिख रहे हैं…',
      launcher: 'JK Glasses से चैट करें',
      launcherHint: 'ग्लास, खिड़की या दरवाज़े चुनने में मदद चाहिए?',
      close: 'चैट बंद करें', back: 'पीछे', home: 'मुख्य मेनू', language: 'भाषा बदलें',
      send: 'भेजें', placeholder: 'अपना सवाल लिखें…', placeholderLocked: 'कृपया ऊपर से एक विकल्प चुनें',
      placeholderAnswer: 'अपना जवाब लिखें…',
      note: 'जवाब JK Glasses की प्रमाणित उत्पाद जानकारी से दिए जाते हैं।',
      greet: 'नमस्ते! 👋\n**JK Glasses** में आपका स्वागत है।\nहमारे यहाँ आने के लिए धन्यवाद। मैं आपका वर्चुअल असिस्टेंट हूँ, और हमारे उत्पाद देखने और आपके सवालों के जवाब देने में आपकी मदद के लिए यहाँ हूँ।\nचलिए शुरू करते हैं!',
      askLang: 'आप बातचीत किस भाषा में करना चाहेंगे?',
      trust: ['ISO 9001:2015 प्रमाणित', '1996 से', 'सीधे फ़ैक्टरी रेट'],
      langChanged: 'भाषा हिंदी में बदल दी गई है।',
      askDetails: 'बढ़िया! आगे बढ़ने से पहले, क्या मैं कुछ जानकारी ले सकता हूँ ताकि हमारी टीम आपकी बेहतर मदद कर सके?',
      fName: 'पूरा नाम', fPhone: 'मोबाइल नंबर', fEmail: 'ईमेल पता', fOptional: 'वैकल्पिक', fCountry: 'देश कोड',
      fContinue: 'आगे बढ़ें', fSave: 'बदलाव सहेजें', fCancel: 'रद्द करें',
      privacy: 'आगे बढ़कर आप सहमति देते हैं कि JK Glasses इस पूछताछ के बारे में आपसे संपर्क कर सकता है।',
      errName: 'कृपया अपना पूरा नाम लिखें।',
      errPhone: 'कृपया सही मोबाइल नंबर लिखें।',
      errEmail: 'कृपया सही ईमेल पता लिखें, या इसे खाली छोड़ दें।',
      detailsUser: '{name} · {phone}',
      menu: 'धन्यवाद, {name} जी!\nआज मैं आपकी क्या मदद कर सकता हूँ?',
      menuAgain: '{name} जी, आगे आप क्या करना चाहेंगे?',
      mExplore: 'हमारे उत्पाद देखें', mInfo: 'उत्पाद की जानकारी', mQuote: 'कोटेशन माँगें',
      mTech: 'तकनीकी सवाल', mSales: 'सेल्स टीम से बात करें', mOther: 'अन्य पूछताछ',
      pickCategory: 'कृपया उत्पाद श्रेणी चुनें:',
      pickCategoryInfo: 'आप किस उत्पाद की जानकारी चाहते हैं? श्रेणी चुनें:',
      pickCategoryQuote: 'आप किस उत्पाद का कोटेशन चाहते हैं?',
      pickSub: '**{cat}**: कृपया प्रकार चुनें:',
      pickProduct: '**{sub}**: कृपया उत्पाद चुनें:',
      notSure: 'अभी तय नहीं / कई उत्पाद',
      readMore: 'हमारी वेबसाइट पर और पढ़ें',
      keyPoints: 'मुख्य विशेषताएँ', usedFor: 'उपयोग',
      productNext: 'आगे आप क्या करना चाहेंगे?',
      aAsk: 'इस उत्पाद के बारे में पूछें', aQuote: 'कोटेशन पाएँ', aAnother: 'दूसरा उत्पाद देखें', aMenu: 'मुख्य मेनू',
      aAskMore: 'एक और सवाल पूछें', aCallback: 'कॉल बैक माँगें', aSendTeam: 'मेरा सवाल टीम को भेजें',
      askPrompt: '**{product}** के बारे में आप क्या जानना चाहते हैं? विषय चुनें या अपना सवाल लिखें।',
      qSpecs: 'स्पेसिफ़िकेशन / मोटाई', qPrice: 'कीमत', qMoq: 'न्यूनतम ऑर्डर मात्रा', qDelivery: 'डिलीवरी का समय',
      qCert: 'प्रमाणपत्र', qDiff: 'मिलते-जुलते उत्पादों से तुलना', qUses: 'इसका उपयोग कहाँ होता है?',
      techPrompt: 'कृपया अपना तकनीकी सवाल लिखें, या कोई आम सवाल चुनें:',
      specsNone: '**{product}** के विस्तृत स्पेसिफ़िकेशन हमारी वेबसाइट पर प्रकाशित नहीं हैं। आपके प्रोजेक्ट के लिए सही स्पेसिफ़िकेशन हमारी तकनीकी टीम कन्फ़र्म करेगी।',
      price: 'कीमत **उत्पाद, साइज़, मोटाई / स्पेसिफ़िकेशन, मात्रा और साइट लोकेशन** पर निर्भर करती है, इसलिए हम कोई तय कीमत सूची प्रकाशित नहीं करते। हम हर ज़रूरत का अलग कोटेशन **सीधे फ़ैक्टरी रेट** पर देते हैं।',
      noVerified: 'माफ़ कीजिए, इस सवाल के बारे में अभी मेरे पास प्रमाणित जानकारी नहीं है।\nक्या मैं आपको हमारी सेल्स टीम से जोड़ दूँ?',
      noVerifiedMoq: 'माफ़ कीजिए, न्यूनतम ऑर्डर मात्रा के बारे में अभी मेरे पास प्रमाणित जानकारी नहीं है।\nक्या मैं आपको हमारी सेल्स टीम से जोड़ दूँ?',
      noVerifiedDelivery: 'माफ़ कीजिए, डिलीवरी के समय के बारे में अभी मेरे पास प्रमाणित जानकारी नहीं है। यह उत्पाद, मात्रा और लोकेशन पर निर्भर करता है, और हमारी सेल्स टीम इसे कोटेशन के साथ कन्फ़र्म करती है।\nक्या मैं आपको हमारी सेल्स टीम से जोड़ दूँ?',
      compareIntro: '**{sub}** के विकल्पों की तुलना:',
      compareSingle: '**{product}** इस समूह में हमारा अकेला उत्पाद है। तुलना के लिए आप दूसरी श्रेणी देख सकते हैं।',
      repeat: 'इस बारे में मेरे पास जो प्रमाणित जानकारी थी, वह मैंने बता दी है। ज़्यादा जानकारी के लिए हमारी सेल्स टीम मदद कर सकती है।',
      hello: 'नमस्ते! आज मैं आपकी क्या मदद कर सकता हूँ?',
      thanks: 'आपका स्वागत है! क्या मैं किसी और चीज़ में मदद कर सकता हूँ?',
      pickProductFirst: 'आपका सवाल किस उत्पाद के बारे में है? कृपया श्रेणी चुनें:',
      related: 'संबंधित सवाल',
      reqIntro: 'आपके कोटेशन के लिए मैं कुछ जानकारी नोट कर लेता हूँ। आप कोई भी सवाल छोड़ सकते हैं।',
      reqIntroSales: 'ज़रूर। मैं हमारी सेल्स टीम को आपको कॉल बैक करने के लिए कहूँगा।',
      rq_quantity: 'आपको कितनी मात्रा चाहिए?',
      rq_specifications: 'आपको कौन-सी मोटाई, साइज़ या स्पेसिफ़िकेशन चाहिए?',
      rq_deliveryLocation: 'डिलीवरी या साइट की लोकेशन क्या है?',
      rq_timeline: 'आपको उत्पाद कब तक चाहिए?',
      rq_quotationDetails: 'कोटेशन में कुछ ख़ास शामिल करना है?',
      rq_message: 'क्या कोई और ज़रूरत है या हमारी टीम के लिए कोई संदेश?',
      rq_messageOther: 'कृपया अपनी पूछताछ लिखें, हमारी टीम आपसे संपर्क करेगी।',
      hintLocation: 'शहर / साइट लोकेशन', hintMessage: 'यहाँ लिखें…',
      tNow: 'तुरंत', t1m: '1 महीने के अंदर', t3m: '1–3 महीने', tLater: 'अभी सिर्फ़ जानकारी',
      skip: 'छोड़ें', skipped: '(छोड़ दिया)',
      salesIntro: 'आप हमारी सेल्स टीम से सीधे संपर्क कर सकते हैं:',
      salesWa: 'WhatsApp करें', salesCall: 'कॉल करें: {area}', salesEmail: 'सेल्स को ईमेल करें',
      salesNext: 'या कॉल बैक माँगें, हमारी टीम आपसे संपर्क करेगी।',
      summaryTitle: 'यह रही आपकी पूछताछ। कृपया जानकारी जाँच लें, फिर नीचे पुष्टि करें।',
      sName: 'नाम', sPhone: 'मोबाइल', sEmail: 'ईमेल', sLang: 'भाषा', sCat: 'उत्पाद श्रेणी', sSub: 'उप-श्रेणी',
      sProduct: 'उत्पाद', sQuantity: 'मात्रा', sSpecs: 'साइज़ / स्पेसिफ़िकेशन', sLocation: 'डिलीवरी लोकेशन',
      sTimeline: 'समय-सीमा', sQuote: 'कोटेशन चाहिए', sMessage: 'संदेश', sCall: 'कॉल बैक माँगा',
      sYes: 'हाँ', sNo: 'नहीं', sNone: '—',
      sumDetails: 'आपकी जानकारी', sumRequirement: 'आपकी ज़रूरत', sPhotos: 'फ़ोटो और ड्रॉइंग', sPhotosN: '{n} जोड़ी गईं',
      sNotSure: 'अभी तय नहीं', tagQuote: 'कोटेशन माँगा', tagCall: 'कॉल बैक माँगा',
      sumNote: 'भेजने के बाद हमारी सेल्स टीम जल्द ही आपसे संपर्क करेगी।',
      confirm: 'पुष्टि करें और भेजें', edit: 'जानकारी बदलें',
      qStyles: 'उपलब्ध प्रकार',
      stylesIntro: '**{product}** इन प्रकारों में उपलब्ध हैं:',
      stylesHelp: 'आपको अभी चुनने की ज़रूरत नहीं: आपकी जगह के लिए सही प्रकार हमारी टीम सुझाएगी।',
      attachPhoto: 'फ़ोटो या ड्रॉइंग जोड़ें', photoOption: '📎 फ़ोटो या ड्रॉइंग भेजें',
      attachAdd: 'फ़ोटो या ड्रॉइंग जोड़ें', attachHint: 'फ़ोटो (JPG, PNG) या 3 MB तक की PDF ड्रॉइंग · अधिकतम {n} फ़ाइलें',
      pdfLabel: 'PDF ड्रॉइंग',
      rq_specificationsPhoto: 'आपको कौन-सी मोटाई, साइज़ या स्पेसिफ़िकेशन चाहिए?\nपक्का नहीं पता? आप फ़ोटो या ड्रॉइंग भी भेज सकते हैं।',
      photoUploading: 'अपलोड हो रहा है…',
      photoAdded: 'धन्यवाद! इसे आपकी पूछताछ में जोड़ दिया गया है, ताकि हमारी टीम इसे देख सके।',
      photosAdded: 'धन्यवाद! सभी {n} फ़ाइलें आपकी पूछताछ में जोड़ दी गई हैं, ताकि हमारी टीम इन्हें देख सके।',
      photoFailed: 'माफ़ कीजिए, अभी आपकी फ़ाइल अपलोड नहीं हो सकी। कृपया फिर से कोशिश करें, या इसे WhatsApp पर भेजें।',
      photoUnsupported: 'माफ़ कीजिए, यह फ़ाइल नहीं खुल सकी। कृपया कोई फ़ोटो (JPG या PNG) या PDF ड्रॉइंग चुनें।',
      photoTooBig: 'यह PDF 3 MB से बड़ी है, इसलिए यहाँ नहीं भेजी जा सकती। कृपया इसे WhatsApp पर भेजें।',
      photoTooMany: 'एक पूछताछ में आप {n} फ़ोटो या ड्रॉइंग तक जोड़ सकते हैं। और फ़ाइलें आप WhatsApp पर भेज सकते हैं।',
      photoUnavailable: 'माफ़ कीजिए, अभी फ़ाइल अपलोड उपलब्ध नहीं है। आप इसे WhatsApp पर भेज सकते हैं।',
      photoContinue: 'आगे बढ़ें', photoAlt: 'आपकी भेजी फ़ोटो',
      editTitle: 'अपनी जानकारी अपडेट करें:',
      submitting: 'आपकी पूछताछ भेजी जा रही है…',
      success: 'JK Glasses से संपर्क करने के लिए धन्यवाद!\nआपकी पूछताछ सफलतापूर्वक भेज दी गई है।\nहमारी सेल्स टीम जल्द ही आपसे संपर्क करेगी।',
      successRef: 'संदर्भ: {ref}',
      failed: 'माफ़ कीजिए, अभी आपकी पूछताछ नहीं भेजी जा सकी। आपकी बातचीत सुरक्षित है, कुछ भी नहीं खोया है।\nकृपया फिर से कोशिश करें, या WhatsApp या फ़ोन पर सीधे संपर्क करें।',
      retry: 'फिर से कोशिश करें',
      closing: 'क्या मैं किसी और चीज़ में आपकी मदद कर सकता हूँ?',
      newEnquiry: 'नई पूछताछ शुरू करें', closeChat: 'चैट बंद करें',
      userLang: 'भाषा: {lang}',
      edited: 'मेरी जानकारी अपडेट की',
      confirmed: 'पुष्टि करें और भेजें'
    },
    pa: {
      title: 'JK Glasses ਅਸਿਸਟੈਂਟ',
      status: 'ਔਨਲਾਈਨ · ਸੇਲਜ਼ ਅਸਿਸਟੈਂਟ',
      statusTyping: 'ਲਿਖ ਰਹੇ ਹਾਂ…',
      launcher: 'JK Glasses ਨਾਲ ਚੈਟ ਕਰੋ',
      launcherHint: 'ਗਲਾਸ, ਖਿੜਕੀ ਜਾਂ ਦਰਵਾਜ਼ੇ ਚੁਣਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?',
      close: 'ਚੈਟ ਬੰਦ ਕਰੋ', back: 'ਪਿੱਛੇ', home: 'ਮੁੱਖ ਮੀਨੂ', language: 'ਭਾਸ਼ਾ ਬਦਲੋ',
      send: 'ਭੇਜੋ', placeholder: 'ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ…', placeholderLocked: 'ਕਿਰਪਾ ਕਰਕੇ ਉੱਪਰੋਂ ਇੱਕ ਵਿਕਲਪ ਚੁਣੋ',
      placeholderAnswer: 'ਆਪਣਾ ਜਵਾਬ ਲਿਖੋ…',
      note: 'ਜਵਾਬ JK Glasses ਦੀ ਪ੍ਰਮਾਣਿਤ ਉਤਪਾਦ ਜਾਣਕਾਰੀ ਤੋਂ ਦਿੱਤੇ ਜਾਂਦੇ ਹਨ।',
      greet: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! 👋\n**JK Glasses** ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ।\nਸਾਡੇ ਕੋਲ ਆਉਣ ਲਈ ਧੰਨਵਾਦ। ਮੈਂ ਤੁਹਾਡਾ ਵਰਚੁਅਲ ਅਸਿਸਟੈਂਟ ਹਾਂ, ਅਤੇ ਸਾਡੇ ਉਤਪਾਦ ਦੇਖਣ ਅਤੇ ਤੁਹਾਡੇ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦੇਣ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਲਈ ਇੱਥੇ ਹਾਂ।\nਆਓ ਸ਼ੁਰੂ ਕਰੀਏ!',
      askLang: 'ਤੁਸੀਂ ਗੱਲਬਾਤ ਕਿਸ ਭਾਸ਼ਾ ਵਿੱਚ ਕਰਨਾ ਚਾਹੋਗੇ?',
      trust: ['ISO 9001:2015 ਪ੍ਰਮਾਣਿਤ', '1996 ਤੋਂ', 'ਸਿੱਧੇ ਫ਼ੈਕਟਰੀ ਰੇਟ'],
      langChanged: 'ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਬਦਲ ਦਿੱਤੀ ਗਈ ਹੈ।',
      askDetails: 'ਬਹੁਤ ਵਧੀਆ! ਅੱਗੇ ਵਧਣ ਤੋਂ ਪਹਿਲਾਂ, ਕੀ ਮੈਂ ਕੁਝ ਜਾਣਕਾਰੀ ਲੈ ਸਕਦਾ ਹਾਂ ਤਾਂ ਜੋ ਸਾਡੀ ਟੀਮ ਤੁਹਾਡੀ ਵਧੀਆ ਮਦਦ ਕਰ ਸਕੇ?',
      fName: 'ਪੂਰਾ ਨਾਮ', fPhone: 'ਮੋਬਾਈਲ ਨੰਬਰ', fEmail: 'ਈਮੇਲ ਪਤਾ', fOptional: 'ਵਿਕਲਪਿਕ', fCountry: 'ਦੇਸ਼ ਕੋਡ',
      fContinue: 'ਅੱਗੇ ਵਧੋ', fSave: 'ਬਦਲਾਅ ਸੰਭਾਲੋ', fCancel: 'ਰੱਦ ਕਰੋ',
      privacy: 'ਅੱਗੇ ਵਧ ਕੇ ਤੁਸੀਂ ਸਹਿਮਤੀ ਦਿੰਦੇ ਹੋ ਕਿ JK Glasses ਇਸ ਪੁੱਛਗਿੱਛ ਬਾਰੇ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰ ਸਕਦਾ ਹੈ।',
      errName: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਲਿਖੋ।',
      errPhone: 'ਕਿਰਪਾ ਕਰਕੇ ਸਹੀ ਮੋਬਾਈਲ ਨੰਬਰ ਲਿਖੋ।',
      errEmail: 'ਕਿਰਪਾ ਕਰਕੇ ਸਹੀ ਈਮੇਲ ਪਤਾ ਲਿਖੋ, ਜਾਂ ਇਸਨੂੰ ਖ਼ਾਲੀ ਛੱਡ ਦਿਓ।',
      detailsUser: '{name} · {phone}',
      menu: 'ਧੰਨਵਾਦ, {name} ਜੀ!\nਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
      menuAgain: '{name} ਜੀ, ਅੱਗੇ ਤੁਸੀਂ ਕੀ ਕਰਨਾ ਚਾਹੋਗੇ?',
      mExplore: 'ਸਾਡੇ ਉਤਪਾਦ ਦੇਖੋ', mInfo: 'ਉਤਪਾਦ ਦੀ ਜਾਣਕਾਰੀ', mQuote: 'ਕੋਟੇਸ਼ਨ ਮੰਗੋ',
      mTech: 'ਤਕਨੀਕੀ ਸਵਾਲ', mSales: 'ਸੇਲਜ਼ ਟੀਮ ਨਾਲ ਗੱਲ ਕਰੋ', mOther: 'ਹੋਰ ਪੁੱਛਗਿੱਛ',
      pickCategory: 'ਕਿਰਪਾ ਕਰਕੇ ਉਤਪਾਦ ਸ਼੍ਰੇਣੀ ਚੁਣੋ:',
      pickCategoryInfo: 'ਤੁਸੀਂ ਕਿਹੜੇ ਉਤਪਾਦ ਦੀ ਜਾਣਕਾਰੀ ਚਾਹੁੰਦੇ ਹੋ? ਸ਼੍ਰੇਣੀ ਚੁਣੋ:',
      pickCategoryQuote: 'ਤੁਸੀਂ ਕਿਹੜੇ ਉਤਪਾਦ ਦਾ ਕੋਟੇਸ਼ਨ ਚਾਹੁੰਦੇ ਹੋ?',
      pickSub: '**{cat}**: ਕਿਰਪਾ ਕਰਕੇ ਕਿਸਮ ਚੁਣੋ:',
      pickProduct: '**{sub}**: ਕਿਰਪਾ ਕਰਕੇ ਉਤਪਾਦ ਚੁਣੋ:',
      notSure: 'ਹਾਲੇ ਪੱਕਾ ਨਹੀਂ / ਕਈ ਉਤਪਾਦ',
      readMore: 'ਸਾਡੀ ਵੈੱਬਸਾਈਟ ’ਤੇ ਹੋਰ ਪੜ੍ਹੋ',
      keyPoints: 'ਮੁੱਖ ਖ਼ੂਬੀਆਂ', usedFor: 'ਵਰਤੋਂ',
      productNext: 'ਅੱਗੇ ਤੁਸੀਂ ਕੀ ਕਰਨਾ ਚਾਹੋਗੇ?',
      aAsk: 'ਇਸ ਉਤਪਾਦ ਬਾਰੇ ਪੁੱਛੋ', aQuote: 'ਕੋਟੇਸ਼ਨ ਲਓ', aAnother: 'ਹੋਰ ਉਤਪਾਦ ਦੇਖੋ', aMenu: 'ਮੁੱਖ ਮੀਨੂ',
      aAskMore: 'ਇੱਕ ਹੋਰ ਸਵਾਲ ਪੁੱਛੋ', aCallback: 'ਕਾਲ ਬੈਕ ਮੰਗੋ', aSendTeam: 'ਮੇਰਾ ਸਵਾਲ ਟੀਮ ਨੂੰ ਭੇਜੋ',
      askPrompt: '**{product}** ਬਾਰੇ ਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ? ਵਿਸ਼ਾ ਚੁਣੋ ਜਾਂ ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ।',
      qSpecs: 'ਸਪੈਸੀਫ਼ਿਕੇਸ਼ਨ / ਮੋਟਾਈ', qPrice: 'ਕੀਮਤ', qMoq: 'ਘੱਟੋ-ਘੱਟ ਆਰਡਰ ਮਾਤਰਾ', qDelivery: 'ਡਿਲਿਵਰੀ ਦਾ ਸਮਾਂ',
      qCert: 'ਸਰਟੀਫ਼ਿਕੇਟ', qDiff: 'ਮਿਲਦੇ-ਜੁਲਦੇ ਉਤਪਾਦਾਂ ਨਾਲ ਤੁਲਨਾ', qUses: 'ਇਸਦੀ ਵਰਤੋਂ ਕਿੱਥੇ ਹੁੰਦੀ ਹੈ?',
      techPrompt: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਤਕਨੀਕੀ ਸਵਾਲ ਲਿਖੋ, ਜਾਂ ਕੋਈ ਆਮ ਸਵਾਲ ਚੁਣੋ:',
      specsNone: '**{product}** ਦੇ ਵਿਸਥਾਰਤ ਸਪੈਸੀਫ਼ਿਕੇਸ਼ਨ ਸਾਡੀ ਵੈੱਬਸਾਈਟ ’ਤੇ ਪ੍ਰਕਾਸ਼ਿਤ ਨਹੀਂ ਹਨ। ਤੁਹਾਡੇ ਪ੍ਰੋਜੈਕਟ ਲਈ ਸਹੀ ਸਪੈਸੀਫ਼ਿਕੇਸ਼ਨ ਸਾਡੀ ਤਕਨੀਕੀ ਟੀਮ ਪੱਕੀ ਕਰੇਗੀ।',
      price: 'ਕੀਮਤ **ਉਤਪਾਦ, ਸਾਈਜ਼, ਮੋਟਾਈ / ਸਪੈਸੀਫ਼ਿਕੇਸ਼ਨ, ਮਾਤਰਾ ਅਤੇ ਸਾਈਟ ਲੋਕੇਸ਼ਨ** ’ਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ, ਇਸ ਲਈ ਅਸੀਂ ਕੋਈ ਪੱਕੀ ਕੀਮਤ ਸੂਚੀ ਪ੍ਰਕਾਸ਼ਿਤ ਨਹੀਂ ਕਰਦੇ। ਅਸੀਂ ਹਰ ਲੋੜ ਦਾ ਵੱਖਰਾ ਕੋਟੇਸ਼ਨ **ਸਿੱਧੇ ਫ਼ੈਕਟਰੀ ਰੇਟ** ’ਤੇ ਦਿੰਦੇ ਹਾਂ।',
      noVerified: 'ਮਾਫ਼ ਕਰਨਾ, ਇਸ ਸਵਾਲ ਬਾਰੇ ਹਾਲੇ ਮੇਰੇ ਕੋਲ ਪ੍ਰਮਾਣਿਤ ਜਾਣਕਾਰੀ ਨਹੀਂ ਹੈ।\nਕੀ ਮੈਂ ਤੁਹਾਨੂੰ ਸਾਡੀ ਸੇਲਜ਼ ਟੀਮ ਨਾਲ ਜੋੜ ਦਿਆਂ?',
      noVerifiedMoq: 'ਮਾਫ਼ ਕਰਨਾ, ਘੱਟੋ-ਘੱਟ ਆਰਡਰ ਮਾਤਰਾ ਬਾਰੇ ਹਾਲੇ ਮੇਰੇ ਕੋਲ ਪ੍ਰਮਾਣਿਤ ਜਾਣਕਾਰੀ ਨਹੀਂ ਹੈ।\nਕੀ ਮੈਂ ਤੁਹਾਨੂੰ ਸਾਡੀ ਸੇਲਜ਼ ਟੀਮ ਨਾਲ ਜੋੜ ਦਿਆਂ?',
      noVerifiedDelivery: 'ਮਾਫ਼ ਕਰਨਾ, ਡਿਲਿਵਰੀ ਦੇ ਸਮੇਂ ਬਾਰੇ ਹਾਲੇ ਮੇਰੇ ਕੋਲ ਪ੍ਰਮਾਣਿਤ ਜਾਣਕਾਰੀ ਨਹੀਂ ਹੈ। ਇਹ ਉਤਪਾਦ, ਮਾਤਰਾ ਅਤੇ ਲੋਕੇਸ਼ਨ ’ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ, ਅਤੇ ਸਾਡੀ ਸੇਲਜ਼ ਟੀਮ ਇਸਨੂੰ ਕੋਟੇਸ਼ਨ ਨਾਲ ਪੱਕਾ ਕਰਦੀ ਹੈ।\nਕੀ ਮੈਂ ਤੁਹਾਨੂੰ ਸਾਡੀ ਸੇਲਜ਼ ਟੀਮ ਨਾਲ ਜੋੜ ਦਿਆਂ?',
      compareIntro: '**{sub}** ਦੇ ਵਿਕਲਪਾਂ ਦੀ ਤੁਲਨਾ:',
      compareSingle: '**{product}** ਇਸ ਸਮੂਹ ਵਿੱਚ ਸਾਡਾ ਇਕੱਲਾ ਉਤਪਾਦ ਹੈ। ਤੁਲਨਾ ਲਈ ਤੁਸੀਂ ਹੋਰ ਸ਼੍ਰੇਣੀ ਦੇਖ ਸਕਦੇ ਹੋ।',
      repeat: 'ਇਸ ਬਾਰੇ ਮੇਰੇ ਕੋਲ ਜੋ ਪ੍ਰਮਾਣਿਤ ਜਾਣਕਾਰੀ ਸੀ, ਉਹ ਮੈਂ ਦੱਸ ਦਿੱਤੀ ਹੈ। ਹੋਰ ਜਾਣਕਾਰੀ ਲਈ ਸਾਡੀ ਸੇਲਜ਼ ਟੀਮ ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ।',
      hello: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
      thanks: 'ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ! ਕੀ ਮੈਂ ਕਿਸੇ ਹੋਰ ਚੀਜ਼ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
      pickProductFirst: 'ਤੁਹਾਡਾ ਸਵਾਲ ਕਿਹੜੇ ਉਤਪਾਦ ਬਾਰੇ ਹੈ? ਕਿਰਪਾ ਕਰਕੇ ਸ਼੍ਰੇਣੀ ਚੁਣੋ:',
      related: 'ਸਬੰਧਤ ਸਵਾਲ',
      reqIntro: 'ਤੁਹਾਡੇ ਕੋਟੇਸ਼ਨ ਲਈ ਮੈਂ ਕੁਝ ਜਾਣਕਾਰੀ ਨੋਟ ਕਰ ਲੈਂਦਾ ਹਾਂ। ਤੁਸੀਂ ਕੋਈ ਵੀ ਸਵਾਲ ਛੱਡ ਸਕਦੇ ਹੋ।',
      reqIntroSales: 'ਜ਼ਰੂਰ। ਮੈਂ ਸਾਡੀ ਸੇਲਜ਼ ਟੀਮ ਨੂੰ ਤੁਹਾਨੂੰ ਕਾਲ ਬੈਕ ਕਰਨ ਲਈ ਕਹਾਂਗਾ।',
      rq_quantity: 'ਤੁਹਾਨੂੰ ਕਿੰਨੀ ਮਾਤਰਾ ਚਾਹੀਦੀ ਹੈ?',
      rq_specifications: 'ਤੁਹਾਨੂੰ ਕਿਹੜੀ ਮੋਟਾਈ, ਸਾਈਜ਼ ਜਾਂ ਸਪੈਸੀਫ਼ਿਕੇਸ਼ਨ ਚਾਹੀਦੀ ਹੈ?',
      rq_deliveryLocation: 'ਡਿਲਿਵਰੀ ਜਾਂ ਸਾਈਟ ਦੀ ਲੋਕੇਸ਼ਨ ਕੀ ਹੈ?',
      rq_timeline: 'ਤੁਹਾਨੂੰ ਉਤਪਾਦ ਕਦੋਂ ਤੱਕ ਚਾਹੀਦਾ ਹੈ?',
      rq_quotationDetails: 'ਕੋਟੇਸ਼ਨ ਵਿੱਚ ਕੁਝ ਖ਼ਾਸ ਸ਼ਾਮਲ ਕਰਨਾ ਹੈ?',
      rq_message: 'ਕੀ ਕੋਈ ਹੋਰ ਲੋੜ ਹੈ ਜਾਂ ਸਾਡੀ ਟੀਮ ਲਈ ਕੋਈ ਸੁਨੇਹਾ?',
      rq_messageOther: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਪੁੱਛਗਿੱਛ ਲਿਖੋ, ਸਾਡੀ ਟੀਮ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੇਗੀ।',
      hintLocation: 'ਸ਼ਹਿਰ / ਸਾਈਟ ਲੋਕੇਸ਼ਨ', hintMessage: 'ਇੱਥੇ ਲਿਖੋ…',
      tNow: 'ਤੁਰੰਤ', t1m: '1 ਮਹੀਨੇ ਦੇ ਅੰਦਰ', t3m: '1–3 ਮਹੀਨੇ', tLater: 'ਹਾਲੇ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ',
      skip: 'ਛੱਡੋ', skipped: '(ਛੱਡ ਦਿੱਤਾ)',
      salesIntro: 'ਤੁਸੀਂ ਸਾਡੀ ਸੇਲਜ਼ ਟੀਮ ਨਾਲ ਸਿੱਧਾ ਸੰਪਰਕ ਕਰ ਸਕਦੇ ਹੋ:',
      salesWa: 'WhatsApp ਕਰੋ', salesCall: 'ਕਾਲ ਕਰੋ: {area}', salesEmail: 'ਸੇਲਜ਼ ਨੂੰ ਈਮੇਲ ਕਰੋ',
      salesNext: 'ਜਾਂ ਕਾਲ ਬੈਕ ਮੰਗੋ, ਸਾਡੀ ਟੀਮ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੇਗੀ।',
      summaryTitle: 'ਇਹ ਰਹੀ ਤੁਹਾਡੀ ਪੁੱਛਗਿੱਛ। ਕਿਰਪਾ ਕਰਕੇ ਜਾਣਕਾਰੀ ਜਾਂਚ ਲਓ, ਫਿਰ ਹੇਠਾਂ ਪੁਸ਼ਟੀ ਕਰੋ।',
      sName: 'ਨਾਮ', sPhone: 'ਮੋਬਾਈਲ', sEmail: 'ਈਮੇਲ', sLang: 'ਭਾਸ਼ਾ', sCat: 'ਉਤਪਾਦ ਸ਼੍ਰੇਣੀ', sSub: 'ਉਪ-ਸ਼੍ਰੇਣੀ',
      sProduct: 'ਉਤਪਾਦ', sQuantity: 'ਮਾਤਰਾ', sSpecs: 'ਸਾਈਜ਼ / ਸਪੈਸੀਫ਼ਿਕੇਸ਼ਨ', sLocation: 'ਡਿਲਿਵਰੀ ਲੋਕੇਸ਼ਨ',
      sTimeline: 'ਸਮਾਂ-ਸੀਮਾ', sQuote: 'ਕੋਟੇਸ਼ਨ ਚਾਹੀਦਾ ਹੈ', sMessage: 'ਸੁਨੇਹਾ', sCall: 'ਕਾਲ ਬੈਕ ਮੰਗਿਆ',
      sYes: 'ਹਾਂ', sNo: 'ਨਹੀਂ', sNone: '—',
      sumDetails: 'ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ', sumRequirement: 'ਤੁਹਾਡੀ ਲੋੜ', sPhotos: 'ਫ਼ੋਟੋਆਂ ਅਤੇ ਡਰਾਇੰਗ', sPhotosN: '{n} ਜੋੜੀਆਂ',
      sNotSure: 'ਹਾਲੇ ਤੈਅ ਨਹੀਂ', tagQuote: 'ਕੋਟੇਸ਼ਨ ਮੰਗਿਆ', tagCall: 'ਕਾਲ ਬੈਕ ਮੰਗਿਆ',
      sumNote: 'ਭੇਜਣ ਤੋਂ ਬਾਅਦ ਸਾਡੀ ਸੇਲਜ਼ ਟੀਮ ਜਲਦੀ ਹੀ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੇਗੀ।',
      confirm: 'ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਭੇਜੋ', edit: 'ਜਾਣਕਾਰੀ ਬਦਲੋ',
      qStyles: 'ਉਪਲਬਧ ਕਿਸਮਾਂ',
      stylesIntro: '**{product}** ਇਨ੍ਹਾਂ ਕਿਸਮਾਂ ਵਿੱਚ ਉਪਲਬਧ ਹਨ:',
      stylesHelp: 'ਤੁਹਾਨੂੰ ਹੁਣੇ ਚੁਣਨ ਦੀ ਲੋੜ ਨਹੀਂ: ਤੁਹਾਡੀ ਥਾਂ ਲਈ ਸਹੀ ਕਿਸਮ ਸਾਡੀ ਟੀਮ ਸੁਝਾਏਗੀ।',
      attachPhoto: 'ਫ਼ੋਟੋ ਜਾਂ ਡਰਾਇੰਗ ਜੋੜੋ', photoOption: '📎 ਫ਼ੋਟੋ ਜਾਂ ਡਰਾਇੰਗ ਭੇਜੋ',
      attachAdd: 'ਫ਼ੋਟੋ ਜਾਂ ਡਰਾਇੰਗ ਜੋੜੋ', attachHint: 'ਫ਼ੋਟੋ (JPG, PNG) ਜਾਂ 3 MB ਤੱਕ ਦੀ PDF ਡਰਾਇੰਗ · ਵੱਧ ਤੋਂ ਵੱਧ {n} ਫ਼ਾਈਲਾਂ',
      pdfLabel: 'PDF ਡਰਾਇੰਗ',
      rq_specificationsPhoto: 'ਤੁਹਾਨੂੰ ਕਿਹੜੀ ਮੋਟਾਈ, ਸਾਈਜ਼ ਜਾਂ ਸਪੈਸੀਫ਼ਿਕੇਸ਼ਨ ਚਾਹੀਦੀ ਹੈ?\nਪੱਕਾ ਨਹੀਂ ਪਤਾ? ਤੁਸੀਂ ਫ਼ੋਟੋ ਜਾਂ ਡਰਾਇੰਗ ਵੀ ਭੇਜ ਸਕਦੇ ਹੋ।',
      photoUploading: 'ਅੱਪਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…',
      photoAdded: 'ਧੰਨਵਾਦ! ਇਸਨੂੰ ਤੁਹਾਡੀ ਪੁੱਛਗਿੱਛ ਵਿੱਚ ਜੋੜ ਦਿੱਤਾ ਗਿਆ ਹੈ, ਤਾਂ ਜੋ ਸਾਡੀ ਟੀਮ ਇਸਨੂੰ ਦੇਖ ਸਕੇ।',
      photosAdded: 'ਧੰਨਵਾਦ! ਸਾਰੀਆਂ {n} ਫ਼ਾਈਲਾਂ ਤੁਹਾਡੀ ਪੁੱਛਗਿੱਛ ਵਿੱਚ ਜੋੜ ਦਿੱਤੀਆਂ ਗਈਆਂ ਹਨ, ਤਾਂ ਜੋ ਸਾਡੀ ਟੀਮ ਇਨ੍ਹਾਂ ਨੂੰ ਦੇਖ ਸਕੇ।',
      photoFailed: 'ਮਾਫ਼ ਕਰਨਾ, ਹਾਲੇ ਤੁਹਾਡੀ ਫ਼ਾਈਲ ਅੱਪਲੋਡ ਨਹੀਂ ਹੋ ਸਕੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ, ਜਾਂ ਇਸਨੂੰ WhatsApp ’ਤੇ ਭੇਜੋ।',
      photoUnsupported: 'ਮਾਫ਼ ਕਰਨਾ, ਇਹ ਫ਼ਾਈਲ ਨਹੀਂ ਖੁੱਲ੍ਹ ਸਕੀ। ਕਿਰਪਾ ਕਰਕੇ ਕੋਈ ਫ਼ੋਟੋ (JPG ਜਾਂ PNG) ਜਾਂ PDF ਡਰਾਇੰਗ ਚੁਣੋ।',
      photoTooBig: 'ਇਹ PDF 3 MB ਤੋਂ ਵੱਡੀ ਹੈ, ਇਸ ਲਈ ਇੱਥੇ ਨਹੀਂ ਭੇਜੀ ਜਾ ਸਕਦੀ। ਕਿਰਪਾ ਕਰਕੇ ਇਸਨੂੰ WhatsApp ’ਤੇ ਭੇਜੋ।',
      photoTooMany: 'ਇੱਕ ਪੁੱਛਗਿੱਛ ਵਿੱਚ ਤੁਸੀਂ {n} ਫ਼ੋਟੋਆਂ ਜਾਂ ਡਰਾਇੰਗ ਤੱਕ ਜੋੜ ਸਕਦੇ ਹੋ। ਹੋਰ ਫ਼ਾਈਲਾਂ ਤੁਸੀਂ WhatsApp ’ਤੇ ਭੇਜ ਸਕਦੇ ਹੋ।',
      photoUnavailable: 'ਮਾਫ਼ ਕਰਨਾ, ਹਾਲੇ ਫ਼ਾਈਲ ਅੱਪਲੋਡ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਤੁਸੀਂ ਇਸਨੂੰ WhatsApp ’ਤੇ ਭੇਜ ਸਕਦੇ ਹੋ।',
      photoContinue: 'ਅੱਗੇ ਵਧੋ', photoAlt: 'ਤੁਹਾਡੀ ਭੇਜੀ ਫ਼ੋਟੋ',
      editTitle: 'ਆਪਣੀ ਜਾਣਕਾਰੀ ਅੱਪਡੇਟ ਕਰੋ:',
      submitting: 'ਤੁਹਾਡੀ ਪੁੱਛਗਿੱਛ ਭੇਜੀ ਜਾ ਰਹੀ ਹੈ…',
      success: 'JK Glasses ਨਾਲ ਸੰਪਰਕ ਕਰਨ ਲਈ ਧੰਨਵਾਦ!\nਤੁਹਾਡੀ ਪੁੱਛਗਿੱਛ ਸਫਲਤਾਪੂਰਵਕ ਭੇਜ ਦਿੱਤੀ ਗਈ ਹੈ।\nਸਾਡੀ ਸੇਲਜ਼ ਟੀਮ ਜਲਦੀ ਹੀ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੇਗੀ।',
      successRef: 'ਹਵਾਲਾ: {ref}',
      failed: 'ਮਾਫ਼ ਕਰਨਾ, ਹਾਲੇ ਤੁਹਾਡੀ ਪੁੱਛਗਿੱਛ ਨਹੀਂ ਭੇਜੀ ਜਾ ਸਕੀ। ਤੁਹਾਡੀ ਗੱਲਬਾਤ ਸੁਰੱਖਿਅਤ ਹੈ, ਕੁਝ ਵੀ ਨਹੀਂ ਗੁਆਚਿਆ।\nਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ, ਜਾਂ WhatsApp ਜਾਂ ਫ਼ੋਨ ’ਤੇ ਸਿੱਧਾ ਸੰਪਰਕ ਕਰੋ।',
      retry: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ',
      closing: 'ਕੀ ਮੈਂ ਕਿਸੇ ਹੋਰ ਚੀਜ਼ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
      newEnquiry: 'ਨਵੀਂ ਪੁੱਛਗਿੱਛ ਸ਼ੁਰੂ ਕਰੋ', closeChat: 'ਚੈਟ ਬੰਦ ਕਰੋ',
      userLang: 'ਭਾਸ਼ਾ: {lang}',
      edited: 'ਮੇਰੀ ਜਾਣਕਾਰੀ ਅੱਪਡੇਟ ਕੀਤੀ',
      confirmed: 'ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਭੇਜੋ'
    }
  };

  /* Words that point a typed question at a product-question intent. */
  var INTENTS = {
    price: ['price', 'prices', 'rate', 'rates', 'cost', 'costs', 'kitne', 'kitna', 'keemat', 'kimat', 'daam', 'कीमत', 'क़ीमत', 'रेट', 'दाम', 'लागत', 'ਕੀਮਤ', 'ਰੇਟ', 'ਭਾਅ', 'ਮੁੱਲ'],
    moq: ['minimum order', 'moq', 'minimum quantity', 'min order', 'न्यूनतम', 'कम से कम', 'ਘੱਟੋ-ਘੱਟ', 'ਘੱਟੋ ਘੱਟ'],
    // Time only: "do you deliver to Jalandhar?" is about service areas and goes to the FAQ.
    delivery: ['delivery time', 'how long', 'how many days', 'how soon', 'lead time', 'time to deliver', 'kitne din', 'कितने दिन', 'कितना समय', 'कब तक', 'डिलीवरी टाइम', 'ਕਿੰਨੇ ਦਿਨ', 'ਕਿੰਨਾ ਸਮਾਂ', 'ਕਦੋਂ ਤੱਕ', 'ਡਿਲਿਵਰੀ ਟਾਈਮ'],
    cert: ['certif', 'iso', 'bis', 'is 2553', 'standard', 'प्रमाण', 'सर्टिफ', 'ਸਰਟੀਫ', 'ਪ੍ਰਮਾਣ'],
    specs: ['thickness', 'thick', 'mm', 'size', 'sizes', 'specification', 'specs', 'dimension', 'maximum size', 'मोटाई', 'साइज़', 'साइज', 'स्पेसिफ', 'ਮੋਟਾਈ', 'ਸਾਈਜ਼', 'ਸਾਈਜ', 'ਸਪੈਸੀਫ'],
    diff: ['difference', 'different', 'compare', 'comparison', ' vs ', 'versus', 'better', 'types', 'which type', 'styles', 'kinds', 'फर्क', 'फ़र्क', 'अंतर', 'तुलना', 'प्रकार', 'ਫ਼ਰਕ', 'ਫਰਕ', 'ਤੁਲਨਾ', 'ਕਿਸਮ'],
    uses: ['used for', 'use it', 'application', 'where can', 'where is', 'uses', 'उपयोग', 'इस्तेमाल', 'ਵਰਤੋਂ', 'ਇਸਤੇਮਾਲ'],
    quote: ['quotation', 'quote', 'estimate', 'कोटेशन', 'अनुमान', 'ਕੋਟੇਸ਼ਨ'],
    contact: ['call me', 'callback', 'call back', 'talk to', 'speak to', 'sales team', 'phone number', 'contact', 'whatsapp', 'संपर्क', 'कॉल', 'ਸੰਪਰਕ', 'ਕਾਲ']
  };

  /* ------------------------------------------------------------- Utilities */
  function readState() {
    try {
      var raw = window.sessionStorage.getItem(STATE_KEY);
      var s = raw ? JSON.parse(raw) : null;
      if (!s || s.v !== STATE_VERSION || Date.now() - (s.updatedAt || 0) > STATE_MAX_AGE) return null;
      return s;
    } catch (e) { return null; }
  }
  function writeState() {
    state.updatedAt = Date.now();
    try { window.sessionStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) { /* private mode: keep in memory */ }
  }
  function randomHex(bytes) {
    var arr = new Uint8Array(bytes);
    (window.crypto || window.msCrypto).getRandomValues(arr);
    return Array.prototype.map.call(arr, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  function freshState(keep) {
    return {
      v: STATE_VERSION,
      sessionKey: randomHex(16),
      startedAt: Date.now(),
      updatedAt: Date.now(),
      open: false,
      lang: (keep && keep.lang) || 'en',
      contact: (keep && keep.contact) || null,
      // attachments: null until the ERP says whether it accepts photos (start response).
      erp: { token: '', ref: '', ai: false, attachments: null, startedOk: false, syncedSeq: 0 },
      seq: 0,
      messages: [],
      stack: [],
      enquiryType: null,
      sel: { cat: null, sub: null, prod: null },
      req: {},
      flags: { quotationRequested: false, salesContactRequested: false },
      lastAnswerKey: '',
      lastQuestion: '',
      submitted: false
    };
  }
  var state = readState() || freshState();

  function lang() { return state.lang; }
  function t(key, params, l) {
    var table = TEXT[l || lang()] || TEXT.en;
    var value = table[key] !== undefined ? table[key] : (TEXT.en[key] !== undefined ? TEXT.en[key] : key);
    if (params) value = value.replace(/\{(\w+)\}/g, function (m, k) { return params[k] !== undefined ? params[k] : m; });
    return value;
  }
  function L(obj, l) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[l || lang()] || obj.en || '';
  }
  function esc(s) {
    return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function inline(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\+91[-\s]?\d{5}[-\s]?\d{5}/g, function (m) { return '<a href="tel:' + m.replace(/[^\d+]/g, '') + '">' + m + '</a>'; })
      .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, function (m) { return '<a href="mailto:' + m + '">' + m + '</a>'; });
  }
  function rich(text) {
    var html = '';
    var list = false;
    String(text || '').split('\n').forEach(function (line) {
      if (/^\s*-\s+/.test(line)) {
        if (!list) { html += '<ul>'; list = true; }
        html += '<li>' + inline(line.replace(/^\s*-\s+/, '')) + '</li>';
      } else {
        if (list) { html += '</ul>'; list = false; }
        if (line.trim()) html += '<p>' + inline(line) + '</p>';
      }
    });
    return html + (list ? '</ul>' : '');
  }
  /** Plain text for the ERP transcript (no markup). */
  function plain(text) { return String(text || '').replace(/\*\*(.+?)\*\*/g, '$1'); }
  function firstName(name) { return String(name || '').trim().split(/\s+/)[0] || ''; }
  function pageHref(page) { return /^[a-z0-9-]+\.html$/.test(page || '') ? page : ''; }
  function waLink(text) {
    return 'https://wa.me/' + (CONTACTS.whatsapp || '918566008869') + (text ? '?text=' + encodeURIComponent(text) : '');
  }

  /* -------------------------------------------------------- Catalogue access */
  function findCat(id) { return CATALOG.categories.filter(function (c) { return c.id === id; })[0] || null; }
  function findSub(cat, id) { return cat ? (cat.subcategories || []).filter(function (s) { return s.id === id; })[0] || null : null; }
  function findProd(sub, id) { return sub ? (sub.products || []).filter(function (p) { return p.id === id; })[0] || null : null; }
  function selected() {
    var cat = findCat(state.sel.cat);
    var sub = findSub(cat, state.sel.sub);
    var prod = findProd(sub, state.sel.prod);
    return { cat: cat, sub: sub, prod: prod };
  }
  function allProducts() {
    var out = [];
    CATALOG.categories.forEach(function (cat) {
      (cat.subcategories || []).forEach(function (sub) {
        (sub.products || []).forEach(function (prod) { out.push({ cat: cat, sub: sub, prod: prod }); });
      });
    });
    return out;
  }

  /* ---------------------------------------------------------- Text matching */
  function normalize(text) {
    return String(text || '').toLowerCase().normalize('NFC')
      .replace(/[़਼‌‍]/g, '')
      .replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ')
      .trim();
  }
  function hasAny(text, words) {
    var padded = ' ' + normalize(text) + ' ';
    return words.some(function (w) {
      var n = normalize(w);
      if (!n) return false;
      if (!/^[a-z0-9 ]+$/.test(n)) return padded.indexOf(n) !== -1;
      // Short Latin words ("iso", "bis", "mm") only as whole words; longer ones as word starts.
      return n.length <= 3 ? padded.indexOf(' ' + n + ' ') !== -1 : padded.indexOf(' ' + n) !== -1;
    });
  }
  var CATEGORY_WORDS = {
    glass: ['glass', 'ग्लास', 'शीशा', 'ਗਲਾਸ', 'ਸ਼ੀਸ਼ਾ'],
    aluminium: ['aluminium', 'aluminum', 'alu', 'एल्युमिनियम', 'एल्यूमीनियम', 'ਐਲੂਮੀਨੀਅਮ'],
    upvc: ['upvc', 'pvc', 'यूपीवीसी', 'ਯੂਪੀਵੀਸੀ', 'windoors']
  };
  /** Categories a question names explicitly ("uPVC vs aluminium"). */
  function mentionedCategories(text) {
    return Object.keys(CATEGORY_WORDS).filter(function (id) { return hasAny(text, CATEGORY_WORDS[id]); });
  }
  function detectIntent(text) {
    var order = ['moq', 'delivery', 'price', 'cert', 'diff', 'specs', 'uses', 'quote', 'contact'];
    for (var i = 0; i < order.length; i++) if (hasAny(text, INTENTS[order[i]])) return order[i];
    return '';
  }
  /** The one product a question names ("price of laminated glass"), or null when none or ambiguous. */
  function detectProduct(text) {
    var norm = ' ' + normalize(text) + ' ';
    var scores = {};
    var entries = {};
    var generic = ['glass', 'ग्लास', 'ਗਲਾਸ', 'windows', 'doors', 'window', 'door', 'and', 'खिड़कियाँ', 'दरवाज़े', 'ਖਿੜਕੀਆਂ', 'ਦਰਵਾਜ਼ੇ', 'और', 'ਅਤੇ'];
    allProducts().forEach(function (entry) {
      LANGS.forEach(function (l) {
        var label = normalize(L(entry.prod.label, l).replace(/\(.*?\)/g, ''));
        var core = label.split(' ').filter(function (w) { return w.length > 2 && generic.indexOf(w) === -1; });
        if (core.length && core.every(function (w) { return norm.indexOf(w) !== -1; })) {
          var score = core.join(' ').length;
          if (!scores[entry.prod.id] || score > scores[entry.prod.id]) { scores[entry.prod.id] = score; entries[entry.prod.id] = entry; }
        }
      });
      // Style words ("sliding window", "casement") ADD to a label match, so
      // "aluminium sliding window" beats "uPVC Windows" while "sliding window"
      // alone stays a tie that the current category settles.
      var kw = 0;
      (entry.prod.keywords || []).forEach(function (k) { if (hasAny(text, [k])) kw = Math.max(kw, normalize(k).length); });
      if (kw) { scores[entry.prod.id] = (scores[entry.prod.id] || 0) + kw; entries[entry.prod.id] = entry; }
    });
    var ids = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; });
    if (!ids.length) return null;
    if (ids.length > 1 && scores[ids[0]] === scores[ids[1]]) {
      // "sliding windows" exists in aluminium AND uPVC: prefer the category already being discussed.
      var cat = state.sel.cat;
      var inCat = ids.filter(function (id) { return scores[id] === scores[ids[0]] && entries[id].cat.id === cat; });
      return inCat.length === 1 ? entries[inCat[0]] : null;
    }
    return entries[ids[0]];
  }

  // FAQ matcher (keywords + shared words), kept from the FAQ-first version.
  var STOPWORDS = {};
  ('a an the is are am was be do does did can could will would should i me my we our you your it its this that these those ' +
    'what which who how when where why of for to in on at by with from about and or but not no yes please tell know want need ' +
    'have has get give show any some there here hai hain kya ka ki ke ko se me mein aur bhi koi ' +
    'क्या है हैं का की के को से में और भी आप आपके आपकी मैं मुझे मेरे यह ये कौन कैसे होता होती होते लिए करते करें सकते ' +
    'ਕੀ ਹੈ ਹਨ ਦਾ ਦੀ ਦੇ ਨੂੰ ਤੋਂ ਵਿੱਚ ਅਤੇ ਵੀ ਤੁਸੀਂ ਤੁਹਾਡੇ ਤੁਹਾਡੀ ਮੈਂ ਮੈਨੂੰ ਮੇਰੇ ਇਹ ਕੌਣ ਕਿਵੇਂ ਹੁੰਦਾ ਹੁੰਦੀ ਲਈ ਕਰਦੇ ਸਕਦੇ ਜਾਂ ਜੀ')
    .split(' ').forEach(function (w) { STOPWORDS[normalize(w)] = true; });
  function contentWords(text) {
    return normalize(text).split(' ').filter(function (w) { return w && !STOPWORDS[w] && (w.length > 2 || /[^\x00-\x7f]/.test(w)); });
  }
  function compileKeyword(raw) {
    var weight = 1;
    if (raw.charAt(0) === '!') { weight = 3; raw = raw.slice(1); } else if (raw.charAt(0) === '~') { weight = 0.5; raw = raw.slice(1); }
    var text = normalize(raw);
    return { text: text, latin: /^[a-z0-9 ]+$/.test(text), whole: text.length <= 3, weight: weight * (1 + 0.5 * (text.split(' ').length - 1)) };
  }
  var faqIndex = {};
  var compiled = FAQ.items.map(function (item) {
    faqIndex[item.id] = item;
    var words = {};
    LANGS.forEach(function (l) { contentWords(item.q && item.q[l]).forEach(function (w) { words[w] = true; }); });
    return {
      id: item.id,
      keywords: (item.keywords || []).map(compileKeyword).filter(function (k) { return k.text; }).sort(function (a, b) { return b.text.length - a.text.length; }),
      words: Object.keys(words)
    };
  });
  function sameWord(a, b) { return a === b || (a.length >= 4 && b.length >= 4 && (a.indexOf(b) === 0 || b.indexOf(a) === 0)); }
  function wordWeight(word) {
    var count = compiled.filter(function (e) { return e.words.some(function (qw) { return sameWord(word, qw); }); }).length;
    return count <= 2 ? 0.5 : count <= 4 ? 0.35 : count <= 7 ? 0.2 : 0;
  }
  function classifyFaq(text) {
    var norm = normalize(text);
    if (!norm) return null;
    var padded = ' ' + norm + ' ';
    var words = contentWords(norm).map(function (w) { return { text: w, weight: wordWeight(w) }; });
    var results = compiled.map(function (entry) {
      var score = 0;
      var matched = [];
      entry.keywords.forEach(function (kw) {
        var hit = kw.latin ? padded.indexOf(' ' + kw.text + (kw.whole ? ' ' : '')) !== -1 : padded.indexOf(kw.text) !== -1;
        if (!hit || matched.some(function (m) { return m.indexOf(kw.text) !== -1; })) return;
        matched.push(kw.text);
        score += kw.weight;
      });
      words.forEach(function (w) { if (entry.words.some(function (qw) { return sameWord(w.text, qw); })) score += w.weight; });
      return { id: entry.id, score: score };
    }).filter(function (r) { return r.score > 0; }).sort(function (a, b) { return b.score - a.score; });
    var best = results[0];
    var second = results[1];
    var gap = best && second ? best.score - second.score : Infinity;
    var wc = contentWords(text).length;
    var minimum = wc <= 1 ? 0.5 : wc >= 4 ? 1.5 : 1;
    if (best && best.score >= minimum && (gap >= 1 || (gap >= 0.5 && best.score >= second.score * 1.25))) return faqIndex[best.id];
    return null;
  }
  function smallTalk(text) {
    var norm = normalize(text);
    if (!norm || norm.split(' ').length > 5) return '';
    var padded = ' ' + norm + ' ';
    var found = '';
    ['thanks', 'hello'].forEach(function (kind) {
      (FAQ.smalltalk[kind] || []).forEach(function (p) { if (!found && padded.indexOf(' ' + normalize(p) + ' ') !== -1) found = kind; });
    });
    return found;
  }

  /* ----------------------------------------------------- Contact validation */
  function validName(name) {
    if (name.length < 2 || name.length > 80 || /https?:|www\.|[<>]/i.test(name)) return false;
    return (name.match(/\p{L}/gu) || []).length >= 2;
  }
  function phoneDigits(cc, number) {
    var d = String(number || '').replace(/\D/g, '');
    if (cc === '91') {
      if (d.length === 12 && d.indexOf('91') === 0) d = d.slice(2);
      if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
      return /^[6-9]\d{9}$/.test(d) ? d : '';
    }
    if (d.indexOf(cc) === 0 && d.length > cc.length + 6) d = d.slice(cc.length);
    d = d.replace(/^0+/, '');
    return d.length >= 6 && d.length + cc.length <= 15 ? d : '';
  }
  function validEmail(email) { return email.length <= 120 && /^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]{2,}$/.test(email); }
  function displayPhone(c) {
    if (!c) return '';
    return c.cc === '91' ? '+91 ' + c.phone.slice(0, 5) + ' ' + c.phone.slice(5) : '+' + c.cc + ' ' + c.phone;
  }

  /* =========================================================== ERP sync */
  var syncTimer = null;
  var syncing = false;
  var startTimer = null;
  var startAttempts = 0;
  var startPromise = null;

  function erpConfigured() { return /^https:\/\//.test(ENDPOINT) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(ENDPOINT); }

  function post(payload, opts) {
    if (!erpConfigured()) return Promise.resolve({ ok: false, error: 'not_configured' });
    var controller = window.AbortController ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, (opts && opts.timeout) || 20000) : null;
    return fetch(ENDPOINT, {
      method: 'POST',
      // text/plain keeps this a "simple" CORS request (no preflight); the ERP parses JSON from the body.
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(payload),
      credentials: 'omit',
      keepalive: !!(opts && opts.keepalive),
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      return res.json().catch(function () { return { ok: false, error: 'bad_response' }; }).then(function (json) {
        if (!json || typeof json !== 'object') json = { ok: false, error: 'bad_response' };
        json.httpStatus = res.status;
        return json;
      });
    }, function () {
      return { ok: false, error: 'network' };
    }).then(function (json) { if (timer) clearTimeout(timer); return json; });
  }

  function transcriptFrom(afterSeq) {
    return state.messages.filter(function (m) { return m.seq > afterSeq && m.text; }).slice(0, BATCH).map(function (m) {
      return {
        seq: m.seq,
        role: m.role === 'user' ? 'VISITOR' : 'BOT',
        kind: m.kind || 'TEXT',
        answerSource: m.role === 'user' ? null : (m.src || 'RULE'),
        text: m.text,
        language: m.lang,
        sentAt: new Date(m.at).toISOString()
      };
    });
  }

  function sessionPayload() {
    var s = selected();
    var req = {};
    REQ_FIELDS.forEach(function (f) { req[f] = state.req[f] || ''; });
    return {
      sessionKey: state.sessionKey,
      token: state.erp.token,
      language: state.lang,
      selection: {
        enquiryType: state.enquiryType,
        category: s.cat ? L(s.cat.label, 'en') : null,
        subcategory: s.sub ? L(s.sub.label, 'en') : null,
        product: s.prod ? L(s.prod.label, 'en') : null
      },
      requirements: req,
      flags: { quotationRequested: !!state.flags.quotationRequested, salesContactRequested: !!state.flags.salesContactRequested }
    };
  }

  function contactPayload() {
    var c = state.contact || {};
    return { name: c.name, countryCode: c.cc, phone: c.phone, email: c.email || '' };
  }

  /** Create (or resume) the lead in the ERP. Resolves { ok, error }. One request at a time. */
  function erpStart(timeout) {
    if (startPromise) return startPromise;
    startPromise = doErpStart(timeout).then(function (res) { startPromise = null; return res; });
    return startPromise;
  }
  function doErpStart(timeout) {
    var payload = contactPayload();
    payload.action = 'start';
    payload.sessionKey = state.sessionKey;
    payload.language = state.lang;
    payload.sourcePage = (location.pathname || '/').slice(0, 200);
    payload.elapsedMs = Date.now() - state.startedAt;
    payload.website = state.hp || '';
    payload.messages = transcriptFrom(0);
    var sentUpTo = payload.messages.length ? payload.messages[payload.messages.length - 1].seq : 0;
    return post(payload, { timeout: timeout }).then(function (res) {
      if (res.ok && res.token) {
        state.erp.token = res.token;
        state.erp.ref = res.ref || '';
        state.erp.ai = res.ai === true;
        if (typeof res.attachments === 'boolean') state.erp.attachments = res.attachments;
        state.erp.startedOk = true;
        state.erp.syncedSeq = Math.max(state.erp.syncedSeq, sentUpTo);
        startAttempts = 0;
        writeState();
        applyChromeLight(); // the photo button follows what the ERP accepts
        scheduleSync(0); // anything newer than the first batch, plus selection / requirements
      }
      return res;
    });
  }

  function retryStartLater() {
    if (startTimer || state.erp.startedOk || !state.contact || !erpConfigured() || startAttempts >= 8) return;
    var delays = [3000, 8000, 20000, 45000, 90000];
    var delay = delays[Math.min(startAttempts, delays.length - 1)];
    startAttempts++;
    startTimer = setTimeout(function () {
      startTimer = null;
      erpStart().then(function (res) { if (!res.ok && isRetryable(res)) retryStartLater(); });
    }, delay);
  }
  function isRetryable(res) {
    return ['network', 'bad_response', 'server_error', 'rate_limited', 'disabled', 'not_configured'].indexOf(res.error) !== -1 || res.httpStatus >= 500;
  }

  function scheduleSync(delay) {
    if (!state.contact) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(syncNow, delay === undefined ? 1500 : delay);
  }

  /** Send everything not yet confirmed. Resolves true when the ERP has it all. */
  function syncNow() {
    if (!state.contact) return Promise.resolve(false);
    if (!state.erp.startedOk) {
      // The lead is not in the ERP yet: the background retry (with back-off) owns
      // that, so ordinary messages don't each fire another start request.
      retryStartLater();
      return Promise.resolve(false);
    }
    if (syncing) { scheduleSync(800); return Promise.resolve(false); }
    syncing = true;
    var payload = sessionPayload();
    payload.action = 'sync';
    payload.messages = transcriptFrom(state.erp.syncedSeq);
    var sentUpTo = payload.messages.length ? payload.messages[payload.messages.length - 1].seq : state.erp.syncedSeq;
    return post(payload).then(function (res) {
      syncing = false;
      if (res.ok) {
        state.erp.syncedSeq = sentUpTo;
        writeState();
        if (transcriptFrom(state.erp.syncedSeq).length) scheduleSync(200);
        return !transcriptFrom(state.erp.syncedSeq).length;
      }
      if (res.error === 'unauthorized') {
        // Token lost (e.g. storage cleared): a start with the same sessionKey resumes the same lead.
        state.erp.startedOk = false;
        state.erp.token = '';
        return erpStart().then(function (r) { return !!r.ok; });
      }
      if (isRetryable(res)) scheduleSync(10000);
      return false;
    });
  }

  /** Final submit. Resolves the ERP response; success ONLY when res.ok. */
  function erpSubmit() {
    var ensure = state.erp.startedOk ? Promise.resolve({ ok: true }) : erpStart();
    return ensure.then(function (res) {
      if (!res.ok) return res;
      var flush = function () {
        if (!transcriptFrom(state.erp.syncedSeq).length) return Promise.resolve(true);
        return syncNow().then(function (done) { return done; });
      };
      return flush().then(function () {
        var payload = sessionPayload();
        payload.action = 'submit';
        payload.contact = contactPayload();
        payload.messages = transcriptFrom(state.erp.syncedSeq);
        var sentUpTo = payload.messages.length ? payload.messages[payload.messages.length - 1].seq : state.erp.syncedSeq;
        return post(payload).then(function (r) {
          if (r.ok) { state.erp.syncedSeq = sentUpTo; if (r.ref) state.erp.ref = r.ref; writeState(); }
          return r;
        });
      });
    });
  }

  // Leaving the page: hand the latest lines to the ERP (keepalive survives the unload).
  function flushOnLeave() {
    if (!state.contact || !state.erp.startedOk) return;
    var pending = transcriptFrom(state.erp.syncedSeq);
    if (!pending.length) return;
    var payload = sessionPayload();
    payload.action = 'sync';
    payload.messages = pending;
    post(payload, { keepalive: true });
  }
  window.addEventListener('pagehide', flushOnLeave);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flushOnLeave(); });

  /* ================================================================= DOM */
  var root = document.createElement('div');
  root.className = 'jk-cb';
  root.innerHTML =
    '<button type="button" class="jk-cb-launcher" aria-haspopup="dialog" aria-expanded="false">' +
      '<span class="jk-cb-launcher-icon" aria-hidden="true">' + robotSvg('jk-bot--launcher') + '</span>' +
      '<span class="jk-cb-launcher-close" aria-hidden="true">' + iconClose() + '</span>' +
    '</button>' +
    '<div class="jk-cb-teaser" hidden><button type="button" class="jk-cb-teaser-text"></button><button type="button" class="jk-cb-teaser-x" aria-label="Dismiss">' + iconClose() + '</button></div>' +
    '<section class="jk-cb-panel" role="dialog" aria-modal="false" aria-labelledby="jk-cb-title" hidden>' +
      '<header class="jk-cb-head">' +
        '<div class="jk-cb-avatar" aria-hidden="true">' + robotSvg('jk-bot--head') + '</div>' +
        '<div class="jk-cb-head-text"><h2 id="jk-cb-title" class="jk-cb-title"></h2><p class="jk-cb-status"><span class="jk-cb-online"></span><span class="jk-cb-status-text"></span></p></div>' +
        '<div class="jk-cb-head-actions">' +
          '<button type="button" class="jk-cb-hbtn jk-cb-back">' + iconBack() + '</button>' +
          '<button type="button" class="jk-cb-hbtn jk-cb-home">' + iconHome() + '</button>' +
          '<div class="jk-cb-langwrap"><button type="button" class="jk-cb-hbtn jk-cb-lang" aria-haspopup="menu" aria-expanded="false"><span class="jk-cb-lang-code"></span></button>' +
            '<div class="jk-cb-langmenu" role="menu" hidden>' + LANGS.map(function (l) { return '<button type="button" role="menuitemradio" data-lang="' + l + '" lang="' + l + '">' + LANG_NAMES[l] + '</button>'; }).join('') + '</div></div>' +
          '<button type="button" class="jk-cb-hbtn jk-cb-x">' + iconClose() + '</button>' +
        '</div>' +
      '</header>' +
      '<div class="jk-cb-log" role="log" aria-live="polite" aria-relevant="additions"></div>' +
      '<form class="jk-cb-composer" autocomplete="off">' +
        '<button type="button" class="jk-cb-attach" hidden>' + iconClip() + '</button>' +
        '<input class="jk-cb-input" type="text" maxlength="1000" />' +
        '<button type="submit" class="jk-cb-send">' + iconSend() + '</button>' +
      '</form>' +
      // Off-screen rather than display:none: some mobile browsers refuse .click() on a hidden file input.
      '<input class="jk-cb-file" type="file" accept="image/*,application/pdf,.pdf" multiple tabindex="-1" aria-hidden="true">' +
      '<p class="jk-cb-note"></p>' +
    '</section>';
  document.body.appendChild(root);

  function q(sel) { return root.querySelector(sel); }
  var launcher = q('.jk-cb-launcher');
  var panel = q('.jk-cb-panel');
  var log = q('.jk-cb-log');
  var composer = q('.jk-cb-composer');
  var input = q('.jk-cb-input');
  var langBtn = q('.jk-cb-lang');
  var langMenu = q('.jk-cb-langmenu');
  var teaser = q('.jk-cb-teaser');
  var attachBtn = q('.jk-cb-attach');
  var fileInput = q('.jk-cb-file');

  function svg(paths) { return '<svg class="jk-cb-icon" viewBox="0 0 24 24" aria-hidden="true">' + paths + '</svg>'; }
  /** The assistant's robot: white head, navy visor with green eyes (blink), antenna light. */
  function robotSvg(extra) {
    return '<svg class="jk-bot ' + (extra || '') + '" viewBox="0 0 64 64" aria-hidden="true" focusable="false">' +
      '<line class="jk-bot-stalk" x1="32" y1="9" x2="32" y2="17"/>' +
      '<circle class="jk-bot-light" cx="32" cy="7.5" r="4"/>' +
      '<rect class="jk-bot-ear" x="6.5" y="29" width="7" height="13" rx="3"/>' +
      '<rect class="jk-bot-ear" x="50.5" y="29" width="7" height="13" rx="3"/>' +
      '<rect class="jk-bot-head" x="11.5" y="16" width="41" height="37" rx="13"/>' +
      '<rect class="jk-bot-visor" x="17" y="23" width="30" height="18" rx="9"/>' +
      '<ellipse class="jk-bot-eye" cx="26" cy="32" rx="3.3" ry="4"/>' +
      '<ellipse class="jk-bot-eye" cx="38" cy="32" rx="3.3" ry="4"/>' +
      '<path class="jk-bot-smile" d="M27 46.5q5 3.2 10 0"/>' +
      '</svg>';
  }
  function iconClose() { return svg('<path d="M6 6l12 12M18 6L6 18"/>'); }
  function iconBack() { return svg('<path d="M15 5l-7 7 7 7"/>'); }
  function iconHome() { return svg('<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/>'); }
  function iconSend() { return svg('<path d="M4 12l16-8-6 16-2-7-8-1z"/>'); }
  function iconClip() { return svg('<path d="M20 11.6l-7.9 7.9a5 5 0 0 1-7.1-7.1l8.6-8.6a3.3 3.3 0 0 1 4.7 4.7l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4l7.9-7.9"/>'); }
  function iconDoc() { return svg('<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h4"/>'); }
  function iconCheck() { return svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'); }
  function iconEdit() { return svg('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'); }
  function iconUser() { return svg('<circle cx="12" cy="8" r="3.6"/><path d="M5 20a7 7 0 0 1 14 0"/>'); }
  function iconList() { return svg('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>'); }
  function iconWa() { return '<svg class="jk-cb-icon jk-cb-icon--fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .3-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.2-1.6-1.2-3s.7-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>'; }
  function iconPhone() { return svg('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'); }
  function iconMail() { return svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'); }
  var OPTION_ICONS = {
    explore: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/>',
    quote: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h4"/>',
    tech: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.7.3-1 .8-1 1.6M12 16.9v.2"/>',
    sales: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    other: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z"/><path d="M8.5 11h7M8.5 14h4.5"/>',
    glass: '<rect x="4.5" y="3" width="15" height="18" rx="1.6"/><path d="M8 8.5l3.5-3.5M8 13.5l8-8M10 18.5l6.5-6.5"/>',
    aluminium: '<rect x="3.5" y="4" width="17" height="16" rx="1.6"/><path d="M12 4v16M3.5 12h17"/>',
    upvc: '<rect x="3.5" y="4" width="17" height="16" rx="3"/><rect x="6.5" y="7" width="11" height="10" rx="1.5"/><path d="M15 11v2"/>'
  };
  function optionIcon(key) { return svg(OPTION_ICONS[key] || OPTION_ICONS.explore); }

  /** The greeting as a branded card: robot, the greeting text, verified trust badges. */
  function welcomeCard(l) {
    var lines = t('greet', null, l).split('\n');
    var trust = TEXT[l] && TEXT[l].trust ? TEXT[l].trust : TEXT.en.trust;
    return '<div class="jk-cb-welcome">' +
      '<div class="jk-cb-welcome-top">' + robotSvg('jk-bot--welcome') +
        '<div><p class="jk-cb-welcome-hi">' + inline(lines[0] || '') + '</p><p class="jk-cb-welcome-title">' + inline(lines[1] || '') + '</p></div>' +
      '</div>' +
      '<div class="jk-cb-welcome-body">' + lines.slice(2).map(function (x) { return '<p>' + inline(x) + '</p>'; }).join('') +
        '<div class="jk-cb-trust">' + trust.map(function (x) { return '<span>' + svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>') + esc(x) + '</span>'; }).join('') + '</div>' +
      '</div>' +
    '</div>';
  }

  function applyChrome() {
    q('.jk-cb-title').textContent = t('title');
    q('.jk-cb-status-text').textContent = t('status');
    q('.jk-cb-note').textContent = t('note');
    q('.jk-cb-back').setAttribute('aria-label', t('back')); q('.jk-cb-back').title = t('back');
    q('.jk-cb-home').setAttribute('aria-label', t('home')); q('.jk-cb-home').title = t('home');
    q('.jk-cb-x').setAttribute('aria-label', t('close')); q('.jk-cb-x').title = t('close');
    langBtn.setAttribute('aria-label', t('language')); langBtn.title = t('language');
    q('.jk-cb-lang-code').textContent = LANG_SHORT[lang()];
    q('.jk-cb-send').setAttribute('aria-label', t('send'));
    attachBtn.setAttribute('aria-label', t('attachPhoto')); attachBtn.title = t('attachPhoto');
    launcher.setAttribute('aria-label', t('launcher'));
    q('.jk-cb-teaser-text').textContent = t('launcherHint');
    Array.prototype.forEach.call(langMenu.querySelectorAll('button'), function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-lang') === lang())); });
    panel.setAttribute('lang', lang());
    updateComposer();
    updateNav();
  }

  function current() { return state.stack[state.stack.length - 1] || null; }
  function updateNav() {
    var cur = current();
    var canNav = !!state.contact && !!cur && cur.id !== 'contact';
    q('.jk-cb-home').hidden = !canNav || cur.id === 'menu';
    q('.jk-cb-back').hidden = !canNav || state.stack.length < 2 || cur.id === 'done';
  }
  function updateComposer() {
    var cur = current();
    var awaiting = cur && (cur.id === 'req');
    var locked = !state.contact || !cur || cur.id === 'lang' || cur.id === 'contact' || cur.id === 'summary' || cur.id === 'edit' || cur.id === 'submitting';
    input.disabled = locked;
    q('.jk-cb-send').disabled = locked;
    input.placeholder = locked ? t('placeholderLocked') : awaiting ? (cur.hint || t('placeholderAnswer')) : t('placeholder');
    // Files need the lead in the ERP, so only after the visitor's details; allowed on the summary and while editing too.
    var canPhoto = photosEnabled();
    attachBtn.hidden = !canPhoto;
    attachBtn.disabled = !canPhoto || photoBusy || !cur || ['lang', 'contact', 'submitting'].indexOf(cur.id) !== -1;
  }

  /* ------------------------------------------------------------- Messages */
  var typingEl = null;
  function setTyping(on) {
    q('.jk-cb-status-text').textContent = on ? t('statusTyping') : t('status');
    if (on && !typingEl) {
      typingEl = document.createElement('div');
      typingEl.className = 'jk-cb-row jk-cb-row--bot';
      typingEl.innerHTML = '<div class="jk-cb-typing" aria-label="' + esc(t('statusTyping')) + '"><span></span><span></span><span></span></div>';
      log.appendChild(typingEl);
      scrollDown();
    } else if (!on && typingEl) {
      typingEl.remove();
      typingEl = null;
    }
  }
  function scrollDown() { window.requestAnimationFrame(function () { log.scrollTop = log.scrollHeight; }); }

  /**
   * Push a message. `ui` describes interactive controls; they are drawn only on
   * the LAST message (older controls are frozen), and are restored after refresh.
   */
  function push(msg) {
    msg.seq = ++state.seq;
    msg.at = Date.now();
    msg.lang = msg.lang || lang();
    state.messages.push(msg);
    if (state.messages.length > 400) state.messages.splice(0, state.messages.length - 400);
    writeState();
    renderAll();
    if (state.contact) scheduleSync();
    return msg;
  }
  function bot(text, ui, opts) {
    opts = opts || {};
    return push({ role: 'bot', text: plain(text), md: text, kind: opts.kind || 'TEXT', src: opts.src || 'RULE', ui: ui || null });
  }
  function user(text, kind) {
    return push({ role: 'user', text: text, kind: kind || 'TEXT' });
  }

  var pendingBots = 0;
  /** Bot reply after a short typing pause (instant with reduced motion). */
  function reply(fn, delay) {
    pendingBots++;
    setTyping(true);
    setBusy(true);
    setTimeout(function () {
      pendingBots--;
      if (!pendingBots) { setTyping(false); setBusy(false); }
      fn();
    }, reduceMotion ? 60 : (delay || 450));
  }
  function setBusy(on) { root.classList.toggle('jk-cb--busy', !!on); }

  function renderAll() {
    var keepTyping = !!typingEl;
    log.innerHTML = '';
    typingEl = null;
    var visible = state.messages.filter(function (m) { return !m.silent; });
    var last = visible[visible.length - 1];
    visible.forEach(function (m) { log.appendChild(renderMessage(m, m === last)); });
    if (pendingPhotoEl) log.appendChild(pendingPhotoEl);
    if (keepTyping) setTyping(true);
    applyChromeLight();
    scrollDown();
  }
  function applyChromeLight() { updateComposer(); updateNav(); }

  function renderMessage(m, isLast) {
    var row = document.createElement('div');
    row.className = 'jk-cb-row jk-cb-row--' + (m.role === 'user' ? 'user' : 'bot');
    row.setAttribute('lang', m.lang || 'en');
    if (m.role === 'user') {
      row.innerHTML = m.img && safeImg(m.img) ? photoHtml(m)
        : m.doc && safeImg(m.doc) ? docHtml(m)
        : '<div class="jk-cb-bubble jk-cb-bubble--user">' + esc(m.text) + '</div>';
      return row;
    }
    var welcome = m.ui && m.ui.type === 'welcome';
    if (welcome) row.className += ' jk-cb-row--welcome';
    var html = (welcome ? '' : '<div class="jk-cb-bot-avatar" aria-hidden="true">' + robotSvg('jk-bot--mini') + '</div>') + '<div class="jk-cb-bot-body">';
    // A product card whose product left the catalogue (an older saved chat) falls back to its text.
    if (m.ui && m.ui.type === 'product') html += productCard(m.ui, m.lang) || '<div class="jk-cb-bubble">' + rich(m.md || m.text) + '</div>';
    else if (m.ui && m.ui.type === 'welcome') html += welcomeCard(m.lang);
    else html += '<div class="jk-cb-bubble' + (m.kind === 'FALLBACK' ? ' jk-cb-bubble--warn' : '') + '">' + rich(m.md || m.text) + '</div>';
    if (m.ui) html += renderUi(m.ui, isLast, m.lang);
    html += '</div>';
    row.innerHTML = html;
    if (isLast && m.ui) bindUi(row, m.ui);
    return row;
  }

  function productCard(ui, l) {
    var entry = { cat: findCat(ui.cat) };
    entry.sub = findSub(entry.cat, ui.sub);
    entry.prod = findProd(entry.sub, ui.prod);
    if (!entry.prod) return '';
    var p = entry.prod;
    var href = pageHref(p.page);
    return '<article class="jk-cb-card">' +
      '<p class="jk-cb-card-crumb">' + esc(L(entry.cat.label, l)) + ' › ' + esc(L(entry.sub.label, l)) + '</p>' +
      '<h3 class="jk-cb-card-title">' + esc(L(p.label, l)) + '</h3>' +
      '<p class="jk-cb-card-text">' + inline(L(p.summary, l)) + '</p>' +
      ((p.points || []).length ? '<p class="jk-cb-card-label">' + esc(t('keyPoints', null, l)) + '</p><ul class="jk-cb-card-list">' + p.points.map(function (pt) { return '<li>' + inline(L(pt, l)) + '</li>'; }).join('') + '</ul>' : '') +
      (p.uses ? '<p class="jk-cb-card-label">' + esc(t('usedFor', null, l)) + '</p><p class="jk-cb-card-text">' + inline(L(p.uses, l)) + '</p>' : '') +
      (href ? '<a class="jk-cb-card-link" href="' + href + '">' + esc(t('readMore', null, l)) + ' →</a>' : '') +
      '</article>';
  }

  function renderUi(ui, active, l) {
    var dis = active ? '' : ' disabled';
    var html = '';
    // The summary carries its own buttons, BELOW the details they confirm.
    if (ui.type === 'summary') return summaryCard(ui, active, l);
    if (ui.options && ui.options.length) {
      var layout = ui.layout === 'lang' ? ' jk-cb-options--lang' : ui.grid ? ' jk-cb-options--grid' : ui.layout === 'list' ? ' jk-cb-options--list' : '';
      html += '<div class="jk-cb-options' + layout + '">' + ui.options.map(function (o, i) {
        var card = o.icon || o.badge || o.sub;
        var inner = esc(o.label);
        if (card) {
          var mark = o.badge ? '<span class="jk-cb-opt-badge">' + esc(o.badge) + '</span>'
            : o.icon ? '<span class="jk-cb-opt-icon">' + optionIcon(o.icon) + '</span>' : '';
          inner = mark + '<span class="jk-cb-opt-text"><span class="jk-cb-opt-label">' + esc(o.label) + '</span>' +
            (o.sub ? '<span class="jk-cb-opt-sub">' + esc(o.sub) + '</span>' : '') + '</span>' +
            (ui.layout === 'list' ? '<span class="jk-cb-opt-chev" aria-hidden="true">›</span>' : '');
        }
        return '<button type="button" class="jk-cb-opt' + (card ? ' jk-cb-opt--card' : '') + (o.primary ? ' jk-cb-opt--primary' : '') + (o.subtle ? ' jk-cb-opt--subtle' : '') + '" data-i="' + i + '"' + (o.lang ? ' lang="' + o.lang + '"' : '') + dis + '>' + inner + '</button>';
      }).join('') + '</div>';
    }
    if (ui.links && ui.links.length) {
      html += '<div class="jk-cb-links">' + ui.links.map(function (page) {
        return '<a class="jk-cb-link" href="' + esc(page) + '">' + esc(pageLabel(page, l)) + ' →</a>';
      }).join('') + '</div>';
    }
    if (ui.type === 'contact' || ui.type === 'edit') html += active ? contactForm(ui, lang()) : '';
    if (ui.contacts) html += contactsHtml(l);
    else if (ui.wa) html += '<div class="jk-cb-contacts">' + waContactHtml(l) + '</div>';
    return html;
  }

  var STATIC_PAGES = {
    'index.html': { en: 'Home', hi: 'होम', pa: 'ਹੋਮ' },
    'about.html': { en: 'About us', hi: 'हमारे बारे में', pa: 'ਸਾਡੇ ਬਾਰੇ' },
    'contact.html': { en: 'Contact & quotation form', hi: 'संपर्क और कोटेशन फ़ॉर्म', pa: 'ਸੰਪਰਕ ਅਤੇ ਕੋਟੇਸ਼ਨ ਫ਼ਾਰਮ' },
    'projects.html': { en: 'Our projects', hi: 'हमारे प्रोजेक्ट', pa: 'ਸਾਡੇ ਪ੍ਰੋਜੈਕਟ' },
    'infrastructure.html': { en: 'Our factory', hi: 'हमारी फ़ैक्टरी', pa: 'ਸਾਡੀ ਫ਼ੈਕਟਰੀ' }
  };
  function pageLabel(page, l) {
    if (STATIC_PAGES[page]) return L(STATIC_PAGES[page], l);
    var label = '';
    CATALOG.categories.forEach(function (cat) {
      if (!label && cat.page === page) label = L(cat.label, l);
      (cat.subcategories || []).forEach(function (sub) {
        (sub.products || []).forEach(function (p) { if (!label && p.page === page) label = L(p.label, l); });
      });
    });
    return label || page.replace(/\.html$/, '').replace(/-/g, ' ');
  }

  function contactsHtml(l) {
    var phones = (CONTACTS.phones || []).map(function (p) {
      return '<a class="jk-cb-contact" href="tel:' + esc(p.number) + '">' + iconPhone() + '<span><strong>' + esc(p.display) + '</strong><small>' + esc(L(p.area, l)) + '</small></span></a>';
    }).join('');
    return '<div class="jk-cb-contacts">' +
      waContactHtml(l) +
      phones +
      (CONTACTS.email ? '<a class="jk-cb-contact" href="mailto:' + esc(CONTACTS.email) + '">' + iconMail() + '<span><strong>' + esc(t('salesEmail', null, l)) + '</strong><small>' + esc(CONTACTS.email) + '</small></span></a>' : '') +
      '</div>';
  }
  function waContactHtml(l) {
    return '<a class="jk-cb-contact jk-cb-contact--wa" href="' + esc(waLink(contactWaText())) + '" target="_blank" rel="noopener">' + iconWa() + '<span><strong>' + esc(t('salesWa', null, l)) + '</strong><small>' + esc(CONTACTS.whatsappDisplay || '') + '</small></span></a>';
  }
  function contactWaText() {
    var s = selected();
    var parts = ['Hello JK Glasses'];
    if (state.contact) parts.push('I am ' + state.contact.name);
    if (s.prod) parts.push('I am interested in ' + L(s.prod.label, 'en'));
    if (state.erp.ref) parts.push('Ref ' + state.erp.ref);
    return parts.join('. ') + '.';
  }

  function contactForm(ui, l) {
    var edit = ui.type === 'edit';
    // While editing, unsaved changes live in editDraft, so adding a file (which redraws the chat) keeps them.
    var d = edit && state.editDraft;
    var c = d || state.contact || state.draft || { cc: '91', phone: '', name: '', email: '' };
    var reqVal = function (f) { return d ? d.req[f] || '' : state.req[f] || ''; };
    var reqFields = edit ? reqFieldsFor().concat(['message']).filter(function (f, i, a) { return a.indexOf(f) === i; }) : [];
    return '<form class="jk-cb-form" novalidate>' +
      field('name', t('fName', null, l), '<input name="name" type="text" autocomplete="name" maxlength="80" required value="' + esc(c.name) + '">') +
      '<div class="jk-cb-field"><label for="jk-cb-phone">' + esc(t('fPhone', null, l)) + ' <span class="jk-cb-req">*</span></label><div class="jk-cb-phone">' +
        '<select name="cc" aria-label="' + esc(t('fCountry', null, l)) + '">' + COUNTRY_CODES.map(function (cc) { return '<option value="' + cc[0] + '"' + (cc[0] === (c.cc || '91') ? ' selected' : '') + '>+' + cc[0] + ' ' + esc(cc[1]) + '</option>'; }).join('') + '</select>' +
        '<input id="jk-cb-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel-national" maxlength="20" required value="' + esc(c.phone) + '"></div><p class="jk-cb-err" data-err="phone"></p></div>' +
      field('email', t('fEmail', null, l) + ' <span class="jk-cb-opt-label">(' + esc(t('fOptional', null, l)) + ')</span>', '<input name="email" type="email" inputmode="email" autocomplete="email" maxlength="120" value="' + esc(c.email || '') + '">', true) +
      reqFields.map(function (f) {
        return '<div class="jk-cb-field"><label>' + esc(t(summaryKey(f), null, l)) + '</label><input name="req-' + f + '" type="text" maxlength="500" value="' + esc(reqVal(f)) + '"></div>';
      }).join('') +
      (edit && (photosEnabled() || sessionPhotos().length) ? '<div class="jk-cb-field"><label>' + esc(t('sPhotos', null, l)) + '</label>' + filesStrip(l, true) + '</div>' : '') +
      '<div class="jk-cb-hp" aria-hidden="true"><label>Website<input name="website" type="text" tabindex="-1" autocomplete="off"></label></div>' +
      (edit ? '' : '<p class="jk-cb-privacy">' + esc(t('privacy', null, l)) + '</p>') +
      '<div class="jk-cb-form-actions"><button type="submit" class="jk-cb-submit">' + esc(edit ? t('fSave', null, l) : t('fContinue', null, l)) + '</button>' +
      (edit ? '<button type="button" class="jk-cb-cancel">' + esc(t('fCancel', null, l)) + '</button>' : '') + '</div>' +
      '</form>';
    function field(name, label, control, optional) {
      return '<div class="jk-cb-field"><label>' + label + (optional ? '' : ' <span class="jk-cb-req">*</span>') + '</label>' + control + '<p class="jk-cb-err" data-err="' + name + '"></p></div>';
    }
  }

  function summaryKey(f) {
    return { quantity: 'sQuantity', specifications: 'sSpecs', deliveryLocation: 'sLocation', timeline: 'sTimeline', quotationDetails: 'sQuote', message: 'sMessage' }[f];
  }
  function summaryRows(l) {
    var s = selected();
    var c = state.contact || {};
    var none = t('sNone', null, l);
    var rows = [
      [t('sName', null, l), c.name],
      [t('sPhone', null, l), displayPhone(c)],
      [t('sEmail', null, l), c.email || none],
      [t('sLang', null, l), LANG_NAMES[state.lang]],
      [t('sCat', null, l), s.cat ? L(s.cat.label, l) : none],
      [t('sSub', null, l), s.sub ? L(s.sub.label, l) : none],
      [t('sProduct', null, l), s.prod ? L(s.prod.label, l) : none],
      [t('sQuantity', null, l), state.req.quantity || none],
      [t('sSpecs', null, l), state.req.specifications || none],
      [t('sLocation', null, l), state.req.deliveryLocation || none],
      [t('sTimeline', null, l), state.req.timeline || none],
      [t('sQuote', null, l), state.flags.quotationRequested ? t('sYes', null, l) : t('sNo', null, l)],
      [t('sMessage', null, l), state.req.message || none]
    ];
    if (state.flags.salesContactRequested) rows.push([t('sCall', null, l), t('sYes', null, l)]);
    return rows;
  }
  /**
   * What the visitor is about to send, as a card: their details, then their
   * requirement (unanswered questions are left out, not shown as "—"), photos,
   * and the Confirm / Edit buttons at the bottom, where the eye ends up.
   */
  function summaryCard(ui, active, l) {
    var s = selected();
    var c = state.contact || {};
    var row = function (label, value) { return value ? '<div><dt>' + esc(label) + '</dt><dd>' + esc(value) + '</dd></div>' : ''; };
    var product = s.prod ? L(s.prod.label, l) : s.sub ? L(s.cat.label, l) + ' › ' + L(s.sub.label, l) : s.cat ? L(s.cat.label, l) : t('sNotSure', null, l);
    var photos = sessionPhotos();
    var tags = [];
    if (state.flags.quotationRequested) tags.push(t('tagQuote', null, l));
    if (state.flags.salesContactRequested) tags.push(t('tagCall', null, l));
    var dis = active ? '' : ' disabled';
    return '<div class="jk-cb-sum">' +
      (tags.length ? '<div class="jk-cb-sum-tags">' + tags.map(function (x) { return '<span>' + iconCheck() + esc(x) + '</span>'; }).join('') + '</div>' : '') +
      '<section class="jk-cb-sum-sec"><h4 class="jk-cb-sum-h">' + iconUser() + esc(t('sumDetails', null, l)) + '</h4><dl class="jk-cb-sum-dl">' +
        row(t('sName', null, l), c.name) + row(t('sPhone', null, l), displayPhone(c)) + row(t('sEmail', null, l), c.email) +
      '</dl></section>' +
      '<section class="jk-cb-sum-sec"><h4 class="jk-cb-sum-h">' + iconList() + esc(t('sumRequirement', null, l)) + '</h4><dl class="jk-cb-sum-dl">' +
        row(t('sProduct', null, l), product) +
        row(t('sQuantity', null, l), state.req.quantity) +
        row(t('sSpecs', null, l), state.req.specifications) +
        row(t('sLocation', null, l), state.req.deliveryLocation) +
        row(t('sTimeline', null, l), state.req.timeline) +
        row(t('sMessage', null, l), state.req.message) +
        (photos.length ? row(t('sPhotos', null, l), t('sPhotosN', { n: photos.length }, l)) : '') +
      '</dl>' +
      filesStrip(l, active) +
      '</section>' +
      '<div class="jk-cb-sum-actions">' + (ui.options || []).map(function (o, i) {
        return '<button type="button" class="jk-cb-sum-btn' + (o.primary ? ' jk-cb-sum-btn--primary' : '') + '" data-i="' + i + '"' + dis + '>' +
          (o.primary ? iconCheck() : iconEdit()) + '<span>' + esc(o.label) + '</span></button>';
      }).join('') + '</div>' +
      '<p class="jk-cb-sum-note">' + esc(t('sumNote', null, l)) + '</p>' +
    '</div>';
  }

  /* ------------------------------------------------------ Photos & drawings */
  var MAX_PHOTOS = 5;
  /** Photos (m.img) and PDF drawings (m.doc) sent in this conversation. */
  function sessionPhotos() { return state.messages.filter(function (m) { return m.img || m.doc; }); }
  /**
   * The files sent so far, plus an "Add a photo or drawing" button while there
   * is room — on the summary card and in the Edit form, where visitors look
   * for it, not only behind the paper-clip in the message bar.
   */
  function filesStrip(l, active) {
    var files = sessionPhotos();
    var canAdd = photosEnabled() && files.length < MAX_PHOTOS;
    if (!files.length && !canAdd) return '';
    return '<div class="jk-cb-files">' + files.map(function (m) {
      return m.doc
        ? '<a class="jk-cb-file-tile jk-cb-file-tile--pdf" href="' + esc(safeImg(m.doc)) + '" target="_blank" rel="noopener" title="' + esc(m.name || '') + '">' + iconDoc() + '<span>PDF</span></a>'
        : '<a class="jk-cb-file-tile" href="' + esc(safeImg(m.img)) + '" target="_blank" rel="noopener"><img src="' + esc(thumbOf(m.img)) + '" alt="" loading="lazy"></a>';
    }).join('') +
    (canAdd ? '<button type="button" class="jk-cb-file-add" data-photo' + (active ? '' : ' disabled') + '>' + iconClip() + '<span>' + esc(t('attachAdd', null, l)) + '</span></button>' : '') +
    '</div>' +
    (canAdd ? '<p class="jk-cb-file-hint">' + esc(t('attachHint', { n: MAX_PHOTOS }, l)) + '</p>' : '');
  }
  function docHtml(m) {
    return '<a class="jk-cb-doc" href="' + esc(safeImg(m.doc)) + '" target="_blank" rel="noopener">' + iconDoc() +
      '<span><strong>' + esc(m.name || 'drawing.pdf') + '</strong><small>' + esc(t('pdfLabel', null, m.lang)) + '</small></span></a>';
  }
  /** Only an https URL (or the local test harness) is ever put in an <img>. */
  function safeImg(url) {
    url = String(url || '');
    return /^https:\/\/[^\s"'<>]+$/.test(url) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/[^\s"'<>]*$/.test(url) ? url : '';
  }
  /** Cloudinary resizes on delivery: a light preview in the chat, the original on tap. */
  function thumbOf(url) {
    url = safeImg(url);
    return /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(url) ? url.replace('/image/upload/', '/image/upload/c_limit,w_480,h_480,q_auto,f_auto/') : url;
  }
  function photoHtml(m) {
    var ratio = +m.w > 0 && +m.h > 0 ? ' style="aspect-ratio:' + (+m.w) + ' / ' + (+m.h) + '"' : '';
    return '<a class="jk-cb-photo" href="' + esc(safeImg(m.img)) + '" target="_blank" rel="noopener">' +
      '<img src="' + esc(thumbOf(m.img)) + '" alt="' + esc(t('photoAlt', null, m.lang)) + '" loading="lazy"' + ratio + '></a>';
  }

  function bindUi(row, ui) {
    Array.prototype.forEach.call(row.querySelectorAll('.jk-cb-opt, .jk-cb-sum-btn'), function (btn) {
      btn.addEventListener('click', function () {
        if (root.classList.contains('jk-cb--busy')) return;
        var o = ui.options[Number(btn.getAttribute('data-i'))];
        if (!o) return;
        if (o.echo !== false) user(o.label, 'OPTION');
        act(o.act, o.data || {});
      });
    });
    Array.prototype.forEach.call(row.querySelectorAll('[data-photo]'), function (btn) {
      btn.addEventListener('click', function () { if (!root.classList.contains('jk-cb--busy')) pickPhoto(); });
    });
    var form = row.querySelector('.jk-cb-form');
    if (form) bindForm(form, ui);
  }

  /* ---------------------------------------------------------- Contact form */
  function bindForm(form, ui) {
    var edit = ui.type === 'edit';
    var nameEl = form.querySelector('[name=name]');
    if (!edit) setTimeout(function () { try { nameEl.focus({ preventScroll: true }); } catch (e) { /* */ } }, 50);
    // Keep typed values if the visitor navigates away and back (or adds a file mid-edit).
    form.addEventListener('input', function () {
      var draft = { name: nameEl.value, cc: form.querySelector('[name=cc]').value, phone: form.querySelector('[name=phone]').value, email: form.querySelector('[name=email]').value };
      if (edit) {
        draft.req = {};
        Array.prototype.forEach.call(form.querySelectorAll('[name^=req-]'), function (inp) { draft.req[inp.name.slice(4)] = inp.value; });
        state.editDraft = draft;
      } else {
        state.draft = draft;
      }
      writeState();
    });
    var cancel = form.querySelector('.jk-cb-cancel');
    if (cancel) cancel.addEventListener('click', function () { act('summary'); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.getAttribute('data-busy')) return;
      var name = nameEl.value.replace(/\s+/g, ' ').trim();
      var cc = form.querySelector('[name=cc]').value;
      var phone = phoneDigits(cc, form.querySelector('[name=phone]').value);
      var email = form.querySelector('[name=email]').value.trim().toLowerCase();
      var errs = {};
      if (!validName(name)) errs.name = t('errName');
      if (!phone) errs.phone = t('errPhone');
      if (email && !validEmail(email)) errs.email = t('errEmail');
      ['name', 'phone', 'email'].forEach(function (k) {
        var el = form.querySelector('[data-err=' + k + ']');
        el.textContent = errs[k] || '';
        var inputEl = form.querySelector('[name=' + k + ']');
        if (inputEl) inputEl.setAttribute('aria-invalid', errs[k] ? 'true' : 'false');
      });
      if (Object.keys(errs).length) {
        var first = form.querySelector('[aria-invalid=true]');
        if (first) first.focus();
        return;
      }
      state.hp = (form.querySelector('[name=website]') || {}).value || '';
      var contact = { name: name, cc: cc, phone: phone, email: email };
      if (edit) {
        Array.prototype.forEach.call(form.querySelectorAll('[name^=req-]'), function (inp) {
          var f = inp.name.slice(4);
          var v = inp.value.trim();
          if (v) state.req[f] = v; else delete state.req[f];
        });
        var phoneChanged = state.contact && (state.contact.phone !== phone || state.contact.cc !== cc);
        state.contact = contact;
        user(t('edited'), 'FORM');
        if (phoneChanged) { /* the ERP updates the lead's phone on submit (contact correction) */ }
        act('summary');
        return;
      }
      form.setAttribute('data-busy', '1');
      var submitBtn = form.querySelector('.jk-cb-submit');
      submitBtn.disabled = true;
      state.contact = contact;
      state.draft = contact; // kept until the ERP accepts it, so a rejected number stays editable
      user(t('detailsUser', { name: name, phone: displayPhone(contact) }) + (email ? ' · ' + email : ''), 'FORM');
      setTyping(true);
      setBusy(true);
      // Create the lead now. Validation errors come back to the form; a network
      // problem does not block the visitor — the ERP call is retried in the background.
      erpStart(9000).then(function (res) {
        setTyping(false);
        setBusy(false);
        if (!res.ok && /^invalid_/.test(res.error || '')) {
          state.contact = null;
          state.messages.pop(); // the details line we just added
          writeState();
          renderAll();
          var key = res.error === 'invalid_name' ? 'name' : res.error === 'invalid_email' ? 'email' : 'phone';
          var f2 = log.querySelector('.jk-cb-form');
          if (f2) { f2.querySelector('[data-err=' + key + ']').textContent = t(key === 'name' ? 'errName' : key === 'email' ? 'errEmail' : 'errPhone'); }
          return;
        }
        if (!res.ok) retryStartLater();
        state.draft = null;
        state.stack = [];
        go('menu');
      });
    });
  }

  /* ========================================================= Screens */
  function go(id, params, opts) {
    opts = opts || {};
    var entry = { id: id, p: params || {} };
    if (opts.replace) state.stack.pop();
    if (!opts.noPush) state.stack.push(entry);
    if (state.stack.length > 40) state.stack.splice(1, state.stack.length - 40);
    reply(function () { SCREENS[id](entry.p, opts); applyChromeLight(); }, opts.delay);
  }

  function back() {
    if (state.stack.length < 2) return;
    state.stack.pop();
    var prev = state.stack[state.stack.length - 1];
    go(prev.id, prev.p, { noPush: true, back: true });
  }
  function home() { state.stack = []; go('menu', { again: true }); }

  var SCREENS = {
    lang: function () {
      bot(t('greet'), { type: 'welcome' });
      // English is the default (the chat already runs in it); all three are offered equally.
      var english = { en: '', hi: 'Hindi', pa: 'Punjabi' };
      bot(t('askLang'), {
        layout: 'lang',
        options: LANGS.map(function (l) {
          return { label: LANG_NAMES[l], sub: english[l], badge: LANG_SHORT[l], lang: l, act: 'setLang', data: { lang: l } };
        })
      });
    },
    contact: function () {
      bot(t('askDetails'), { type: 'contact' });
    },
    menu: function (p) {
      var name = firstName(state.contact && state.contact.name);
      bot(t(p.again || state.messages.some(function (m) { return m.menuShown; }) ? 'menuAgain' : 'menu', { name: name }), {
        grid: true,
        options: [
          { label: t('mExplore'), act: 'explore', icon: 'explore' },
          { label: t('mInfo'), act: 'info', icon: 'info' },
          { label: t('mQuote'), act: 'quote', icon: 'quote' },
          { label: t('mTech'), act: 'tech', icon: 'tech' },
          { label: t('mSales'), act: 'sales', icon: 'sales' },
          { label: t('mOther'), act: 'other', icon: 'other' }
        ]
      });
      state.messages[state.messages.length - 1].menuShown = true;
    },
    categories: function (p) {
      var key = p.mode === 'quote' ? 'pickCategoryQuote' : p.mode === 'info' ? 'pickCategoryInfo' : p.mode === 'ask' ? 'pickProductFirst' : 'pickCategory';
      var opts = CATALOG.categories.map(function (c) {
        return {
          label: L(c.label), icon: c.icon || c.id, act: 'cat', data: { cat: c.id, mode: p.mode },
          sub: (c.subcategories || []).map(function (s) { return L(s.label); }).join(' · ')
        };
      });
      if (p.mode === 'quote') opts.push({ label: t('notSure'), act: 'quoteNoProduct', subtle: true });
      bot(t(key), { layout: 'list', options: opts });
    },
    subcategories: function (p) {
      var cat = findCat(p.cat);
      if (!cat) return SCREENS.categories(p);
      var subs = cat.subcategories || [];
      bot((cat.intro ? L(cat.intro) + '\n' : '') + t('pickSub', { cat: L(cat.label) }), {
        options: subs.map(function (s) { return { label: L(s.label), act: 'sub', data: { cat: cat.id, sub: s.id, mode: p.mode } }; })
      }, { src: 'KNOWLEDGE_BASE' });
    },
    products: function (p) {
      var cat = findCat(p.cat);
      var sub = findSub(cat, p.sub);
      if (!sub) return SCREENS.subcategories(p);
      bot(t('pickProduct', { sub: L(sub.label) }), {
        options: sub.products.map(function (pr) { return { label: L(pr.label), act: 'prod', data: { cat: cat.id, sub: sub.id, prod: pr.id, mode: p.mode } }; })
      });
    },
    product: function (p) {
      var cat = findCat(p.cat);
      var sub = findSub(cat, p.sub);
      var prod = findProd(sub, p.prod);
      if (!prod) return SCREENS.categories(p);
      var points = (prod.points || []).map(function (pt) { return '- ' + L(pt); }).join('\n');
      var text = L(prod.label) + '\n' + L(prod.summary) + (points ? '\n' + t('keyPoints') + ':\n' + points : '') + (prod.uses ? '\n' + t('usedFor') + ': ' + L(prod.uses) : '');
      var m = bot(text, { type: 'product', cat: cat.id, sub: sub.id, prod: prod.id }, { kind: 'ANSWER', src: 'KNOWLEDGE_BASE' });
      m.md = text;
      bot(t('productNext'), {
        options: [
          { label: t('aAsk'), act: 'askProduct' },
          { label: t('aQuote'), act: 'quote', primary: true },
          { label: t('aAnother'), act: 'explore' },
          { label: t('aMenu'), act: 'home', subtle: true }
        ]
      });
    },
    ask: function () {
      var s = selected();
      if (!s.prod) return SCREENS.categories({ mode: 'ask' });
      bot(t('askPrompt', { product: L(s.prod.label) }), { options: intentOptions() });
    },
    tech: function () {
      var popular = FAQ.popular.filter(function (id) { return faqIndex[id]; }).slice(0, 4);
      bot(t('techPrompt'), {
        options: popular.map(function (id) { return { label: L(faqIndex[id].q), act: 'faq', data: { id: id } }; })
      });
    },
    sales: function () {
      bot(t('salesIntro'), { contacts: true });
      bot(t('salesNext'), {
        options: [
          { label: t('aCallback'), act: 'callback', primary: true },
          { label: t('aMenu'), act: 'home', subtle: true }
        ]
      });
    },
    req: function (p) {
      var f = p.field;
      var key = f === 'message' && state.enquiryType === 'OTHER' ? 'rq_messageOther' : 'rq_' + f;
      var opts = [];
      if (f === 'timeline') opts = ['tNow', 't1m', 't3m', 'tLater'].map(function (k) { return { label: t(k), act: 'answer', data: { field: f, value: t(k) } }; });
      // Many visitors can't name a size or spec: a photo of the opening says it for them.
      if (f === 'specifications' && photosEnabled()) {
        key = 'rq_specificationsPhoto';
        opts.push({ label: t('photoOption'), act: 'photo', echo: false });
      }
      if (!(f === 'message' && state.enquiryType === 'OTHER')) opts.push({ label: t('skip'), act: 'skipField', data: { field: f }, subtle: true });
      var cur = current();
      cur.hint = hintFor(f);
      bot(t(key), { options: opts });
      setTimeout(function () { if (!input.disabled) try { input.focus({ preventScroll: true }); } catch (e) { /* */ } }, 30);
    },
    summary: function () {
      bot(t('summaryTitle'), {
        type: 'summary',
        options: [
          { label: t('confirm'), act: 'submit', primary: true },
          { label: t('edit'), act: 'edit' }
        ]
      }, { kind: 'SUMMARY' });
      // The transcript keeps a readable copy of what the visitor confirmed.
      var m = state.messages[state.messages.length - 1];
      var photos = sessionPhotos().length;
      m.text = plain(t('summaryTitle')) + '\n' + summaryRows(lang()).map(function (r) { return r[0] + ': ' + r[1]; }).join('\n') +
        (photos ? '\n' + t('sPhotos') + ': ' + photos : '');
      writeState();
    },
    edit: function () {
      bot(t('editTitle'), { type: 'edit' }, { kind: 'FORM' });
    },
    submitting: function () { doSubmit(); },
    done: function () {
      bot(t('success') + (state.erp.ref ? '\n' + t('successRef', { ref: state.erp.ref }) : ''), null, { kind: 'STATUS' });
      bot(t('closing'), {
        options: [
          { label: t('mExplore'), act: 'explore' },
          { label: t('newEnquiry'), act: 'newEnquiry' },
          { label: t('closeChat'), act: 'close', subtle: true, echo: false }
        ]
      });
    }
  };

  function intentOptions() {
    var prod = selected().prod;
    var styled = !!(prod && prod.styles && prod.styles.length);
    var opts = [
      { label: t('qSpecs'), act: 'intent', data: { intent: 'specs' } },
      { label: t('qPrice'), act: 'intent', data: { intent: 'price' } },
      { label: t('qMoq'), act: 'intent', data: { intent: 'moq' } },
      { label: t('qDelivery'), act: 'intent', data: { intent: 'delivery' } },
      { label: t('qCert'), act: 'intent', data: { intent: 'cert' } },
      { label: t('qUses'), act: 'intent', data: { intent: 'uses' } }
    ];
    // Windows / doors: "which types are there?" is the natural question, so it comes first.
    if (styled) opts.unshift({ label: t('qStyles'), act: 'intent', data: { intent: 'diff' } });
    else opts.splice(5, 0, { label: t('qDiff'), act: 'intent', data: { intent: 'diff' } });
    return opts;
  }

  function hintFor(f) {
    var s = selected();
    var hints = (s.prod && s.prod.hints) || {};
    var catHints = (s.cat && s.cat.hints) || {};
    if (hints[f]) return L(hints[f]);
    if (catHints[f]) return L(catHints[f]);
    if (f === 'deliveryLocation') return t('hintLocation');
    return t('hintMessage');
  }

  function reqFieldsFor() {
    var s = selected();
    return (s.prod && s.prod.ask) || (s.cat && s.cat.ask) || ['quantity', 'specifications', 'deliveryLocation', 'timeline'];
  }

  /** Ask only the questions relevant to this enquiry, skipping ones already answered. */
  function startRequirements(type) {
    state.enquiryType = type;
    var fields;
    if (type === 'QUOTATION') {
      state.flags.quotationRequested = true;
      fields = reqFieldsFor().concat(['message']);
      bot(t('reqIntro'));
    } else if (type === 'SALES') {
      fields = ['message'];
      bot(t('reqIntroSales'));
    } else {
      fields = ['message'];
    }
    var queue = fields.filter(function (f, i, a) { return a.indexOf(f) === i && !state.req[f]; });
    scheduleSync(0);
    askNext(queue);
  }
  /** Each question's screen carries the questions still to come, so Back re-asks it without skipping any. */
  function askNext(queue) {
    writeState();
    if (queue.length) go('req', { field: queue[0], rest: queue.slice(1) });
    else go('summary');
  }

  /* ========================================================= Actions */
  function act(name, d) {
    d = d || {};
    switch (name) {
      case 'setLang':
        setLanguage(d.lang, true);
        if (!state.contact) go('contact');
        else go('menu');
        return;
      case 'home': return home();
      case 'explore':
        state.enquiryType = state.enquiryType && state.enquiryType !== 'PRODUCTS' ? state.enquiryType : 'PRODUCTS';
        scheduleSync();
        return go('categories', { mode: 'explore' });
      case 'info':
        state.enquiryType = 'PRODUCT_INFO';
        scheduleSync();
        return go('categories', { mode: 'info' });
      case 'quote': {
        var s = selected();
        if (s.prod) return reply(function () { startRequirements('QUOTATION'); });
        state.enquiryType = 'QUOTATION';
        return go('categories', { mode: 'quote' });
      }
      case 'quoteNoProduct':
        state.sel = { cat: null, sub: null, prod: null };
        return reply(function () { startRequirements('QUOTATION'); });
      case 'tech':
        state.enquiryType = state.enquiryType || 'TECHNICAL';
        if (state.enquiryType === 'PRODUCTS') state.enquiryType = 'TECHNICAL';
        scheduleSync();
        return go('tech');
      case 'sales':
        return go('sales');
      case 'callback':
        state.flags.salesContactRequested = true;
        if (!state.enquiryType || state.enquiryType === 'PRODUCTS') state.enquiryType = 'SALES';
        scheduleSync(0);
        return reply(function () { startRequirements('SALES'); });
      case 'other':
        state.enquiryType = 'OTHER';
        return reply(function () { startRequirements('OTHER'); });
      case 'cat': {
        state.sel = { cat: d.cat, sub: null, prod: null };
        var cat = findCat(d.cat);
        scheduleSync();
        if (cat && cat.subcategories.length === 1) { state.sel.sub = cat.subcategories[0].id; return go('products', { cat: d.cat, sub: state.sel.sub, mode: d.mode }); }
        return go('subcategories', { cat: d.cat, mode: d.mode });
      }
      case 'sub': {
        state.sel = { cat: d.cat, sub: d.sub, prod: null };
        var sub = findSub(findCat(d.cat), d.sub);
        scheduleSync();
        if (sub && sub.products.length === 1) return act('prod', { cat: d.cat, sub: d.sub, prod: sub.products[0].id, mode: d.mode });
        return go('products', { cat: d.cat, sub: d.sub, mode: d.mode });
      }
      case 'prod':
        state.sel = { cat: d.cat, sub: d.sub, prod: d.prod };
        state.lastAnswerKey = '';
        scheduleSync();
        if (d.mode === 'ask') return go('ask');
        if (d.mode === 'quote') return reply(function () { startRequirements('QUOTATION'); });
        return go('product', { cat: d.cat, sub: d.sub, prod: d.prod, mode: d.mode });
      case 'askProduct': return go('ask');
      case 'intent': return reply(function () { answerIntent(d.intent); });
      case 'faq': return reply(function () { answerFaq(faqIndex[d.id], L(faqIndex[d.id] && faqIndex[d.id].q)); });
      case 'answer': return setRequirement(d.field, d.value);
      case 'skipField': return setRequirement(d.field, '');
      case 'sendTeam':
        if (state.lastQuestion && (state.req.message || '').indexOf(state.lastQuestion) === -1) {
          state.req.message = state.req.message ? state.req.message + '\n' + state.lastQuestion : state.lastQuestion;
        }
        if (!state.enquiryType || state.enquiryType === 'PRODUCTS') state.enquiryType = 'TECHNICAL';
        return go('summary');
      case 'summary':
        state.editDraft = null; // saved or cancelled: the draft is done
        return go('summary', null, { replace: current() && current().id === 'edit' });
      case 'edit':
        state.editDraft = null;
        return go('edit');
      case 'submit': return go('submitting');
      case 'newEnquiry': {
        var keep = { lang: state.lang, contact: state.contact };
        var firstOpened = state.startedAt;
        clearTimeout(syncTimer);
        state = freshState(keep);
        // Same visitor: the bot-timing check counts from when they first opened the chat.
        state.startedAt = firstOpened;
        writeState();
        renderAll();
        // A new conversation for the same visitor: the ERP attaches it to their open lead.
        erpStart(9000).then(function (res) { if (!res.ok) retryStartLater(); });
        return go('menu', { again: true });
      }
      case 'close': return toggle(false);
      case 'photo': return pickPhoto();
      case 'photoRetry': {
        if (!failedPhotos.length) return pickPhoto();
        var again = failedPhotos;
        failedPhotos = [];
        return sendPhotos(again);
      }
      case 'photoContinue':
        failedPhotos = [];
        return reply(function () { continueAfterPhoto(''); });
    }
  }

  function setRequirement(field, value) {
    if (value) state.req[field] = String(value).slice(0, 1000);
    else delete state.req[field];
    scheduleSync();
    var cur = current();
    askNext(cur && cur.id === 'req' && cur.p.field === field ? cur.p.rest || [] : []);
  }

  function setLanguage(l, chosen) {
    if (LANGS.indexOf(l) === -1) return;
    var changed = state.lang !== l;
    state.lang = l;
    writeState();
    applyChrome();
    if (changed && !chosen) {
      var cur = current();
      var replay = cur && ['submitting', 'done', 'lang'].indexOf(cur.id) === -1;
      if (state.contact) {
        user(t('userLang', { lang: LANG_NAMES[l] }), 'OPTION');
        bot(t('langChanged'));
      }
      // Ask the current question again in the new language.
      if (replay) go(cur.id, cur.p, { noPush: true, delay: 1 });
      else renderAll();
    }
    scheduleSync();
  }

  /* ================================================= Answering questions */
  function answerOptions(extra) {
    var opts = (extra || []).slice();
    if (selected().prod) opts.push({ label: t('aAskMore'), act: 'askProduct' });
    opts.push({ label: t('aQuote'), act: 'quote', primary: !opts.length });
    opts.push({ label: t('mSales'), act: 'sales' });
    opts.push({ label: t('aMenu'), act: 'home', subtle: true });
    return opts;
  }
  function fallbackOptions() {
    var opts = [{ label: t('aCallback'), act: 'callback', primary: true }];
    if (state.lastQuestion) opts.push({ label: t('aSendTeam'), act: 'sendTeam' });
    opts.push({ label: t('aMenu'), act: 'home', subtle: true });
    return { options: opts, contacts: true };
  }
  function fallback(key) {
    state.lastAnswerKey = '';
    bot(t(key || 'noVerified'), fallbackOptions(), { kind: 'FALLBACK', src: 'RULE' });
  }
  /** Avoid repeating the same answer twice in a row. */
  function repeated(key) {
    if (state.lastAnswerKey === key) {
      bot(t('repeat'), { options: answerOptions() });
      return true;
    }
    state.lastAnswerKey = key;
    return false;
  }

  function answerIntent(intent) {
    var s = selected();
    var name = s.prod ? L(s.prod.label) : '';
    switch (intent) {
      case 'specs':
        if (!s.prod) return go('categories', { mode: 'ask' }, { delay: 1 });
        if (repeated('specs:' + s.prod.id)) return;
        if (s.prod.specs) return bot(L(s.prod.specs) + (s.cat.common ? '\n' + L(s.cat.common) : ''), { options: answerOptions() }, { kind: 'ANSWER', src: 'KNOWLEDGE_BASE' });
        if (s.cat.common) return bot(L(s.cat.common) + '\n' + t('specsNone', { product: name }), { options: answerOptions() }, { kind: 'ANSWER', src: 'KNOWLEDGE_BASE' });
        return bot(t('specsNone', { product: name }), fallbackOptions(), { kind: 'FALLBACK', src: 'RULE' });
      case 'price':
        if (repeated('price')) return;
        return bot(t('price') + '\n' + L(CATALOG.facts.quoteResponse), { options: answerOptions() }, { kind: 'ANSWER', src: 'RULE' });
      case 'moq':
        return fallback('noVerifiedMoq');
      case 'delivery':
        return fallback('noVerifiedDelivery');
      case 'cert':
        if (repeated('cert')) return;
        return bot(L(CATALOG.facts.certifications), { options: answerOptions() }, { kind: 'ANSWER', src: 'KNOWLEDGE_BASE' });
      case 'uses':
        if (!s.prod) return go('categories', { mode: 'ask' }, { delay: 1 });
        if (repeated('uses:' + s.prod.id)) return;
        return bot('**' + name + '**: ' + L(s.prod.uses), { options: answerOptions() }, { kind: 'ANSWER', src: 'KNOWLEDGE_BASE' });
      case 'diff': {
        if (!s.prod) return go('categories', { mode: 'ask' }, { delay: 1 });
        if (s.prod.styles && s.prod.styles.length) {
          if (repeated('diff:' + s.prod.id)) return;
          var styles = s.prod.styles.map(function (st) { return '- **' + L(st.label) + '**: ' + L(st.text); }).join('\n');
          return bot(t('stylesIntro', { product: name }) + '\n' + styles + '\n' + t('stylesHelp'), { options: answerOptions() }, { kind: 'ANSWER', src: 'KNOWLEDGE_BASE' });
        }
        if (repeated('diff:' + s.sub.id)) return;
        if (s.sub.products.length < 2) return bot(t('compareSingle', { product: name }), { options: [{ label: t('aAnother'), act: 'explore' }].concat(answerOptions()) }, { kind: 'ANSWER', src: 'KNOWLEDGE_BASE' });
        var lines = s.sub.products.map(function (p) { return '- **' + L(p.label) + '**: ' + L(p.summary); }).join('\n');
        return bot(t('compareIntro', { sub: L(s.sub.label) }) + '\n' + lines, { options: answerOptions() }, { kind: 'ANSWER', src: 'KNOWLEDGE_BASE' });
      }
      case 'quote': return act('quote');
      case 'contact': return go('sales', null, { delay: 1 });
    }
    return fallback();
  }

  function answerFaq(item, question) {
    if (!item) return fallback();
    if (repeated('faq:' + item.id)) return;
    var extra = [];
    (item.related || []).slice(0, 2).forEach(function (id) { if (faqIndex[id]) extra.push({ label: L(faqIndex[id].q), act: 'faq', data: { id: id } }); });
    if (item.cta === 'callback') extra.push({ label: t('aCallback'), act: 'callback' });
    var ui = { options: answerOptions(extra), links: (item.links || []).filter(pageHref).slice(0, 2) };
    if (item.contacts) ui.contacts = true;
    bot(L(item.a), ui, { kind: 'ANSWER', src: 'KNOWLEDGE_BASE' });
  }

  /** Free text typed by the visitor. */
  function handleText(text) {
    var cur = current();
    if (cur && cur.id === 'req') {
      user(text, 'TEXT');
      return setRequirement(cur.p.field, text);
    }
    user(text, 'TEXT');
    state.lastQuestion = text;
    reply(function () {
      var talk = smallTalk(text);
      if (talk) return bot(t(talk === 'thanks' ? 'thanks' : 'hello'), { options: answerOptions() });
      // A product named in the question becomes the context ("price of laminated glass").
      var named = detectProduct(text);
      if (named) { state.sel = { cat: named.cat.id, sub: named.sub.id, prod: named.prod.id }; scheduleSync(); }
      var intent = detectIntent(text);
      if (intent === 'quote') return act('quote');
      if (intent === 'contact') return go('sales', null, { delay: 1 });
      // 1. A question about the product being discussed: answer from that product's verified facts —
      //    unless it names another category ("uPVC vs aluminium" while looking at glass).
      var cats = mentionedCategories(text);
      var aboutCurrent = !!selected().prod && (named || !cats.length || (cats.length === 1 && cats[0] === state.sel.cat));
      if (intent && aboutCurrent) return answerIntent(intent);
      // 2. The verified FAQ — but never a glass answer to a question that names only aluminium, etc.
      var item = classifyFaq(text);
      var productTopic = item && ['glass', 'aluminium', 'upvc'].indexOf(item.topic) !== -1;
      if (item && !(cats.length && productTopic && cats.indexOf(item.topic) === -1)) return answerFaq(item, text);
      // 3. Company-wide rules (price, minimum order, delivery, certifications) or "which product?".
      if (intent) {
        if (!aboutCurrent && ['specs', 'uses', 'diff'].indexOf(intent) !== -1) {
          state.sel = { cat: cats.length === 1 ? cats[0] : null, sub: null, prod: null };
          return cats.length === 1 ? go('subcategories', { cat: cats[0], mode: 'ask' }, { delay: 1 }) : go('categories', { mode: 'ask' }, { delay: 1 });
        }
        return answerIntent(intent);
      }
      if (named) return go('product', { cat: named.cat.id, sub: named.sub.id, prod: named.prod.id }, { delay: 1 });
      // Future: when the ERP reports ai === true, an AI answer is requested here (ERP 'ask' action).
      return fallback();
    });
  }

  /* ============================================================ Submit */
  var submitting = false;
  function doSubmit() {
    if (submitting) return;
    submitting = true;
    bot(t('submitting'), null, { kind: 'STATUS' });
    setTyping(true);
    setBusy(true);
    var attempt = function (n) {
      return erpSubmit().then(function (res) {
        if (res.ok) return res;
        if (n < 1 && isRetryable(res) && res.error !== 'not_configured' && res.error !== 'disabled') {
          return new Promise(function (r) { setTimeout(r, 2500); }).then(function () { return attempt(n + 1); });
        }
        return res;
      });
    };
    attempt(0).then(function (res) {
      submitting = false;
      setTyping(false);
      setBusy(false);
      if (res.ok) {
        state.submitted = true;
        state.stack = [{ id: 'done', p: {} }];
        writeState();
        SCREENS.done();
        applyChromeLight();
        return;
      }
      // Back to the summary step (nothing is lost); "Try again" submits the same enquiry.
      if (current() && current().id === 'submitting') state.stack.pop();
      bot(t('failed'), {
        options: [{ label: t('retry'), act: 'submit', primary: true }, { label: t('aMenu'), act: 'home', subtle: true }],
        contacts: true
      }, { kind: 'STATUS' });
      applyChromeLight();
    });
  }

  /* ======================================================== Photo upload */
  var photoBusy = false;
  var failedPhotos = [];
  var pendingPhotoEl = null;

  /**
   * Only when the ERP has said it accepts photos (`attachments: true` in its
   * start response). An ERP without the `attach` action, or with Cloudinary off,
   * never shows a camera button that could only fail.
   */
  function photosEnabled() { return !!state.contact && state.erp.attachments === true && erpConfigured(); }

  function pickPhoto() {
    if (!photosEnabled() || photoBusy || root.classList.contains('jk-cb--busy')) return;
    fileInput.value = '';
    fileInput.click();
  }

  /**
   * Decode the chosen image and re-encode it as a JPEG of at most 1600 px (phone
   * photos are 3–12 MB; this is ~200–600 KB), plus a tiny preview for the
   * "uploading" bubble. Rejects with a TEXT key when the file can't be opened
   * (e.g. HEIC outside Safari, or not an image at all).
   */
  var MAX_PDF_BYTES = 3 * 1000 * 1000; // the ERP's LIMITS.pdfBytes
  function preparePhoto(file) {
    var isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '');
    if (isPdf) return preparePdf(file);
    return new Promise(function (resolve, reject) {
      var looksImage = /^image\//.test(file.type || '') || /\.(jpe?g|png|webp|gif|bmp|heic|heif)$/i.test(file.name || '');
      if (!looksImage || file.size > 40 * 1024 * 1024) return reject('photoUnsupported');
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        try {
          var w = img.naturalWidth;
          var h = img.naturalHeight;
          if (!w || !h) throw new Error('empty image');
          var encode = function (maxSide, quality) {
            var scale = Math.min(1, maxSide / Math.max(w, h));
            var canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(w * scale));
            canvas.height = Math.max(1, Math.round(h * scale));
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = '#fff'; // transparent PNGs become white, not black
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/jpeg', quality);
          };
          var data = encode(1600, 0.82);
          if (data.length > 2400000) data = encode(1280, 0.72);
          if (data.length > 3000000) data = encode(1024, 0.6);
          var preview = encode(360, 0.7);
          URL.revokeObjectURL(url);
          resolve({ name: (file.name || 'photo').slice(0, 120), data: data.slice(data.indexOf(',') + 1), preview: preview, seq: 0 });
        } catch (e) {
          URL.revokeObjectURL(url);
          reject('photoUnsupported');
        }
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject('photoUnsupported'); };
      img.src = url;
    });
  }

  /** A PDF drawing is sent as-is (it can't be shrunk in the browser), so it has its own size limit. */
  function preparePdf(file) {
    return new Promise(function (resolve, reject) {
      if (file.size > MAX_PDF_BYTES) return reject('photoTooBig');
      var reader = new FileReader();
      reader.onload = function () {
        var data = String(reader.result || '');
        resolve({ name: (file.name || 'drawing.pdf').slice(0, 120), data: data.slice(data.indexOf(',') + 1), preview: '', pdf: true, seq: 0 });
      };
      reader.onerror = function () { reject('photoUnsupported'); };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Send one prepared photo. Its seq is taken once and kept for retries: the
   * ERP stores (session, seq) once, so "Try again" after a lost response can
   * never store the same photo twice.
   */
  function uploadPhoto(prep) {
    var ensure = state.erp.startedOk ? Promise.resolve({ ok: true }) : erpStart(9000);
    return ensure.then(function (res) {
      if (!res.ok) return res;
      if (state.erp.attachments === false) return { ok: false, error: 'attachments_unavailable' };
      if (!prep.seq) { prep.seq = ++state.seq; writeState(); }
      var send = function () {
        return post({
          action: 'attach', sessionKey: state.sessionKey, token: state.erp.token, seq: prep.seq, language: state.lang,
          file: { name: prep.name, data: prep.data }
        }, { timeout: 60000 });
      };
      return send().then(function (r) {
        if (r.error !== 'unauthorized') return r;
        state.erp.startedOk = false;
        return erpStart().then(function (s) { return s.ok ? send() : s; });
      });
    }).then(function (r) {
      if (r.ok) {
        var url = safeImg(r.url);
        if (!url) return { ok: false, error: 'bad_response' };
        state.messages.push(prep.pdf
          ? { role: 'user', kind: 'ATTACHMENT', text: 'Drawing (PDF): ' + prep.name, doc: url, name: prep.name, seq: prep.seq, at: Date.now(), lang: lang() }
          : { role: 'user', kind: 'ATTACHMENT', text: 'Photo: ' + prep.name, img: url, w: +r.width || 0, h: +r.height || 0, seq: prep.seq, at: Date.now(), lang: lang() });
        writeState();
        renderAll();
        scheduleSync();
      } else if (r.error === 'seq_conflict') {
        prep.seq = 0; // that number was taken by another line: the next try takes a fresh one
      }
      return r;
    });
  }

  function showPendingPhoto(prep) {
    hidePendingPhoto();
    var status = '<span class="jk-cb-photo-status"><span class="jk-cb-spin" aria-hidden="true"></span>' + esc(t('photoUploading')) + '</span>';
    pendingPhotoEl = document.createElement('div');
    pendingPhotoEl.className = 'jk-cb-row jk-cb-row--user';
    pendingPhotoEl.innerHTML = prep.pdf
      ? '<div class="jk-cb-doc jk-cb-doc--pending" role="status">' + iconDoc() + '<span><strong>' + esc(prep.name) + '</strong>' + status + '</span></div>'
      : '<div class="jk-cb-photo jk-cb-photo--pending" role="status"><img src="' + esc(prep.preview) + '" alt="">' + status + '</div>';
    log.appendChild(pendingPhotoEl);
    scrollDown();
  }
  function hidePendingPhoto() {
    if (pendingPhotoEl) pendingPhotoEl.remove();
    pendingPhotoEl = null;
  }

  /** Upload the chosen photos one at a time, then say what happened once. */
  function sendPhotos(items) {
    if (photoBusy || !items.length) return;
    var room = MAX_PHOTOS - sessionPhotos().length;
    if (room <= 0) return photoProblem('photoTooMany', [], 0);
    var extra = items.length > room;
    items = items.slice(0, room);
    photoBusy = true;
    setBusy(true);
    applyChromeLight();
    var sent = 0;
    var finish = function (errKey, left) {
      photoBusy = false;
      hidePendingPhoto();
      setBusy(false);
      applyChromeLight();
      if (errKey) return photoProblem(errKey, left, sent);
      if (extra) return photoProblem('photoTooMany', [], sent);
      reply(function () { continueAfterPhoto(t(sent > 1 ? 'photosAdded' : 'photoAdded', { n: sent })); });
    };
    var step = function (k) {
      if (k >= items.length) return finish(null);
      var item = items[k];
      (item.prep ? Promise.resolve(item.prep) : preparePhoto(item.file)).then(function (prep) {
        item.prep = prep;
        showPendingPhoto(prep);
        return uploadPhoto(prep).then(function (r) {
          if (r.ok) { sent++; return step(k + 1); }
          var e = r.error;
          var key = e === 'too_many_files' ? 'photoTooMany'
            : e === 'attachments_unavailable' || e === 'invalid_action' || e === 'not_configured' || e === 'disabled' ? 'photoUnavailable'
            : e === 'file_too_large' && prep.pdf ? 'photoTooBig'
            : e === 'invalid_file' || e === 'file_too_large' ? 'photoUnsupported'
            : 'photoFailed';
          if (e === 'attachments_unavailable' || e === 'invalid_action') { state.erp.attachments = false; writeState(); }
          finish(key, key === 'photoFailed' ? items.slice(k) : []);
        });
      }, function (key) {
        finish(typeof key === 'string' ? key : 'photoUnsupported', []);
      });
    };
    step(0);
  }

  /** Something went wrong: say so plainly, offer WhatsApp, and let the visitor carry on. */
  function photoProblem(key, left, sent) {
    failedPhotos = left || [];
    reply(function () {
      var done = sent ? t(sent > 1 ? 'photosAdded' : 'photoAdded', { n: sent }) + '\n' : '';
      var opts = [];
      if (failedPhotos.length) opts.push({ label: t('retry'), act: 'photoRetry', primary: true });
      opts.push({ label: t('photoContinue'), act: 'photoContinue', subtle: !!failedPhotos.length });
      bot(done + t(key, { n: MAX_PHOTOS }), { options: opts, wa: true }, { kind: 'STATUS' });
    });
  }

  /** After a photo: confirm it, then give back the step the visitor was on. */
  function continueAfterPhoto(text) {
    var cur = current();
    var replay = cur && ['menu', 'categories', 'subcategories', 'products', 'ask', 'tech', 'req', 'summary', 'edit'].indexOf(cur.id) !== -1;
    if (replay) {
      if (text) bot(text, null, { kind: 'STATUS' });
      return go(cur.id, cur.p, { noPush: true, delay: 1 });
    }
    bot(text || t('productNext'), { options: answerOptions() }, { kind: 'STATUS' });
  }

  /* ========================================================== Open / close */
  function toggle(open) {
    state.open = open;
    writeState();
    panel.hidden = !open;
    root.classList.toggle('jk-cb--open', open);
    launcher.setAttribute('aria-expanded', String(open));
    teaser.hidden = true;
    if (open) {
      if (!state.messages.length) {
        state.startedAt = Date.now();
        state.stack = [];
        go('lang', null, { delay: 300 });
      } else {
        renderAll();
      }
      setTimeout(function () { var b = log.querySelector('.jk-cb-opt:not([disabled]), .jk-cb-sum-btn:not([disabled]), .jk-cb-form input'); if (b && window.innerWidth > 600) try { b.focus({ preventScroll: true }); } catch (e) { /* */ } }, 350);
    } else {
      launcher.focus();
      flushOnLeave();
    }
  }

  launcher.addEventListener('click', function () { toggle(!state.open); });
  q('.jk-cb-x').addEventListener('click', function () { toggle(false); });
  q('.jk-cb-back').addEventListener('click', function () { if (!root.classList.contains('jk-cb--busy')) back(); });
  q('.jk-cb-home').addEventListener('click', function () { if (!root.classList.contains('jk-cb--busy')) { user(t('home'), 'OPTION'); home(); } });
  q('.jk-cb-teaser-text').addEventListener('click', function () { toggle(true); });
  q('.jk-cb-teaser-x').addEventListener('click', function () { teaser.hidden = true; try { sessionStorage.setItem('jk-cb-teaser', '1'); } catch (e) { /* */ } });
  langBtn.addEventListener('click', function () {
    var open = langMenu.hidden;
    langMenu.hidden = !open;
    langBtn.setAttribute('aria-expanded', String(open));
  });
  langMenu.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang]');
    if (!b) return;
    langMenu.hidden = true;
    langBtn.setAttribute('aria-expanded', 'false');
    var cur = current();
    if (cur && cur.id === 'lang') { user(LANG_NAMES[b.getAttribute('data-lang')], 'OPTION'); return act('setLang', { lang: b.getAttribute('data-lang') }); }
    setLanguage(b.getAttribute('data-lang'), false);
  });
  document.addEventListener('click', function (e) { if (!langMenu.hidden && !e.target.closest('.jk-cb-langwrap')) { langMenu.hidden = true; langBtn.setAttribute('aria-expanded', 'false'); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.open) { if (!langMenu.hidden) langMenu.hidden = true; else toggle(false); } });
  attachBtn.addEventListener('click', pickPhoto);
  fileInput.addEventListener('change', function () {
    var files = Array.prototype.slice.call(fileInput.files || []);
    fileInput.value = '';
    if (files.length) sendPhotos(files.map(function (f) { return { file: f }; }));
  });
  composer.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.replace(/\s+/g, ' ').trim().slice(0, 1000);
    if (!text || input.disabled || root.classList.contains('jk-cb--busy')) return;
    input.value = '';
    handleText(text);
  });
  log.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    // Record contact taps (call / WhatsApp / email) in the conversation for the sales team.
    if (a && state.contact && /^(tel:|mailto:|https:\/\/wa\.me)/.test(a.getAttribute('href') || '')) {
      var m = { role: 'user', text: (a.textContent || '').replace(/\s+/g, ' ').trim(), kind: 'OPTION' };
      m.seq = ++state.seq; m.at = Date.now(); m.lang = lang(); m.silent = true;
      state.messages.push(m);
      writeState();
      scheduleSync(0);
    }
  });

  /* =========================================================== Boot */
  // A refresh in the middle of a submit: return to the summary so the visitor can submit again.
  if (current() && current().id === 'submitting') { state.stack.pop(); writeState(); }
  applyChrome();
  if (state.open) {
    panel.hidden = false;
    root.classList.add('jk-cb--open');
    launcher.setAttribute('aria-expanded', 'true');
    renderAll();
  } else {
    var seen = false;
    try { seen = !!sessionStorage.getItem('jk-cb-teaser'); } catch (e) { /* */ }
    if (!seen && !state.messages.length) setTimeout(function () { if (!state.open) teaser.hidden = false; }, 6000);
  }
  if (state.contact) {
    if (!state.erp.startedOk) retryStartLater();
    else if (transcriptFrom(state.erp.syncedSeq).length) scheduleSync(500);
  }

  // Console helpers for whoever maintains the knowledge base.
  window.JKChatbot = {
    match: function (text) { var item = classifyFaq(text); return { faq: item && item.id, intent: detectIntent(text), product: (detectProduct(text) || {}).prod && detectProduct(text).prod.id }; },
    reset: function () { try { sessionStorage.removeItem(STATE_KEY); } catch (e) { /* */ } location.reload(); }
  };
})();
