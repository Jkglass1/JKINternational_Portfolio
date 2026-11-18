/* ==========================================================================
   JK International - Chatbot FAQ ("JK Assistant")
   The questions and answers the website chatbot gives instantly, in English,
   Hindi and Punjabi, with no server or AI needed. Loaded before
   assets/js/jk-chatbot.js on every page.

   Editing guide
   - Every fact here comes from the website and the AI knowledge base
     (docs/GoogleAppsScript_ChatbotKnowledge.gs). Change both when a fact changes.
   - Answers may use **bold** and lines starting with "- " for bullets.
     Phone numbers (+91-XXXXX-XXXXX) and emails become tap-to-call / mail links.
   - links: website pages shown under the answer (file names in src/).
   - related: ids of up to 3 follow-up questions.
   - cta: "quote" or "callback" adds that button under the answer;
     contacts: true adds WhatsApp and Call buttons.
   - keywords: words that point a typed question at this answer. Matching
     ignores case and punctuation, and English words also match longer forms
     ("window" matches "windows"). Prefix "!" for words that decide the intent
     on their own (price, address...), "~" for weak hints.
   ========================================================================== */

window.JK_CHATBOT_FAQ = {
  topics: [
    { id: 'glass', icon: 'glass', label: { en: 'Glass', hi: 'ग्लास', pa: 'ਗਲਾਸ' } },
    { id: 'aluminium', icon: 'aluminium', label: { en: 'Aluminium', hi: 'एल्युमिनियम', pa: 'ਐਲੂਮੀਨੀਅਮ' } },
    { id: 'upvc', icon: 'upvc', label: { en: 'uPVC', hi: 'uPVC', pa: 'uPVC' } },
    { id: 'company', icon: 'company', label: { en: 'Company & projects', hi: 'कंपनी और प्रोजेक्ट', pa: 'ਕੰਪਨੀ ਅਤੇ ਪ੍ਰੋਜੈਕਟ' } },
    { id: 'quote', icon: 'quote', label: { en: 'Prices & quotes', hi: 'कीमत और कोटेशन', pa: 'ਕੀਮਤ ਅਤੇ ਕੋਟੇਸ਼ਨ' } }
  ],

  // Shown on the opening screen
  popular: ['price', 'which-glass', 'upvc-vs-aluminium', 'glass-types', 'locations'],

  // Short greetings and thanks get a friendly reply instead of "no answer"
  smalltalk: {
    hello: ['hi', 'hii', 'hiii', 'hello', 'helo', 'hey', 'namaste', 'namaskar', 'sat sri akal', 'sat shri akal', 'ssa', 'good morning', 'good afternoon', 'good evening', 'नमस्ते', 'नमस्कार', 'सत श्री अकाल', 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'ਨਮਸਤੇ'],
    thanks: ['thanks', 'thank you', 'thankyou', 'thx', 'ty', 'ok thanks', 'great', 'nice', 'dhanyavad', 'dhanyawad', 'shukriya', 'धन्यवाद', 'शुक्रिया', 'ਧੰਨਵਾਦ', 'ਸ਼ੁਕਰੀਆ']
  },

  items: [
    /* ---------------------------------------------------------------- Glass */
    {
      id: 'glass-types',
      topic: 'glass',
      q: {
        en: 'What types of glass do you offer?',
        hi: 'आप किस प्रकार के ग्लास बनाते हैं?',
        pa: 'ਤੁਸੀਂ ਕਿਹੜੀਆਂ ਕਿਸਮਾਂ ਦਾ ਗਲਾਸ ਬਣਾਉਂਦੇ ਹੋ?'
      },
      a: {
        en: 'We process a full range of architectural glass in-house:\n- **Toughened** safety glass\n- **Laminated** (PVB) glass\n- **Insulating glass** (DGU / IGU)\n- **Heat strengthened** and **bullet resistant** glass\n- **Bent** (curved) toughened and annealed glass\n- **Ceramic printed** and **designer** glass\nWe also supply glass hardware and fittings.',
        hi: 'हम सभी प्रकार के आर्किटेक्चरल ग्लास अपने प्लांट में ही प्रोसेस करते हैं:\n- **टफन्ड** सेफ्टी ग्लास\n- **लैमिनेटेड** (PVB) ग्लास\n- **इंसुलेटिंग ग्लास** (DGU / IGU)\n- **हीट स्ट्रेंथन्ड** और **बुलेट रेज़िस्टेंट** ग्लास\n- **बेंट** (घुमावदार) टफन्ड और एनील्ड ग्लास\n- **सिरेमिक प्रिंटेड** और **डिज़ाइनर** ग्लास\nहम ग्लास हार्डवेयर और फिटिंग्स भी सप्लाई करते हैं।',
        pa: 'ਅਸੀਂ ਹਰ ਤਰ੍ਹਾਂ ਦਾ ਆਰਕੀਟੈਕਚਰਲ ਗਲਾਸ ਆਪਣੇ ਪਲਾਂਟ ਵਿੱਚ ਹੀ ਪ੍ਰੋਸੈਸ ਕਰਦੇ ਹਾਂ:\n- **ਟਫਨਡ** ਸੇਫ਼ਟੀ ਗਲਾਸ\n- **ਲੈਮੀਨੇਟਿਡ** (PVB) ਗਲਾਸ\n- **ਇੰਸੂਲੇਟਿੰਗ ਗਲਾਸ** (DGU / IGU)\n- **ਹੀਟ ਸਟ੍ਰੈਂਥਨਡ** ਅਤੇ **ਬੁਲੇਟ ਰੋਧਕ** ਗਲਾਸ\n- **ਬੈਂਡ** (ਮੋੜਿਆ ਹੋਇਆ) ਟਫਨਡ ਅਤੇ ਐਨੀਲਡ ਗਲਾਸ\n- **ਸਿਰੈਮਿਕ ਪ੍ਰਿੰਟਿਡ** ਅਤੇ **ਡਿਜ਼ਾਈਨਰ** ਗਲਾਸ\nਅਸੀਂ ਗਲਾਸ ਹਾਰਡਵੇਅਰ ਅਤੇ ਫਿਟਿੰਗਜ਼ ਵੀ ਸਪਲਾਈ ਕਰਦੇ ਹਾਂ।'
      },
      links: ['glass-solutions.html'],
      related: ['which-glass', 'toughened', 'glass-size'],
      keywords: ['~glass', '~ग्लास', '~ਗਲਾਸ', 'types of glass', 'glass types', 'kinds of glass', 'type of glass', 'glass range', 'glass products', 'range', 'heat strengthened', 'bent glass', 'curved glass', 'bend', 'ceramic', 'designer glass', 'decorative', 'hardware', 'fitting', 'patch fitting', 'spider', 'प्रकार', 'किस्म', 'ਕਿਸਮ', 'ਕਿਸਮਾਂ']
    },
    {
      id: 'toughened',
      topic: 'glass',
      q: {
        en: 'What is toughened glass?',
        hi: 'टफन्ड ग्लास क्या होता है?',
        pa: 'ਟਫਨਡ ਗਲਾਸ ਕੀ ਹੁੰਦਾ ਹੈ?'
      },
      a: {
        en: '**Toughened (tempered) glass** is heat-treated to be **4–5 times stronger** than normal glass of the same thickness. If it breaks, it crumbles into small blunt pieces, which makes it much safer.\nIt is used for doors, shower enclosures, partitions, railings, facades and other busy areas. We temper glass up to **19 mm** thick and up to **2850 × 6000 mm**.',
        hi: '**टफन्ड (टेम्पर्ड) ग्लास** को गर्म करके खास तरीके से ठंडा किया जाता है, जिससे यह उसी मोटाई के सामान्य ग्लास से **4–5 गुना मज़बूत** हो जाता है। टूटने पर यह छोटे, बिना धार वाले टुकड़ों में बिखरता है, इसलिए ज़्यादा सुरक्षित है।\nइसका उपयोग दरवाज़ों, शावर एनक्लोज़र, पार्टीशन, रेलिंग और फ़साड में होता है। हम **19 mm** तक मोटा और **2850 × 6000 mm** तक बड़ा ग्लास टफन करते हैं।',
        pa: '**ਟਫਨਡ (ਟੈਂਪਰਡ) ਗਲਾਸ** ਨੂੰ ਗਰਮ ਕਰਕੇ ਖ਼ਾਸ ਤਰੀਕੇ ਨਾਲ ਠੰਢਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ, ਜਿਸ ਨਾਲ ਇਹ ਉਸੇ ਮੋਟਾਈ ਦੇ ਆਮ ਗਲਾਸ ਨਾਲੋਂ **4–5 ਗੁਣਾ ਮਜ਼ਬੂਤ** ਹੋ ਜਾਂਦਾ ਹੈ। ਟੁੱਟਣ ਉੱਤੇ ਇਹ ਛੋਟੇ, ਬਿਨਾਂ ਧਾਰ ਵਾਲੇ ਟੁਕੜਿਆਂ ਵਿੱਚ ਬਿਖਰਦਾ ਹੈ, ਇਸ ਲਈ ਵਧੇਰੇ ਸੁਰੱਖਿਅਤ ਹੈ।\nਇਹ ਦਰਵਾਜ਼ਿਆਂ, ਸ਼ਾਵਰ ਐਨਕਲੋਜ਼ਰ, ਪਾਰਟੀਸ਼ਨ, ਰੇਲਿੰਗ ਅਤੇ ਫ਼ਸਾਡ ਵਿੱਚ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ। ਅਸੀਂ **19 mm** ਤੱਕ ਮੋਟਾ ਅਤੇ **2850 × 6000 mm** ਤੱਕ ਵੱਡਾ ਗਲਾਸ ਟਫਨ ਕਰਦੇ ਹਾਂ।'
      },
      links: ['toughened-glass.html'],
      related: ['laminated', 'glass-size', 'which-glass'],
      keywords: ['toughened', 'toughen', 'tempered', 'temper', 'tuffen', 'tufen', 'tufan', 'toughned', 'tougned', 'safety glass', 'strong glass', 'stronger', 'strength', 'टफन', 'टफ़न', 'टेम्पर्ड', 'ਟਫਨ', 'ਟਫ਼ਨ', 'ਟੈਂਪਰਡ']
    },
    {
      id: 'laminated',
      topic: 'glass',
      q: {
        en: 'What is laminated glass?',
        hi: 'लैमिनेटेड ग्लास क्या होता है?',
        pa: 'ਲੈਮੀਨੇਟਿਡ ਗਲਾਸ ਕੀ ਹੁੰਦਾ ਹੈ?'
      },
      a: {
        en: '**Laminated glass** is two or more glass layers bonded with a tough **PVB interlayer**. If it breaks, the pieces stay stuck to the layer instead of falling out.\nIt also blocks about **99% of UV rays**, reduces noise and resists break-ins. It is ideal for skylights, canopies, balustrades, glass floors and security glazing.',
        hi: '**लैमिनेटेड ग्लास** में दो या ज़्यादा ग्लास की परतों को मज़बूत **PVB इंटरलेयर** से जोड़ा जाता है। टूटने पर टुकड़े इसी परत से चिपके रहते हैं, नीचे नहीं गिरते।\nयह लगभग **99% UV किरणें** रोकता है, शोर कम करता है और सेंधमारी से बचाता है। स्काईलाइट, कैनोपी, बालकनी रेलिंग, ग्लास फ़्लोर और सिक्योरिटी ग्लेज़िंग के लिए बेहतरीन है।',
        pa: '**ਲੈਮੀਨੇਟਿਡ ਗਲਾਸ** ਵਿੱਚ ਦੋ ਜਾਂ ਵੱਧ ਗਲਾਸ ਦੀਆਂ ਪਰਤਾਂ ਨੂੰ ਮਜ਼ਬੂਤ **PVB ਇੰਟਰਲੇਅਰ** ਨਾਲ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਟੁੱਟਣ ਉੱਤੇ ਟੁਕੜੇ ਇਸੇ ਪਰਤ ਨਾਲ ਚਿਪਕੇ ਰਹਿੰਦੇ ਹਨ, ਹੇਠਾਂ ਨਹੀਂ ਡਿੱਗਦੇ।\nਇਹ ਲਗਭਗ **99% UV ਕਿਰਨਾਂ** ਰੋਕਦਾ ਹੈ, ਸ਼ੋਰ ਘਟਾਉਂਦਾ ਹੈ ਅਤੇ ਸੰਨ੍ਹਮਾਰੀ ਤੋਂ ਬਚਾਉਂਦਾ ਹੈ। ਸਕਾਈਲਾਈਟ, ਕੈਨੋਪੀ, ਬਾਲਕੋਨੀ ਰੇਲਿੰਗ, ਗਲਾਸ ਫ਼ਲੋਰ ਅਤੇ ਸਿਕਿਓਰਿਟੀ ਗਲੇਜ਼ਿੰਗ ਲਈ ਬਿਹਤਰੀਨ ਹੈ।'
      },
      links: ['laminated-glass.html'],
      related: ['toughened', 'dgu', 'noise'],
      keywords: ['laminated', 'laminate', 'lamination', 'pvb', 'interlayer', 'sandwich glass', 'uv', 'लैमिनेटेड', 'लेमिनेटेड', 'ਲੈਮੀਨੇਟਿਡ', 'ਲੈਮੀਨੇਟ']
    },
    {
      id: 'dgu',
      topic: 'glass',
      q: {
        en: 'What is DGU / double glazing?',
        hi: 'DGU यानी डबल ग्लेज़िंग क्या है?',
        pa: 'DGU ਯਾਨੀ ਡਬਲ ਗਲੇਜ਼ਿੰਗ ਕੀ ਹੈ?'
      },
      a: {
        en: 'A **DGU (Double Glazed Unit)** is two glass panes with a sealed, dry air gap between them. **IGU** is the wider term that also covers triple glazing.\nThe gap cuts heat transfer, so rooms stay comfortable and **AC load drops**, and it also reduces outside noise. We make double and triple glazed units on an automated dual-seal line.',
        hi: '**DGU (डबल ग्लेज़्ड यूनिट)** में ग्लास की दो शीट होती हैं, जिनके बीच सूखी हवा की सील्ड परत होती है। **IGU** बड़ा शब्द है, जिसमें ट्रिपल ग्लेज़िंग भी आती है।\nयह परत गर्मी का आना-जाना कम करती है, जिससे कमरे आरामदायक रहते हैं और **AC का लोड घटता है**। बाहर का शोर भी कम होता है। हम ऑटोमैटिक डुअल-सील लाइन पर डबल और ट्रिपल ग्लेज़्ड यूनिट बनाते हैं।',
        pa: '**DGU (ਡਬਲ ਗਲੇਜ਼ਡ ਯੂਨਿਟ)** ਵਿੱਚ ਗਲਾਸ ਦੀਆਂ ਦੋ ਸ਼ੀਟਾਂ ਹੁੰਦੀਆਂ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿਚਕਾਰ ਸੁੱਕੀ ਹਵਾ ਦੀ ਸੀਲਬੰਦ ਪਰਤ ਹੁੰਦੀ ਹੈ। **IGU** ਵੱਡਾ ਸ਼ਬਦ ਹੈ, ਜਿਸ ਵਿੱਚ ਟ੍ਰਿਪਲ ਗਲੇਜ਼ਿੰਗ ਵੀ ਆਉਂਦੀ ਹੈ।\nਇਹ ਪਰਤ ਗਰਮੀ ਦਾ ਆਉਣਾ-ਜਾਣਾ ਘਟਾਉਂਦੀ ਹੈ, ਜਿਸ ਨਾਲ ਕਮਰੇ ਆਰਾਮਦਾਇਕ ਰਹਿੰਦੇ ਹਨ ਅਤੇ **AC ਦਾ ਲੋਡ ਘਟਦਾ ਹੈ**। ਬਾਹਰ ਦਾ ਸ਼ੋਰ ਵੀ ਘੱਟ ਹੁੰਦਾ ਹੈ। ਅਸੀਂ ਆਟੋਮੈਟਿਕ ਡੂਅਲ-ਸੀਲ ਲਾਈਨ ਉੱਤੇ ਡਬਲ ਅਤੇ ਟ੍ਰਿਪਲ ਗਲੇਜ਼ਡ ਯੂਨਿਟ ਬਣਾਉਂਦੇ ਹਾਂ।'
      },
      links: ['insulating-glass.html'],
      related: ['noise', 'which-glass', 'upvc-benefits'],
      keywords: ['!dgu', '!igu', 'double glazing', 'double glazed', 'double glass', 'triple glazing', 'triple glazed', 'insulating glass', 'insulated glass', 'insulation', 'energy saving', 'heat', 'डबल ग्लेज़िंग', 'डबल ग्लास', 'इंसुलेटिंग', 'ਡਬਲ ਗਲੇਜ਼ਿੰਗ', 'ਡਬਲ ਗਲਾਸ', 'ਇੰਸੂਲੇਟਿੰਗ']
    },
    {
      id: 'noise',
      topic: 'glass',
      q: {
        en: 'Which glass is best for noise reduction?',
        hi: 'शोर कम करने के लिए कौन-सा ग्लास सबसे अच्छा है?',
        pa: 'ਸ਼ੋਰ ਘਟਾਉਣ ਲਈ ਕਿਹੜਾ ਗਲਾਸ ਸਭ ਤੋਂ ਵਧੀਆ ਹੈ?'
      },
      a: {
        en: 'For a quieter room, choose **insulating glass (DGU)**, ideally with **one laminated pane** or two panes of **different thickness**, which block noise better.\nPair it with well-sealed **uPVC windows** and outside noise can drop by up to **30–40 dB**. Our team can suggest the right combination for your site.',
        hi: 'शांत कमरे के लिए **इंसुलेटिंग ग्लास (DGU)** चुनें, बेहतर होगा अगर उसमें **एक शीट लैमिनेटेड** हो या दोनों शीट की **मोटाई अलग-अलग** हो।\nइसे अच्छी तरह सील्ड **uPVC खिड़कियों** के साथ लगाने पर बाहर का शोर **30–40 dB** तक कम हो सकता है। हमारी टीम आपकी साइट के हिसाब से सही कॉम्बिनेशन बताएगी।',
        pa: 'ਸ਼ਾਂਤ ਕਮਰੇ ਲਈ **ਇੰਸੂਲੇਟਿੰਗ ਗਲਾਸ (DGU)** ਚੁਣੋ, ਬਿਹਤਰ ਹੋਵੇਗਾ ਜੇ ਉਸ ਵਿੱਚ **ਇੱਕ ਸ਼ੀਟ ਲੈਮੀਨੇਟਿਡ** ਹੋਵੇ ਜਾਂ ਦੋਵੇਂ ਸ਼ੀਟਾਂ ਦੀ **ਮੋਟਾਈ ਵੱਖ-ਵੱਖ** ਹੋਵੇ।\nਇਸ ਨੂੰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸੀਲਬੰਦ **uPVC ਖਿੜਕੀਆਂ** ਨਾਲ ਲਗਾਉਣ ਉੱਤੇ ਬਾਹਰ ਦਾ ਸ਼ੋਰ **30–40 dB** ਤੱਕ ਘੱਟ ਹੋ ਸਕਦਾ ਹੈ। ਸਾਡੀ ਟੀਮ ਤੁਹਾਡੀ ਸਾਈਟ ਮੁਤਾਬਕ ਸਹੀ ਕੌਂਬੀਨੇਸ਼ਨ ਦੱਸੇਗੀ।'
      },
      links: ['insulating-glass.html', 'upvc-systems.html'],
      related: ['dgu', 'upvc-benefits', 'price'],
      keywords: ['!noise', '!soundproof', '!sound proof', 'sound', 'acoustic', 'quiet', 'traffic', 'shor', 'awaz', 'awaaz', 'आवाज़', 'आवाज', '!शोर', '!ਸ਼ੋਰ', 'ਆਵਾਜ਼']
    },
    {
      id: 'which-glass',
      topic: 'glass',
      q: {
        en: 'Which glass is right for my project?',
        hi: 'मेरे प्रोजेक्ट के लिए कौन-सा ग्लास सही है?',
        pa: 'ਮੇਰੇ ਪ੍ਰੋਜੈਕਟ ਲਈ ਕਿਹੜਾ ਗਲਾਸ ਸਹੀ ਹੈ?'
      },
      a: {
        en: 'It depends on where the glass goes. A quick guide:\n- **Doors, showers, partitions:** toughened glass\n- **Railings, skylights, canopies:** laminated (toughened) glass\n- **Windows facing heat or traffic:** insulating glass (DGU)\n- **Privacy:** frosted or designer glass\n- **Commercial facades:** DGU, heat strengthened or ceramic printed glass\nTell us about your project and our team will recommend the exact specification.',
        hi: 'यह इस पर निर्भर करता है कि ग्लास कहाँ लगेगा। एक छोटी गाइड:\n- **दरवाज़े, शावर, पार्टीशन:** टफन्ड ग्लास\n- **रेलिंग, स्काईलाइट, कैनोपी:** लैमिनेटेड (टफन्ड) ग्लास\n- **धूप या ट्रैफ़िक की तरफ़ वाली खिड़कियाँ:** इंसुलेटिंग ग्लास (DGU)\n- **प्राइवेसी:** फ़्रॉस्टेड या डिज़ाइनर ग्लास\n- **कमर्शियल फ़साड:** DGU, हीट स्ट्रेंथन्ड या सिरेमिक प्रिंटेड ग्लास\nअपने प्रोजेक्ट के बारे में बताइए, हमारी टीम सही स्पेसिफिकेशन सुझाएगी।',
        pa: 'ਇਹ ਇਸ ਗੱਲ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ ਕਿ ਗਲਾਸ ਕਿੱਥੇ ਲੱਗੇਗਾ। ਇੱਕ ਛੋਟੀ ਗਾਈਡ:\n- **ਦਰਵਾਜ਼ੇ, ਸ਼ਾਵਰ, ਪਾਰਟੀਸ਼ਨ:** ਟਫਨਡ ਗਲਾਸ\n- **ਰੇਲਿੰਗ, ਸਕਾਈਲਾਈਟ, ਕੈਨੋਪੀ:** ਲੈਮੀਨੇਟਿਡ (ਟਫਨਡ) ਗਲਾਸ\n- **ਧੁੱਪ ਜਾਂ ਟ੍ਰੈਫ਼ਿਕ ਵਾਲੇ ਪਾਸੇ ਦੀਆਂ ਖਿੜਕੀਆਂ:** ਇੰਸੂਲੇਟਿੰਗ ਗਲਾਸ (DGU)\n- **ਪ੍ਰਾਈਵੇਸੀ:** ਫ਼ਰੌਸਟਿਡ ਜਾਂ ਡਿਜ਼ਾਈਨਰ ਗਲਾਸ\n- **ਕਮਰਸ਼ੀਅਲ ਫ਼ਸਾਡ:** DGU, ਹੀਟ ਸਟ੍ਰੈਂਥਨਡ ਜਾਂ ਸਿਰੈਮਿਕ ਪ੍ਰਿੰਟਿਡ ਗਲਾਸ\nਆਪਣੇ ਪ੍ਰੋਜੈਕਟ ਬਾਰੇ ਦੱਸੋ, ਸਾਡੀ ਟੀਮ ਸਹੀ ਸਪੈਸੀਫਿਕੇਸ਼ਨ ਸੁਝਾਵੇਗੀ।'
      },
      links: ['glass-solutions.html'],
      cta: 'quote',
      related: ['toughened', 'dgu', 'price'],
      keywords: ['which glass', 'best glass', 'right glass', 'suitable', 'recommend', 'suggest', 'railing', 'balustrade', 'balcony', 'shower', 'bathroom', 'partition', 'skylight', 'canopy', 'privacy', 'frosted', 'my home', 'my house', 'my project', 'konsa glass', 'kaunsa glass', 'kaun sa glass', 'कौन सा ग्लास', 'सही ग्लास', 'रेलिंग', 'शावर', 'ਕਿਹੜਾ ਗਲਾਸ', 'ਸਹੀ ਗਲਾਸ', 'ਰੇਲਿੰਗ', 'ਸ਼ਾਵਰ']
    },
    {
      id: 'glass-size',
      topic: 'glass',
      q: {
        en: 'What glass thickness and size can you make?',
        hi: 'आप कितनी मोटाई और साइज़ का ग्लास बना सकते हैं?',
        pa: 'ਤੁਸੀਂ ਕਿੰਨੀ ਮੋਟਾਈ ਅਤੇ ਸਾਈਜ਼ ਦਾ ਗਲਾਸ ਬਣਾ ਸਕਦੇ ਹੋ?'
      },
      a: {
        en: 'Our tempering furnace handles glass up to **19 mm thick** on a **2850 × 6000 mm** bed.\nWe also do CNC cutting, edge polishing, bevelling, waterjet cut-outs and hole drilling for patch and spider fittings. For very large or special sizes, our team will confirm feasibility.',
        hi: 'हमारी टेम्परिंग फ़र्नेस **19 mm** तक मोटा ग्लास **2850 × 6000 mm** बेड पर प्रोसेस करती है।\nहम CNC कटिंग, एज पॉलिशिंग, बेवलिंग, वॉटरजेट कट-आउट और पैच व स्पाइडर फिटिंग के लिए होल ड्रिलिंग भी करते हैं। बहुत बड़े या खास साइज़ के लिए हमारी टीम पुष्टि करेगी।',
        pa: 'ਸਾਡੀ ਟੈਂਪਰਿੰਗ ਫ਼ਰਨੇਸ **19 mm** ਤੱਕ ਮੋਟਾ ਗਲਾਸ **2850 × 6000 mm** ਬੈੱਡ ਉੱਤੇ ਪ੍ਰੋਸੈਸ ਕਰਦੀ ਹੈ।\nਅਸੀਂ CNC ਕਟਿੰਗ, ਐਜ ਪਾਲਿਸ਼ਿੰਗ, ਬੈਵਲਿੰਗ, ਵਾਟਰਜੈੱਟ ਕੱਟ-ਆਊਟ ਅਤੇ ਪੈਚ ਤੇ ਸਪਾਈਡਰ ਫਿਟਿੰਗ ਲਈ ਹੋਲ ਡ੍ਰਿਲਿੰਗ ਵੀ ਕਰਦੇ ਹਾਂ। ਬਹੁਤ ਵੱਡੇ ਜਾਂ ਖ਼ਾਸ ਸਾਈਜ਼ ਲਈ ਸਾਡੀ ਟੀਮ ਪੁਸ਼ਟੀ ਕਰੇਗੀ।'
      },
      links: ['toughened-glass.html', 'infrastructure.html'],
      related: ['toughened', 'glass-types', 'price'],
      keywords: ['!thickness', 'thick', 'size', 'sizes', 'dimension', 'maximum', 'max', 'biggest', 'largest', 'big glass', 'mm', '19mm', '12mm', '10mm', '8mm', 'polishing', 'bevel', 'cutting', 'drilling', 'waterjet', 'मोटाई', 'साइज़', 'साइज', 'ਮੋਟਾਈ', 'ਸਾਈਜ਼', 'ਸਾਈਜ']
    },
    {
      id: 'bullet',
      topic: 'glass',
      q: {
        en: 'Do you make bullet resistant glass?',
        hi: 'क्या आप बुलेट रेज़िस्टेंट ग्लास बनाते हैं?',
        pa: 'ਕੀ ਤੁਸੀਂ ਬੁਲੇਟ ਰੋਧਕ ਗਲਾਸ ਬਣਾਉਂਦੇ ਹੋ?'
      },
      a: {
        en: 'Yes. Our **bullet resistant glass** is a multi-layer laminate of glass and polycarbonate that absorbs bullet energy. It is used in banks, cash counters, government buildings, security booths and armoured vehicles.\nIt is **certified by the Gujarat Forensic Lab (2017)**. The protection level is confirmed by our technical team for each requirement.',
        hi: 'हाँ। हमारा **बुलेट रेज़िस्टेंट ग्लास** ग्लास और पॉलीकार्बोनेट की कई परतों से बना होता है, जो गोली की ताकत को सोख लेता है। इसका उपयोग बैंक, कैश काउंटर, सरकारी इमारतों, सिक्योरिटी बूथ और आर्मर्ड गाड़ियों में होता है।\nयह **गुजरात फ़ॉरेंसिक लैब (2017) से सर्टिफ़ाइड** है। ज़रूरी सुरक्षा स्तर हमारी तकनीकी टीम हर ज़रूरत के हिसाब से तय करती है।',
        pa: 'ਹਾਂ ਜੀ। ਸਾਡਾ **ਬੁਲੇਟ ਰੋਧਕ ਗਲਾਸ** ਗਲਾਸ ਅਤੇ ਪੌਲੀਕਾਰਬੋਨੇਟ ਦੀਆਂ ਕਈ ਪਰਤਾਂ ਨਾਲ ਬਣਦਾ ਹੈ, ਜੋ ਗੋਲੀ ਦੀ ਤਾਕਤ ਨੂੰ ਸੋਖ ਲੈਂਦਾ ਹੈ। ਇਹ ਬੈਂਕਾਂ, ਕੈਸ਼ ਕਾਊਂਟਰਾਂ, ਸਰਕਾਰੀ ਇਮਾਰਤਾਂ, ਸਿਕਿਓਰਿਟੀ ਬੂਥਾਂ ਅਤੇ ਆਰਮਰਡ ਗੱਡੀਆਂ ਵਿੱਚ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।\nਇਹ **ਗੁਜਰਾਤ ਫ਼ੌਰੈਂਸਿਕ ਲੈਬ (2017) ਤੋਂ ਸਰਟੀਫ਼ਾਈਡ** ਹੈ। ਲੋੜੀਂਦਾ ਸੁਰੱਖਿਆ ਪੱਧਰ ਸਾਡੀ ਤਕਨੀਕੀ ਟੀਮ ਹਰ ਲੋੜ ਮੁਤਾਬਕ ਤੈਅ ਕਰਦੀ ਹੈ।'
      },
      links: ['bullet-resistant-glass.html'],
      related: ['laminated', 'certifications', 'price'],
      keywords: ['!bullet', '!bulletproof', 'ballistic', 'security glass', 'bank', 'armoured', 'armored', 'vip', 'बुलेट', 'ਬੁਲੇਟ']
    },

    /* ------------------------------------------------------------ Aluminium */
    {
      id: 'aluminium-range',
      topic: 'aluminium',
      q: {
        en: 'What aluminium windows and doors do you make?',
        hi: 'आप कौन-सी एल्युमिनियम खिड़कियाँ और दरवाज़े बनाते हैं?',
        pa: 'ਤੁਸੀਂ ਕਿਹੜੀਆਂ ਐਲੂਮੀਨੀਅਮ ਖਿੜਕੀਆਂ ਅਤੇ ਦਰਵਾਜ਼ੇ ਬਣਾਉਂਦੇ ਹੋ?'
      },
      a: {
        en: 'We make a complete range from **6063-T6 architectural aluminium**:\n- **Windows:** 2/3/4-track sliding, casement, tilt-and-turn, top-hung, fixed, louvre, bay and corner\n- **Doors:** sliding, lift-and-slide (sashes up to 400 kg), bi-fold (3–7 leaves), French, hinged and automatic sliding\n- **Mosquito mesh** options in stainless steel 304\nThe glass comes from our own glass division, so everything comes from one source.',
        hi: 'हम **6063-T6 आर्किटेक्चरल एल्युमिनियम** से पूरी रेंज बनाते हैं:\n- **खिड़कियाँ:** 2/3/4-ट्रैक स्लाइडिंग, केसमेंट, टिल्ट-एंड-टर्न, टॉप-हंग, फ़िक्स्ड, लूवर, बे और कॉर्नर\n- **दरवाज़े:** स्लाइडिंग, लिफ़्ट-एंड-स्लाइड (400 kg तक के शटर), बाय-फ़ोल्ड (3–7 पल्ले), फ़्रेंच, हिंज्ड और ऑटोमैटिक स्लाइडिंग\n- स्टेनलेस स्टील 304 की **मच्छरदानी जाली** का विकल्प\nग्लास हमारे अपने ग्लास डिवीज़न से आता है, यानी सब कुछ एक ही जगह से।',
        pa: 'ਅਸੀਂ **6063-T6 ਆਰਕੀਟੈਕਚਰਲ ਐਲੂਮੀਨੀਅਮ** ਤੋਂ ਪੂਰੀ ਰੇਂਜ ਬਣਾਉਂਦੇ ਹਾਂ:\n- **ਖਿੜਕੀਆਂ:** 2/3/4-ਟ੍ਰੈਕ ਸਲਾਈਡਿੰਗ, ਕੇਸਮੈਂਟ, ਟਿਲਟ-ਐਂਡ-ਟਰਨ, ਟੌਪ-ਹੰਗ, ਫ਼ਿਕਸਡ, ਲੂਵਰ, ਬੇਅ ਅਤੇ ਕਾਰਨਰ\n- **ਦਰਵਾਜ਼ੇ:** ਸਲਾਈਡਿੰਗ, ਲਿਫ਼ਟ-ਐਂਡ-ਸਲਾਈਡ (400 kg ਤੱਕ ਦੇ ਸ਼ਟਰ), ਬਾਈ-ਫ਼ੋਲਡ (3–7 ਪੱਲੇ), ਫ਼੍ਰੈਂਚ, ਹਿੰਜਡ ਅਤੇ ਆਟੋਮੈਟਿਕ ਸਲਾਈਡਿੰਗ\n- ਸਟੇਨਲੈੱਸ ਸਟੀਲ 304 ਦੀ **ਮੱਛਰ ਜਾਲੀ** ਦਾ ਵਿਕਲਪ\nਗਲਾਸ ਸਾਡੇ ਆਪਣੇ ਗਲਾਸ ਡਿਵੀਜ਼ਨ ਤੋਂ ਆਉਂਦਾ ਹੈ, ਯਾਨੀ ਸਭ ਕੁਝ ਇੱਕੋ ਥਾਂ ਤੋਂ।'
      },
      links: ['aluminium-systems.html'],
      related: ['aluminium-finishes', 'facade', 'upvc-vs-aluminium'],
      keywords: ['aluminium', 'aluminum', 'alluminium', 'aluminium window', 'aluminium door', 'sliding', 'casement', 'bifold', 'bi fold', 'folding door', 'lift and slide', 'louvre', 'louver', 'automatic door', 'mosquito', 'mesh', 'jali', 'jaali', 'एल्युमिनियम', 'एल्यूमिनियम', 'एलुमिनियम', 'जाली', 'ਐਲੂਮੀਨੀਅਮ', 'ਅਲਮੀਨੀਅਮ', 'ਜਾਲੀ']
    },
    {
      id: 'aluminium-finishes',
      topic: 'aluminium',
      q: {
        en: 'What aluminium finishes and colours are available?',
        hi: 'एल्युमिनियम में कौन-से फ़िनिश और रंग मिलते हैं?',
        pa: 'ਐਲੂਮੀਨੀਅਮ ਵਿੱਚ ਕਿਹੜੇ ਫ਼ਿਨਿਸ਼ ਅਤੇ ਰੰਗ ਮਿਲਦੇ ਹਨ?'
      },
      a: {
        en: 'We offer three finishes:\n- **Anodising** (high-micron)\n- **Powder coating** (polyester)\n- **Wood-grain** sublimation textures\nExact shades are confirmed by our team when you request a quote.',
        hi: 'हम तीन तरह के फ़िनिश देते हैं:\n- **एनोडाइज़िंग** (हाई-माइक्रॉन)\n- **पाउडर कोटिंग** (पॉलिएस्टर)\n- **वुड-ग्रेन** (लकड़ी जैसा) सब्लिमेशन टेक्सचर\nसटीक शेड हमारी टीम कोटेशन के समय पक्के करती है।',
        pa: 'ਅਸੀਂ ਤਿੰਨ ਤਰ੍ਹਾਂ ਦੇ ਫ਼ਿਨਿਸ਼ ਦਿੰਦੇ ਹਾਂ:\n- **ਐਨੋਡਾਈਜ਼ਿੰਗ** (ਹਾਈ-ਮਾਈਕ੍ਰੋਨ)\n- **ਪਾਊਡਰ ਕੋਟਿੰਗ** (ਪੌਲੀਐਸਟਰ)\n- **ਵੁੱਡ-ਗ੍ਰੇਨ** (ਲੱਕੜ ਵਰਗਾ) ਸਬਲੀਮੇਸ਼ਨ ਟੈਕਸਚਰ\nਸਹੀ ਸ਼ੇਡ ਸਾਡੀ ਟੀਮ ਕੋਟੇਸ਼ਨ ਵੇਲੇ ਪੱਕੇ ਕਰਦੀ ਹੈ।'
      },
      links: ['aluminium-systems.html'],
      related: ['aluminium-range', 'upvc-vs-aluminium', 'price'],
      keywords: ['!finish', '!colour', '!color', 'colours', 'shade', 'powder coat', 'powder coating', 'anodised', 'anodized', 'anodising', 'anodizing', 'wood grain', 'wooden', 'rang', 'फ़िनिश', 'फिनिश', 'रंग', 'ਫ਼ਿਨਿਸ਼', 'ਫਿਨਿਸ਼', 'ਰੰਗ']
    },
    {
      id: 'facade',
      topic: 'aluminium',
      q: {
        en: 'Do you do curtain walls and glass facades?',
        hi: 'क्या आप कर्टन वॉल और ग्लास फ़साड बनाते हैं?',
        pa: 'ਕੀ ਤੁਸੀਂ ਕਰਟਨ ਵਾਲ ਅਤੇ ਗਲਾਸ ਫ਼ਸਾਡ ਬਣਾਉਂਦੇ ਹੋ?'
      },
      a: {
        en: 'Yes. We supply complete facade systems:\n- **Curtain walls:** stick and semi-unitised, with 50 / 60 mm mullions\n- **Structural glazing:** two-sided or four-sided silicone\n- **Shopfronts** and **office glass partitions**\nBecause we make both the aluminium and the glass, one team handles your whole facade.',
        hi: 'हाँ। हम पूरे फ़साड सिस्टम सप्लाई करते हैं:\n- **कर्टन वॉल:** स्टिक और सेमी-यूनिटाइज़्ड, 50 / 60 mm म्यूलियन के साथ\n- **स्ट्रक्चरल ग्लेज़िंग:** टू-साइडेड या फ़ोर-साइडेड सिलिकॉन\n- **शॉपफ़्रंट** और **ऑफ़िस ग्लास पार्टीशन**\nएल्युमिनियम और ग्लास दोनों हम ही बनाते हैं, इसलिए पूरा फ़साड एक ही टीम संभालती है।',
        pa: 'ਹਾਂ ਜੀ। ਅਸੀਂ ਪੂਰੇ ਫ਼ਸਾਡ ਸਿਸਟਮ ਸਪਲਾਈ ਕਰਦੇ ਹਾਂ:\n- **ਕਰਟਨ ਵਾਲ:** ਸਟਿੱਕ ਅਤੇ ਸੈਮੀ-ਯੂਨਿਟਾਈਜ਼ਡ, 50 / 60 mm ਮਿਊਲੀਅਨ ਨਾਲ\n- **ਸਟ੍ਰਕਚਰਲ ਗਲੇਜ਼ਿੰਗ:** ਟੂ-ਸਾਈਡਿਡ ਜਾਂ ਫ਼ੋਰ-ਸਾਈਡਿਡ ਸਿਲੀਕੋਨ\n- **ਸ਼ਾਪਫ਼੍ਰੰਟ** ਅਤੇ **ਦਫ਼ਤਰੀ ਗਲਾਸ ਪਾਰਟੀਸ਼ਨ**\nਐਲੂਮੀਨੀਅਮ ਅਤੇ ਗਲਾਸ ਦੋਵੇਂ ਅਸੀਂ ਹੀ ਬਣਾਉਂਦੇ ਹਾਂ, ਇਸ ਲਈ ਪੂਰਾ ਫ਼ਸਾਡ ਇੱਕੋ ਟੀਮ ਸੰਭਾਲਦੀ ਹੈ।'
      },
      links: ['aluminium-systems.html', 'projects.html'],
      cta: 'quote',
      related: ['which-glass', 'projects', 'aluminium-range'],
      keywords: ['!curtain wall', '!facade', '!façade', 'elevation', 'structural glazing', 'glazing', 'shopfront', 'shop front', 'showroom front', 'office partition', 'commercial building', 'frontage', 'फ़साड', 'फसाड', 'कर्टन', 'ਫ਼ਸਾਡ', 'ਫਸਾਡ', 'ਕਰਟਨ']
    },

    /* ----------------------------------------------------------------- uPVC */
    {
      id: 'upvc-benefits',
      topic: 'upvc',
      q: {
        en: 'What are uPVC windows and their benefits?',
        hi: 'uPVC खिड़कियाँ क्या हैं और इनके क्या फ़ायदे हैं?',
        pa: 'uPVC ਖਿੜਕੀਆਂ ਕੀ ਹਨ ਅਤੇ ਇਹਨਾਂ ਦੇ ਕੀ ਫ਼ਾਇਦੇ ਹਨ?'
      },
      a: {
        en: 'Our uPVC windows and doors are sold under the **JK WINDOORS** brand, in collaboration with the **profine group of Germany** (makers of KÖMMERLING profiles).\n- Up to **30–40 dB** less outside noise with DGU glass\n- Up to **30% energy savings**\n- **Termite-proof**, rust-free and rot-free\n- UV-stabilised, so no yellowing\n- Never needs painting; just clean with soap and water',
        hi: 'हमारी uPVC खिड़कियाँ और दरवाज़े **JK WINDOORS** ब्रांड के तहत आते हैं, जो जर्मनी के **profine group** (KÖMMERLING प्रोफ़ाइल बनाने वाले) के सहयोग से हैं।\n- DGU ग्लास के साथ बाहर का शोर **30–40 dB** तक कम\n- **30% तक ऊर्जा की बचत**\n- **दीमक-प्रूफ़**, जंग और सड़न से मुक्त\n- UV-स्टेबलाइज़्ड, इसलिए पीलापन नहीं आता\n- पेंट की कभी ज़रूरत नहीं; बस साबुन और पानी से साफ़ करें',
        pa: 'ਸਾਡੀਆਂ uPVC ਖਿੜਕੀਆਂ ਅਤੇ ਦਰਵਾਜ਼ੇ **JK WINDOORS** ਬ੍ਰਾਂਡ ਹੇਠ ਆਉਂਦੇ ਹਨ, ਜੋ ਜਰਮਨੀ ਦੇ **profine group** (KÖMMERLING ਪ੍ਰੋਫ਼ਾਈਲ ਬਣਾਉਣ ਵਾਲੇ) ਦੇ ਸਹਿਯੋਗ ਨਾਲ ਹਨ।\n- DGU ਗਲਾਸ ਨਾਲ ਬਾਹਰ ਦਾ ਸ਼ੋਰ **30–40 dB** ਤੱਕ ਘੱਟ\n- **30% ਤੱਕ ਊਰਜਾ ਦੀ ਬਚਤ**\n- **ਸਿਉਂਕ-ਪਰੂਫ਼**, ਜੰਗਾਲ ਅਤੇ ਗਲਣ ਤੋਂ ਮੁਕਤ\n- UV-ਸਟੈਬਲਾਈਜ਼ਡ, ਇਸ ਲਈ ਪੀਲਾਪਣ ਨਹੀਂ ਆਉਂਦਾ\n- ਪੇਂਟ ਦੀ ਕਦੇ ਲੋੜ ਨਹੀਂ; ਬੱਸ ਸਾਬਣ ਅਤੇ ਪਾਣੀ ਨਾਲ ਸਾਫ਼ ਕਰੋ'
      },
      links: ['upvc-systems.html'],
      related: ['upvc-designs', 'upvc-vs-aluminium', 'upvc-care'],
      keywords: ['upvc', 'u pvc', 'pvc', 'vinyl', 'windoors', 'kommerling', 'kömmerling', 'profine', 'benefit', 'advantage', 'termite', 'energy', 'फ़ायदे', 'फायदे', 'दीमक', 'ਫ਼ਾਇਦੇ', 'ਫਾਇਦੇ', 'ਸਿਉਂਕ']
    },
    {
      id: 'upvc-vs-aluminium',
      topic: 'upvc',
      q: {
        en: 'Should I choose uPVC or aluminium?',
        hi: 'uPVC लूँ या एल्युमिनियम?',
        pa: 'uPVC ਲਵਾਂ ਜਾਂ ਐਲੂਮੀਨੀਅਮ?'
      },
      a: {
        en: 'Both are good; it depends on your priority:\n- **uPVC:** better insulation and noise control, very low maintenance; great for homes and bedrooms\n- **Aluminium:** slimmer frames, larger glass panels and more finish options; great for big openings, shopfronts and commercial buildings\nWe make both, with glass from our own plant, so our team can suggest the best fit for each opening.',
        hi: 'दोनों अच्छे हैं; यह आपकी ज़रूरत पर निर्भर करता है:\n- **uPVC:** बेहतर इंसुलेशन और शोर से राहत, बहुत कम रखरखाव; घरों और बेडरूम के लिए बढ़िया\n- **एल्युमिनियम:** पतले फ़्रेम, बड़े ग्लास पैनल और ज़्यादा फ़िनिश विकल्प; बड़े ओपनिंग, शोरूम और कमर्शियल इमारतों के लिए बढ़िया\nहम दोनों बनाते हैं, ग्लास भी अपने प्लांट का, इसलिए हमारी टीम हर ओपनिंग के लिए सही विकल्प सुझा सकती है।',
        pa: 'ਦੋਵੇਂ ਵਧੀਆ ਹਨ; ਇਹ ਤੁਹਾਡੀ ਲੋੜ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ:\n- **uPVC:** ਬਿਹਤਰ ਇੰਸੂਲੇਸ਼ਨ ਅਤੇ ਸ਼ੋਰ ਤੋਂ ਰਾਹਤ, ਬਹੁਤ ਘੱਟ ਸੰਭਾਲ; ਘਰਾਂ ਅਤੇ ਬੈੱਡਰੂਮਾਂ ਲਈ ਵਧੀਆ\n- **ਐਲੂਮੀਨੀਅਮ:** ਪਤਲੇ ਫ਼ਰੇਮ, ਵੱਡੇ ਗਲਾਸ ਪੈਨਲ ਅਤੇ ਵੱਧ ਫ਼ਿਨਿਸ਼ ਵਿਕਲਪ; ਵੱਡੀਆਂ ਓਪਨਿੰਗਾਂ, ਸ਼ੋਅਰੂਮਾਂ ਅਤੇ ਕਮਰਸ਼ੀਅਲ ਇਮਾਰਤਾਂ ਲਈ ਵਧੀਆ\nਅਸੀਂ ਦੋਵੇਂ ਬਣਾਉਂਦੇ ਹਾਂ, ਗਲਾਸ ਵੀ ਆਪਣੇ ਪਲਾਂਟ ਦਾ, ਇਸ ਲਈ ਸਾਡੀ ਟੀਮ ਹਰ ਓਪਨਿੰਗ ਲਈ ਸਹੀ ਵਿਕਲਪ ਸੁਝਾਅ ਸਕਦੀ ਹੈ।'
      },
      links: ['upvc-systems.html', 'aluminium-systems.html'],
      related: ['upvc-benefits', 'aluminium-range', 'price'],
      keywords: ['!upvc or aluminium', '!upvc vs aluminium', '!aluminium or upvc', '!aluminium vs upvc', '!upvc or aluminum', '!aluminum or upvc', '!upvc and aluminium', '!aluminium and upvc', '!upvc and aluminum', '!aluminum and upvc', 'upvc vs', 'vs upvc', 'difference', 'compare', 'comparison', 'better', 'which is better', 'which one', 'or aluminium', 'or upvc', 'फ़र्क', 'फर्क', 'अंतर', 'बेहतर', 'ਫ਼ਰਕ', 'ਫਰਕ', 'ਬਿਹਤਰ', 'ਜਾਂ ਐਲੂਮੀਨੀਅਮ', 'या एल्युमिनियम']
    },
    {
      id: 'upvc-designs',
      topic: 'upvc',
      q: {
        en: 'Which uPVC window and door designs are available?',
        hi: 'uPVC खिड़कियों और दरवाज़ों के कौन-से डिज़ाइन हैं?',
        pa: 'uPVC ਖਿੜਕੀਆਂ ਅਤੇ ਦਰਵਾਜ਼ਿਆਂ ਦੇ ਕਿਹੜੇ ਡਿਜ਼ਾਈਨ ਹਨ?'
      },
      a: {
        en: '- **Windows:** 2/3-track sliding (with a mosquito mesh option), casement, tilt-and-turn, top-hung, fixed, combination and bay windows, plus ventilators\n- **Doors:** sliding, casement, French, lift-and-slide, balcony and entrance doors\nAll use multi-chamber profiles with galvanised steel reinforcement and multi-point locks.',
        hi: '- **खिड़कियाँ:** 2/3-ट्रैक स्लाइडिंग (मच्छरदानी जाली के विकल्प के साथ), केसमेंट, टिल्ट-एंड-टर्न, टॉप-हंग, फ़िक्स्ड, कॉम्बिनेशन और बे विंडो, साथ में वेंटिलेटर\n- **दरवाज़े:** स्लाइडिंग, केसमेंट, फ़्रेंच, लिफ़्ट-एंड-स्लाइड, बालकनी और एंट्रेंस डोर\nसभी में मल्टी-चैंबर प्रोफ़ाइल, गैल्वनाइज़्ड स्टील रीइन्फ़ोर्समेंट और मल्टी-पॉइंट लॉक होते हैं।',
        pa: '- **ਖਿੜਕੀਆਂ:** 2/3-ਟ੍ਰੈਕ ਸਲਾਈਡਿੰਗ (ਮੱਛਰ ਜਾਲੀ ਦੇ ਵਿਕਲਪ ਨਾਲ), ਕੇਸਮੈਂਟ, ਟਿਲਟ-ਐਂਡ-ਟਰਨ, ਟੌਪ-ਹੰਗ, ਫ਼ਿਕਸਡ, ਕੌਂਬੀਨੇਸ਼ਨ ਅਤੇ ਬੇਅ ਵਿੰਡੋ, ਨਾਲ ਹੀ ਵੈਂਟੀਲੇਟਰ\n- **ਦਰਵਾਜ਼ੇ:** ਸਲਾਈਡਿੰਗ, ਕੇਸਮੈਂਟ, ਫ਼੍ਰੈਂਚ, ਲਿਫ਼ਟ-ਐਂਡ-ਸਲਾਈਡ, ਬਾਲਕੋਨੀ ਅਤੇ ਐਂਟ੍ਰੈਂਸ ਡੋਰ\nਸਾਰਿਆਂ ਵਿੱਚ ਮਲਟੀ-ਚੈਂਬਰ ਪ੍ਰੋਫ਼ਾਈਲ, ਗੈਲਵਨਾਈਜ਼ਡ ਸਟੀਲ ਰੀਇਨਫ਼ੋਰਸਮੈਂਟ ਅਤੇ ਮਲਟੀ-ਪੁਆਇੰਟ ਲੌਕ ਹੁੰਦੇ ਹਨ।'
      },
      links: ['upvc-systems.html'],
      related: ['upvc-benefits', 'upvc-care', 'price'],
      keywords: ['design', 'designs', 'style', 'styles', 'model', 'models', 'options', 'tilt and turn', 'tilt turn', 'french door', 'balcony door', 'entrance door', 'main door', 'डिज़ाइन', 'डिजाइन', 'ਡਿਜ਼ਾਈਨ', 'ਡਿਜਾਈਨ']
    },
    {
      id: 'upvc-care',
      topic: 'upvc',
      q: {
        en: 'How do I maintain uPVC windows?',
        hi: 'uPVC खिड़कियों का रखरखाव कैसे करें?',
        pa: 'uPVC ਖਿੜਕੀਆਂ ਦੀ ਸੰਭਾਲ ਕਿਵੇਂ ਕਰੀਏ?'
      },
      a: {
        en: 'uPVC needs very little care:\n- Wipe frames with **mild soap and water**\n- Avoid abrasive cleaners and solvents\n- Keep sliding tracks and drainage holes free of dust\n- Lightly lubricate the hardware now and then\nIt never needs sanding or repainting.',
        hi: 'uPVC को बहुत कम देखभाल चाहिए:\n- फ़्रेम को **हल्के साबुन और पानी** से पोंछें\n- खुरदरे क्लीनर और सॉल्वेंट से बचें\n- स्लाइडिंग ट्रैक और ड्रेनेज होल को धूल से साफ़ रखें\n- कभी-कभी हार्डवेयर में हल्का लुब्रिकेंट डालें\nइसे कभी घिसाई या दोबारा पेंट की ज़रूरत नहीं होती।',
        pa: 'uPVC ਨੂੰ ਬਹੁਤ ਘੱਟ ਸੰਭਾਲ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ:\n- ਫ਼ਰੇਮ ਨੂੰ **ਹਲਕੇ ਸਾਬਣ ਅਤੇ ਪਾਣੀ** ਨਾਲ ਪੂੰਝੋ\n- ਖੁਰਦਰੇ ਕਲੀਨਰ ਅਤੇ ਸੌਲਵੈਂਟ ਤੋਂ ਬਚੋ\n- ਸਲਾਈਡਿੰਗ ਟ੍ਰੈਕ ਅਤੇ ਡ੍ਰੇਨੇਜ ਹੋਲ ਨੂੰ ਧੂੜ ਤੋਂ ਸਾਫ਼ ਰੱਖੋ\n- ਕਦੇ-ਕਦੇ ਹਾਰਡਵੇਅਰ ਵਿੱਚ ਹਲਕਾ ਲੁਬਰੀਕੈਂਟ ਪਾਓ\nਇਸ ਨੂੰ ਕਦੇ ਘਸਾਈ ਜਾਂ ਮੁੜ ਪੇਂਟ ਦੀ ਲੋੜ ਨਹੀਂ ਪੈਂਦੀ।'
      },
      links: ['upvc-systems.html'],
      related: ['upvc-benefits', 'upvc-designs'],
      keywords: ['!maintain', '!maintenance', '!clean', 'cleaning', 'care', 'lubricate', 'safai', 'रखरखाव', 'सफ़ाई', 'सफाई', 'ਸੰਭਾਲ', 'ਸਫ਼ਾਈ', 'ਸਫਾਈ']
    },

    /* -------------------------------------------------------------- Company */
    {
      id: 'about',
      topic: 'company',
      q: {
        en: 'Tell me about JK International',
        hi: 'JK International के बारे में बताइए',
        pa: 'JK International ਬਾਰੇ ਦੱਸੋ'
      },
      a: {
        en: 'JK International has been manufacturing since **1996**. We are a certified maker of **architectural glass, aluminium systems and uPVC windows & doors**, offering complete turnkey solutions.\n- **2 factory plants**, 50,000+ sq ft\n- **1,200+ m²** of output per day\n- Serving architects, builders, contractors and homeowners across **North India**',
        hi: 'JK International **1996** से मैन्युफैक्चरिंग कर रहा है। हम **आर्किटेक्चरल ग्लास, एल्युमिनियम सिस्टम और uPVC खिड़की-दरवाज़ों** के सर्टिफ़ाइड निर्माता हैं और पूरा टर्नकी समाधान देते हैं।\n- **2 फ़ैक्टरी प्लांट**, 50,000+ वर्ग फ़ुट\n- रोज़ाना **1,200+ वर्ग मीटर** उत्पादन\n- पूरे **उत्तर भारत** में आर्किटेक्ट, बिल्डर, कॉन्ट्रैक्टर और घर-मालिकों को सेवा',
        pa: 'JK International **1996** ਤੋਂ ਮੈਨੂਫੈਕਚਰਿੰਗ ਕਰ ਰਿਹਾ ਹੈ। ਅਸੀਂ **ਆਰਕੀਟੈਕਚਰਲ ਗਲਾਸ, ਐਲੂਮੀਨੀਅਮ ਸਿਸਟਮ ਅਤੇ uPVC ਖਿੜਕੀਆਂ-ਦਰਵਾਜ਼ਿਆਂ** ਦੇ ਸਰਟੀਫ਼ਾਈਡ ਨਿਰਮਾਤਾ ਹਾਂ ਅਤੇ ਪੂਰਾ ਟਰਨਕੀ ਹੱਲ ਦਿੰਦੇ ਹਾਂ।\n- **2 ਫ਼ੈਕਟਰੀ ਪਲਾਂਟ**, 50,000+ ਵਰਗ ਫ਼ੁੱਟ\n- ਰੋਜ਼ਾਨਾ **1,200+ ਵਰਗ ਮੀਟਰ** ਉਤਪਾਦਨ\n- ਪੂਰੇ **ਉੱਤਰੀ ਭਾਰਤ** ਵਿੱਚ ਆਰਕੀਟੈਕਟਾਂ, ਬਿਲਡਰਾਂ, ਠੇਕੇਦਾਰਾਂ ਅਤੇ ਘਰ-ਮਾਲਕਾਂ ਨੂੰ ਸੇਵਾ'
      },
      links: ['about.html', 'infrastructure.html'],
      related: ['certifications', 'locations', 'projects'],
      keywords: ['about', 'company', 'who are you', 'jk international', 'history', 'experience', 'since', 'established', 'how old', 'years', 'capacity', 'कंपनी', 'के बारे में', 'ਕੰਪਨੀ', 'ਬਾਰੇ ਦੱਸੋ']
    },
    {
      id: 'certifications',
      topic: 'company',
      q: {
        en: 'Which certifications do you have?',
        hi: 'आपके पास कौन-से सर्टिफ़िकेशन हैं?',
        pa: 'ਤੁਹਾਡੇ ਕੋਲ ਕਿਹੜੇ ਸਰਟੀਫ਼ਿਕੇਸ਼ਨ ਹਨ?'
      },
      a: {
        en: '- **ISO 9001:2015** certified\n- **BIS** marked (IS 2553 for safety glass)\n- Products made to **CE norms**\n- Plant certified by **Saint-Gobain India** (2016)\n- **ASRTU** certified (2017)\n- **Gujarat Forensic Lab** certified for bullet resistant glass (2017)\nWe also run an in-house testing lab for stress, distortion and thermal shock checks.',
        hi: '- **ISO 9001:2015** सर्टिफ़ाइड\n- **BIS** मार्क (सेफ्टी ग्लास के लिए IS 2553)\n- उत्पाद **CE मानकों** के अनुसार\n- प्लांट **Saint-Gobain India** से सर्टिफ़ाइड (2016)\n- **ASRTU** सर्टिफ़ाइड (2017)\n- बुलेट रेज़िस्टेंट ग्लास के लिए **गुजरात फ़ॉरेंसिक लैब** से सर्टिफ़ाइड (2017)\nहमारी अपनी टेस्टिंग लैब में स्ट्रेस, डिस्टॉर्शन और थर्मल शॉक की जाँच भी होती है।',
        pa: '- **ISO 9001:2015** ਸਰਟੀਫ਼ਾਈਡ\n- **BIS** ਮਾਰਕ (ਸੇਫ਼ਟੀ ਗਲਾਸ ਲਈ IS 2553)\n- ਉਤਪਾਦ **CE ਮਿਆਰਾਂ** ਮੁਤਾਬਕ\n- ਪਲਾਂਟ **Saint-Gobain India** ਤੋਂ ਸਰਟੀਫ਼ਾਈਡ (2016)\n- **ASRTU** ਸਰਟੀਫ਼ਾਈਡ (2017)\n- ਬੁਲੇਟ ਰੋਧਕ ਗਲਾਸ ਲਈ **ਗੁਜਰਾਤ ਫ਼ੌਰੈਂਸਿਕ ਲੈਬ** ਤੋਂ ਸਰਟੀਫ਼ਾਈਡ (2017)\nਸਾਡੀ ਆਪਣੀ ਟੈਸਟਿੰਗ ਲੈਬ ਵਿੱਚ ਸਟ੍ਰੈੱਸ, ਡਿਸਟੌਰਸ਼ਨ ਅਤੇ ਥਰਮਲ ਸ਼ੌਕ ਦੀ ਜਾਂਚ ਵੀ ਹੁੰਦੀ ਹੈ।'
      },
      links: ['about.html'],
      related: ['about', 'bullet', 'glass-size'],
      keywords: ['!certified', '!certification', '!certificate', '!iso', 'bis', 'isi', 'ce mark', 'ce norms', 'standard', 'standards', 'quality', 'saint gobain', 'asrtu', 'testing', 'सर्टिफ़िकेशन', 'सर्टिफिकेशन', 'सर्टिफ़िकेट', 'सर्टिफिकेट', 'प्रमाण', 'ਸਰਟੀਫ਼ਿਕੇਸ਼ਨ', 'ਸਰਟੀਫਿਕੇਸ਼ਨ', 'ਸਰਟੀਫ਼ਿਕੇਟ', 'ਸਰਟੀਫਿਕੇਟ']
    },
    {
      id: 'locations',
      topic: 'company',
      q: {
        en: 'Where are your factories and office?',
        hi: 'आपकी फ़ैक्टरी और ऑफ़िस कहाँ हैं?',
        pa: 'ਤੁਹਾਡੀ ਫ਼ੈਕਟਰੀ ਅਤੇ ਦਫ਼ਤਰ ਕਿੱਥੇ ਹਨ?'
      },
      a: {
        en: '- **Unit-1, Kangra (H.P.):** 18, Industrial Area Bai Attarian, Kandrori\n- **Unit-2, Jalandhar (Punjab):** Dhogri Link Road, Opp. Sikandarpur Marriage Palace\n- **City Office, Jalandhar:** 46, New Industrial Estate, Behind Chara Mandi, Near Lamba Pind Chowk\nYou are welcome to visit; our sales team can schedule a plant visit.',
        hi: '- **यूनिट-1, कांगड़ा (हि.प्र.):** 18, Industrial Area Bai Attarian, Kandrori\n- **यूनिट-2, जालंधर (पंजाब):** Dhogri Link Road, Opp. Sikandarpur Marriage Palace\n- **सिटी ऑफ़िस, जालंधर:** 46, New Industrial Estate, Behind Chara Mandi, Near Lamba Pind Chowk\nआप प्लांट देखने आ सकते हैं; हमारी सेल्स टीम विज़िट तय कर देगी।',
        pa: '- **ਯੂਨਿਟ-1, ਕਾਂਗੜਾ (ਹਿ.ਪ੍ਰ.):** 18, Industrial Area Bai Attarian, Kandrori\n- **ਯੂਨਿਟ-2, ਜਲੰਧਰ (ਪੰਜਾਬ):** Dhogri Link Road, Opp. Sikandarpur Marriage Palace\n- **ਸਿਟੀ ਦਫ਼ਤਰ, ਜਲੰਧਰ:** 46, New Industrial Estate, Behind Chara Mandi, Near Lamba Pind Chowk\nਤੁਸੀਂ ਪਲਾਂਟ ਵੇਖਣ ਆ ਸਕਦੇ ਹੋ; ਸਾਡੀ ਸੇਲਜ਼ ਟੀਮ ਵਿਜ਼ਿਟ ਤੈਅ ਕਰ ਦੇਵੇਗੀ।'
      },
      links: ['infrastructure.html', 'contact.html'],
      related: ['areas', 'contact', 'about'],
      keywords: ['!address', '!where', '!location', 'located', 'factory', 'factories', 'plant', 'office', 'visit', 'showroom', 'jalandhar', 'kangra', 'kandrori', 'damtal', 'kahan', 'kithe', 'पता', 'कहाँ', 'कहां', 'फ़ैक्टरी', 'फैक्टरी', 'ऑफ़िस', 'ऑफिस', 'ਪਤਾ', 'ਕਿੱਥੇ', 'ਫ਼ੈਕਟਰੀ', 'ਫੈਕਟਰੀ', 'ਦਫ਼ਤਰ', 'ਦਫਤਰ']
    },
    {
      id: 'areas',
      topic: 'company',
      q: {
        en: 'Which areas do you supply to?',
        hi: 'आप किन इलाकों में सप्लाई करते हैं?',
        pa: 'ਤੁਸੀਂ ਕਿਹੜੇ ਇਲਾਕਿਆਂ ਵਿੱਚ ਸਪਲਾਈ ਕਰਦੇ ਹੋ?'
      },
      a: {
        en: 'Our sales desks cover **Punjab, Chandigarh Tricity, Haryana, Himachal Pradesh and Jammu & Kashmir**.\nFor projects in other regions, share your location and our sales team will confirm.',
        hi: 'हमारी सेल्स टीम **पंजाब, चंडीगढ़ ट्राइसिटी, हरियाणा, हिमाचल प्रदेश और जम्मू-कश्मीर** को कवर करती है।\nदूसरे इलाकों के प्रोजेक्ट के लिए अपनी लोकेशन बताइए, हमारी सेल्स टीम पुष्टि करेगी।',
        pa: 'ਸਾਡੀ ਸੇਲਜ਼ ਟੀਮ **ਪੰਜਾਬ, ਚੰਡੀਗੜ੍ਹ ਟ੍ਰਾਈਸਿਟੀ, ਹਰਿਆਣਾ, ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼ ਅਤੇ ਜੰਮੂ-ਕਸ਼ਮੀਰ** ਨੂੰ ਕਵਰ ਕਰਦੀ ਹੈ।\nਹੋਰ ਇਲਾਕਿਆਂ ਦੇ ਪ੍ਰੋਜੈਕਟ ਲਈ ਆਪਣੀ ਲੋਕੇਸ਼ਨ ਦੱਸੋ, ਸਾਡੀ ਸੇਲਜ਼ ਟੀਮ ਪੁਸ਼ਟੀ ਕਰੇਗੀ।'
      },
      links: ['contact.html'],
      related: ['locations', 'installation', 'contact'],
      keywords: ['deliver to', 'supply to', 'area', 'areas', 'region', 'state', 'city', 'serve', 'service area', 'all india', 'outside', 'chandigarh', 'mohali', 'panchkula', 'ludhiana', 'amritsar', 'patiala', 'bathinda', 'punjab', 'haryana', 'himachal', 'shimla', 'manali', 'dharamshala', 'jammu', 'kashmir', 'delhi', 'इलाक', 'शहर', 'राज्य', 'ਇਲਾਕ', 'ਸ਼ਹਿਰ', 'ਰਾਜ']
    },
    {
      id: 'projects',
      topic: 'company',
      q: {
        en: 'Can I see your completed projects?',
        hi: 'क्या आपके पूरे हुए प्रोजेक्ट देखे जा सकते हैं?',
        pa: 'ਕੀ ਤੁਹਾਡੇ ਪੂਰੇ ਹੋਏ ਪ੍ਰੋਜੈਕਟ ਵੇਖੇ ਜਾ ਸਕਦੇ ਹਨ?'
      },
      a: {
        en: 'Of course! Some of our projects:\n- Elante Mall, Chandigarh\n- Narayana School, Mohali\n- Hotel Golden Apple and The Holiday Resort, Manali\n- Indraprastha Spa Resort, Dharamshala\n- Hotel Kamal Grand, Jalandhar\nWe work on homes, hotels, schools, offices and malls. See the photos in our projects gallery.',
        hi: 'ज़रूर! हमारे कुछ प्रोजेक्ट:\n- Elante Mall, चंडीगढ़\n- Narayana School, मोहाली\n- Hotel Golden Apple और The Holiday Resort, मनाली\n- Indraprastha Spa Resort, धर्मशाला\n- Hotel Kamal Grand, जालंधर\nहम घरों, होटलों, स्कूलों, दफ़्तरों और मॉल पर काम करते हैं। तस्वीरें हमारी प्रोजेक्ट गैलरी में देखें।',
        pa: 'ਜ਼ਰੂਰ! ਸਾਡੇ ਕੁਝ ਪ੍ਰੋਜੈਕਟ:\n- Elante Mall, ਚੰਡੀਗੜ੍ਹ\n- Narayana School, ਮੋਹਾਲੀ\n- Hotel Golden Apple ਅਤੇ The Holiday Resort, ਮਨਾਲੀ\n- Indraprastha Spa Resort, ਧਰਮਸ਼ਾਲਾ\n- Hotel Kamal Grand, ਜਲੰਧਰ\nਅਸੀਂ ਘਰਾਂ, ਹੋਟਲਾਂ, ਸਕੂਲਾਂ, ਦਫ਼ਤਰਾਂ ਅਤੇ ਮਾਲਾਂ ਉੱਤੇ ਕੰਮ ਕਰਦੇ ਹਾਂ। ਤਸਵੀਰਾਂ ਸਾਡੀ ਪ੍ਰੋਜੈਕਟ ਗੈਲਰੀ ਵਿੱਚ ਵੇਖੋ।'
      },
      links: ['projects.html'],
      related: ['about', 'facade', 'price'],
      keywords: ['!project', '!portfolio', 'completed', 'previous work', 'past work', 'clients', 'client', 'gallery', 'photos', 'pictures', 'references', 'work done', 'elante', 'hotel', 'mall', 'प्रोजेक्ट', 'गैलरी', 'ਪ੍ਰੋਜੈਕਟ', 'ਗੈਲਰੀ']
    },

    /* ------------------------------------------------------- Prices & quotes */
    {
      id: 'price',
      topic: 'quote',
      q: {
        en: 'What are your prices?',
        hi: 'आपकी कीमतें क्या हैं?',
        pa: 'ਤੁਹਾਡੀਆਂ ਕੀਮਤਾਂ ਕੀ ਹਨ?'
      },
      a: {
        en: 'Prices depend on the **product, size, thickness, quantity and site location**, so we quote each project individually, at **direct factory rates**.\nShare your requirement and our estimation team usually sends a quotation within **2–4 business hours**.',
        hi: 'कीमत **उत्पाद, साइज़, मोटाई, मात्रा और साइट की लोकेशन** पर निर्भर करती है, इसलिए हम हर प्रोजेक्ट का अलग कोटेशन देते हैं, **सीधे फ़ैक्टरी रेट** पर।\nअपनी ज़रूरत बताइए; हमारी एस्टिमेशन टीम आमतौर पर **2–4 कार्य घंटों** में कोटेशन भेज देती है।',
        pa: 'ਕੀਮਤ **ਉਤਪਾਦ, ਸਾਈਜ਼, ਮੋਟਾਈ, ਮਾਤਰਾ ਅਤੇ ਸਾਈਟ ਦੀ ਲੋਕੇਸ਼ਨ** ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ, ਇਸ ਲਈ ਅਸੀਂ ਹਰ ਪ੍ਰੋਜੈਕਟ ਦੀ ਵੱਖਰੀ ਕੋਟੇਸ਼ਨ ਦਿੰਦੇ ਹਾਂ, **ਸਿੱਧੇ ਫ਼ੈਕਟਰੀ ਰੇਟ** ਉੱਤੇ।\nਆਪਣੀ ਲੋੜ ਦੱਸੋ; ਸਾਡੀ ਐਸਟੀਮੇਸ਼ਨ ਟੀਮ ਆਮ ਤੌਰ ਉੱਤੇ **2–4 ਕਾਰੋਬਾਰੀ ਘੰਟਿਆਂ** ਵਿੱਚ ਕੋਟੇਸ਼ਨ ਭੇਜ ਦਿੰਦੀ ਹੈ।'
      },
      links: ['contact.html'],
      cta: 'quote',
      related: ['quote-how', 'installation', 'which-glass'],
      keywords: ['!price', '!prices', '!pricing', '!rate', '!rates', '!cost', '!how much', '!kitna', '!kitne', '!kimat', '!keemat', '!kemat', '!bhav', '!bhaav', '!daam', 'charges', 'per sq ft', 'per sqft', 'per square', 'sq ft', 'sqft', 'rupees', 'rs', 'budget', 'expensive', 'cheap', 'affordable', 'discount', 'factory rate', '!कीमत', '!क़ीमत', '!दाम', '!रेट', '!भाव', '!कितने', '!कितना', '!ਕੀਮਤ', '!ਰੇਟ', '!ਭਾਅ', '!ਕਿੰਨੇ', '!ਕਿੰਨਾ', '!ਮੁੱਲ']
    },
    {
      id: 'quote-how',
      topic: 'quote',
      q: {
        en: 'How do I get a quotation?',
        hi: 'कोटेशन कैसे मिलेगा?',
        pa: 'ਕੋਟੇਸ਼ਨ ਕਿਵੇਂ ਮਿਲੇਗੀ?'
      },
      a: {
        en: 'It is quick:\n- Tap **Get a quote** below and share your requirement\n- Or send sizes, drawings or photos on **WhatsApp**\n- Or fill in the form on our contact page\nOur team usually replies within **2–4 business hours**.',
        hi: 'बहुत आसान है:\n- नीचे **कोटेशन पाएँ** पर टैप करके अपनी ज़रूरत बताएँ\n- या साइज़, ड्रॉइंग या फ़ोटो **WhatsApp** पर भेजें\n- या हमारे संपर्क पेज का फ़ॉर्म भरें\nहमारी टीम आमतौर पर **2–4 कार्य घंटों** में जवाब देती है।',
        pa: 'ਬਹੁਤ ਸੌਖਾ ਹੈ:\n- ਹੇਠਾਂ **ਕੋਟੇਸ਼ਨ ਲਓ** ਉੱਤੇ ਟੈਪ ਕਰਕੇ ਆਪਣੀ ਲੋੜ ਦੱਸੋ\n- ਜਾਂ ਸਾਈਜ਼, ਡਰਾਇੰਗ ਜਾਂ ਫ਼ੋਟੋ **WhatsApp** ਉੱਤੇ ਭੇਜੋ\n- ਜਾਂ ਸਾਡੇ ਸੰਪਰਕ ਪੰਨੇ ਦਾ ਫ਼ਾਰਮ ਭਰੋ\nਸਾਡੀ ਟੀਮ ਆਮ ਤੌਰ ਉੱਤੇ **2–4 ਕਾਰੋਬਾਰੀ ਘੰਟਿਆਂ** ਵਿੱਚ ਜਵਾਬ ਦਿੰਦੀ ਹੈ।'
      },
      links: ['contact.html'],
      cta: 'quote',
      contacts: true,
      related: ['price', 'installation', 'contact'],
      keywords: ['!quotation', '!quote', '!estimate', 'enquiry', 'inquiry', 'order', 'buy', 'purchase', 'requirement', 'boq', 'drawing', 'कोटेशन', 'ऑर्डर', 'खरीद', 'ਕੋਟੇਸ਼ਨ', 'ਆਰਡਰ', 'ਖਰੀਦ']
    },
    {
      id: 'installation',
      topic: 'quote',
      q: {
        en: 'Do you handle delivery and installation?',
        hi: 'क्या आप डिलीवरी और इंस्टॉलेशन करते हैं?',
        pa: 'ਕੀ ਤੁਸੀਂ ਡਿਲੀਵਰੀ ਅਤੇ ਇੰਸਟਾਲੇਸ਼ਨ ਕਰਦੇ ਹੋ?'
      },
      a: {
        en: 'We offer **turnkey solutions**: glass together with aluminium or uPVC systems, all from one company.\nDelivery, installation and timelines depend on your project and location, so our sales team confirms them with your quotation.',
        hi: 'हम **टर्नकी समाधान** देते हैं: ग्लास के साथ एल्युमिनियम या uPVC सिस्टम, सब एक ही कंपनी से।\nडिलीवरी, इंस्टॉलेशन और समय-सीमा आपके प्रोजेक्ट और लोकेशन पर निर्भर करती है, इसलिए हमारी सेल्स टीम इन्हें आपके कोटेशन के साथ पक्का करती है।',
        pa: 'ਅਸੀਂ **ਟਰਨਕੀ ਹੱਲ** ਦਿੰਦੇ ਹਾਂ: ਗਲਾਸ ਦੇ ਨਾਲ ਐਲੂਮੀਨੀਅਮ ਜਾਂ uPVC ਸਿਸਟਮ, ਸਭ ਇੱਕੋ ਕੰਪਨੀ ਤੋਂ।\nਡਿਲੀਵਰੀ, ਇੰਸਟਾਲੇਸ਼ਨ ਅਤੇ ਸਮਾਂ-ਸੀਮਾ ਤੁਹਾਡੇ ਪ੍ਰੋਜੈਕਟ ਅਤੇ ਲੋਕੇਸ਼ਨ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ, ਇਸ ਲਈ ਸਾਡੀ ਸੇਲਜ਼ ਟੀਮ ਇਹਨਾਂ ਨੂੰ ਤੁਹਾਡੀ ਕੋਟੇਸ਼ਨ ਦੇ ਨਾਲ ਪੱਕਾ ਕਰਦੀ ਹੈ।'
      },
      links: ['contact.html'],
      cta: 'quote',
      related: ['price', 'areas', 'quote-how'],
      keywords: ['!install', '!installation', '!delivery', 'deliver', 'fitting', 'fitter', 'fixing', 'how long', 'timeline', 'time line', 'lead time', 'days', 'turnkey', 'measurement', 'site visit', 'डिलीवरी', 'इंस्टॉल', 'इंस्टाल', 'फिटिंग', 'ਡਿਲੀਵਰੀ', 'ਇੰਸਟਾਲ', 'ਫਿਟਿੰਗ']
    },
    {
      id: 'contact',
      topic: 'quote',
      q: {
        en: 'How can I contact your sales team?',
        hi: 'सेल्स टीम से कैसे संपर्क करें?',
        pa: 'ਸੇਲਜ਼ ਟੀਮ ਨਾਲ ਕਿਵੇਂ ਸੰਪਰਕ ਕਰੀਏ?'
      },
      a: {
        en: '- **Punjab, Chandigarh & Haryana:** +91-78146-53907, +91-93174-53911 · sales@jkglasses.com\n- **Himachal & J&K:** +91-93189-53907 · jkglasses@gmail.com\n- **WhatsApp:** +91-85660-08869\nOr tap **Request a call back** and we will call you.',
        hi: '- **पंजाब, चंडीगढ़ और हरियाणा:** +91-78146-53907, +91-93174-53911 · sales@jkglasses.com\n- **हिमाचल और जम्मू-कश्मीर:** +91-93189-53907 · jkglasses@gmail.com\n- **WhatsApp:** +91-85660-08869\nया **कॉल बैक माँगें** पर टैप करें, हम आपको कॉल करेंगे।',
        pa: '- **ਪੰਜਾਬ, ਚੰਡੀਗੜ੍ਹ ਅਤੇ ਹਰਿਆਣਾ:** +91-78146-53907, +91-93174-53911 · sales@jkglasses.com\n- **ਹਿਮਾਚਲ ਅਤੇ ਜੰਮੂ-ਕਸ਼ਮੀਰ:** +91-93189-53907 · jkglasses@gmail.com\n- **WhatsApp:** +91-85660-08869\nਜਾਂ **ਕਾਲ ਬੈਕ ਮੰਗੋ** ਉੱਤੇ ਟੈਪ ਕਰੋ, ਅਸੀਂ ਤੁਹਾਨੂੰ ਕਾਲ ਕਰਾਂਗੇ।'
      },
      links: ['contact.html'],
      cta: 'callback',
      related: ['locations', 'quote-how', 'price'],
      keywords: ['!contact', '!phone', '!mobile number', '!call me', '!callback', '!call back', '~number', 'call', 'email', 'mail', 'whatsapp', 'talk', 'speak', 'sales team', 'sales person', 'executive', 'representative', 'human', 'person', 'agent', 'baat', 'sampark', 'संपर्क', 'फ़ोन', 'फोन', 'नंबर', 'बात', 'ਸੰਪਰਕ', 'ਫ਼ੋਨ', 'ਫੋਨ', 'ਨੰਬਰ', 'ਗੱਲ']
    }
  ]
};
