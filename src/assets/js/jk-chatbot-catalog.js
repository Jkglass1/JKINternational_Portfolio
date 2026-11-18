/* ==========================================================================
   JK International - Chatbot product catalogue
   Category -> Subcategory -> Product, used by assets/js/jk-chatbot.js for the
   "Explore our products" journey and for product-specific answers.

   Editing guide
   - ONLY verified facts. Every line here comes from the product pages on this
     website and the approved knowledge base (docs/GoogleAppsScript_ChatbotKnowledge.gs).
     Do not add prices, delivery times, minimum quantities or certifications
     that the company has not approved: the chatbot hands those to the sales team.
   - Each text is { en, hi, pa }. A missing hi/pa falls back to English.
   - A product may have:
       summary   1-2 sentence description
       points    up to 4 key characteristics
       uses      where it is used
       specs     verified specification facts (shown for "Specifications /
                 thickness" questions). Leave it out when none are published:
                 the chatbot then says so honestly and offers the sales team.
       page      website page for "Read more"
       ask       requirement questions for a quotation (default: the category's)
   - Subcategory grouping is for navigation only.
   - To add a language: add its key to every text and to LANGS in jk-chatbot.js.
   ========================================================================== */

window.JK_CHATBOT_CATALOG = {
  version: '2026-11-18',

  categories: [
    /* ================================================================ GLASS */
    {
      id: 'glass',
      icon: 'glass',
      label: { en: 'Glass Solutions', hi: 'ग्लास सॉल्यूशंस', pa: 'ਗਲਾਸ ਸੋਲਿਊਸ਼ਨਜ਼' },
      intro: {
        en: 'Architectural glass processed in-house at our Kangra and Jalandhar plants.',
        hi: 'हमारे कांगड़ा और जालंधर प्लांट में प्रोसेस किया गया आर्किटेक्चरल ग्लास।',
        pa: 'ਸਾਡੇ ਕਾਂਗੜਾ ਅਤੇ ਜਲੰਧਰ ਪਲਾਂਟਾਂ ਵਿੱਚ ਪ੍ਰੋਸੈਸ ਕੀਤਾ ਆਰਕੀਟੈਕਚਰਲ ਗਲਾਸ।'
      },
      page: 'glass-solutions.html',
      ask: ['quantity', 'specifications', 'deliveryLocation', 'timeline'],
      hints: {
        quantity: { en: 'e.g. 500 sq ft, or 20 pieces', hi: 'जैसे 500 वर्ग फुट, या 20 पीस', pa: 'ਜਿਵੇਂ 500 ਵਰਗ ਫੁੱਟ, ਜਾਂ 20 ਪੀਸ' },
        specifications: { en: 'e.g. 12 mm, 1200 × 2400 mm, clear', hi: 'जैसे 12 mm, 1200 × 2400 mm, क्लियर', pa: 'ਜਿਵੇਂ 12 mm, 1200 × 2400 mm, ਕਲੀਅਰ' }
      },
      subcategories: [
        {
          id: 'safety',
          label: { en: 'Safety Glass', hi: 'सेफ्टी ग्लास', pa: 'ਸੇਫ਼ਟੀ ਗਲਾਸ' },
          products: [
            {
              id: 'toughened',
              label: { en: 'Toughened Glass', hi: 'टफन्ड ग्लास', pa: 'ਟਫਨਡ ਗਲਾਸ' },
              summary: {
                en: 'High-strength safety glass, heat-treated in a forced-convection tempering furnace.',
                hi: 'उच्च मजबूती वाला सेफ्टी ग्लास, जिसे फोर्स्ड-कन्वेक्शन टेम्परिंग फर्नेस में हीट-ट्रीट किया जाता है।',
                pa: 'ਬਹੁਤ ਮਜ਼ਬੂਤ ਸੇਫ਼ਟੀ ਗਲਾਸ, ਜਿਸ ਨੂੰ ਫੋਰਸਡ-ਕਨਵੈਕਸ਼ਨ ਟੈਂਪਰਿੰਗ ਫਰਨੇਸ ਵਿੱਚ ਹੀਟ-ਟ੍ਰੀਟ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।'
              },
              points: [
                { en: '4–5 times stronger than annealed float glass of the same thickness', hi: 'उसी मोटाई के एनील्ड फ्लोट ग्लास से 4–5 गुना मजबूत', pa: 'ਉਸੇ ਮੋਟਾਈ ਦੇ ਐਨੀਲਡ ਫਲੋਟ ਗਲਾਸ ਨਾਲੋਂ 4–5 ਗੁਣਾ ਮਜ਼ਬੂਤ' },
                { en: 'Higher resistance to sudden temperature changes', hi: 'अचानक तापमान बदलाव को बेहतर सहता है', pa: 'ਅਚਾਨਕ ਤਾਪਮਾਨ ਬਦਲਾਅ ਨੂੰ ਵਧੀਆ ਸਹਿੰਦਾ ਹੈ' },
                { en: 'Breaks into small blunt pieces, reducing injury risk', hi: 'टूटने पर छोटे, कम धारदार टुकड़ों में बिखरता है, चोट का खतरा कम', pa: 'ਟੁੱਟਣ ’ਤੇ ਛੋਟੇ, ਘੱਟ ਤਿੱਖੇ ਟੁਕੜਿਆਂ ਵਿੱਚ ਟੁੱਟਦਾ ਹੈ, ਸੱਟ ਦਾ ਖ਼ਤਰਾ ਘੱਟ' }
              ],
              uses: {
                en: 'Facades, doors, partitions, shower enclosures, railings and balustrades.',
                hi: 'फ़साड, दरवाज़े, पार्टीशन, शावर एनक्लोज़र, रेलिंग और बालस्ट्रेड।',
                pa: 'ਫ਼ਸਾਡ, ਦਰਵਾਜ਼ੇ, ਪਾਰਟੀਸ਼ਨ, ਸ਼ਾਵਰ ਐਨਕਲੋਜ਼ਰ, ਰੇਲਿੰਗ ਅਤੇ ਬਾਲਸਟ੍ਰੇਡ।'
              },
              specs: {
                en: 'Our tempering furnace processes glass up to **19 mm** thick on a **2850 × 6000 mm** bed. Safety glass is BIS marked (IS 2553). The exact thickness and size for your order are confirmed by our team.',
                hi: 'हमारी टेम्परिंग फर्नेस **19 mm** तक मोटा ग्लास **2850 × 6000 mm** बेड पर प्रोसेस करती है। सेफ्टी ग्लास BIS मार्क (IS 2553) है। आपके ऑर्डर की सही मोटाई और साइज़ हमारी टीम कन्फ़र्म करती है।',
                pa: 'ਸਾਡੀ ਟੈਂਪਰਿੰਗ ਫਰਨੇਸ **19 mm** ਤੱਕ ਮੋਟਾ ਗਲਾਸ **2850 × 6000 mm** ਬੈੱਡ ’ਤੇ ਪ੍ਰੋਸੈਸ ਕਰਦੀ ਹੈ। ਸੇਫ਼ਟੀ ਗਲਾਸ BIS ਮਾਰਕ (IS 2553) ਹੈ। ਤੁਹਾਡੇ ਆਰਡਰ ਦੀ ਸਹੀ ਮੋਟਾਈ ਅਤੇ ਸਾਈਜ਼ ਸਾਡੀ ਟੀਮ ਪੱਕਾ ਕਰਦੀ ਹੈ।'
              },
              page: 'toughened-glass.html'
            },
            {
              id: 'heat-strengthened',
              label: { en: 'Heat Strengthened Glass', hi: 'हीट स्ट्रेंथन्ड ग्लास', pa: 'ਹੀਟ ਸਟ੍ਰੈਂਥਨਡ ਗਲਾਸ' },
              summary: {
                en: 'Partially tempered glass: cooled more slowly than toughened glass for balanced strength and flatness.',
                hi: 'आंशिक रूप से टेम्पर्ड ग्लास: टफन्ड ग्लास से धीरे ठंडा किया जाता है, जिससे मजबूती और समतलता का संतुलन मिलता है।',
                pa: 'ਅੰਸ਼ਕ ਤੌਰ ’ਤੇ ਟੈਂਪਰਡ ਗਲਾਸ: ਟਫਨਡ ਗਲਾਸ ਨਾਲੋਂ ਹੌਲੀ ਠੰਢਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ, ਜਿਸ ਨਾਲ ਮਜ਼ਬੂਤੀ ਅਤੇ ਸਮਤਲਤਾ ਦਾ ਸੰਤੁਲਨ ਮਿਲਦਾ ਹੈ।'
              },
              points: [
                { en: 'About twice as strong as annealed glass (less than toughened)', hi: 'एनील्ड ग्लास से लगभग दोगुना मजबूत (टफन्ड से कम)', pa: 'ਐਨੀਲਡ ਗਲਾਸ ਨਾਲੋਂ ਲਗਭਗ ਦੁੱਗਣਾ ਮਜ਼ਬੂਤ (ਟਫਨਡ ਨਾਲੋਂ ਘੱਟ)' },
                { en: 'Breaks into larger pieces that tend to stay in the frame', hi: 'बड़े टुकड़ों में टूटता है जो अक्सर फ्रेम में टिके रहते हैं', pa: 'ਵੱਡੇ ਟੁਕੜਿਆਂ ਵਿੱਚ ਟੁੱਟਦਾ ਹੈ ਜੋ ਅਕਸਰ ਫਰੇਮ ਵਿੱਚ ਟਿਕੇ ਰਹਿੰਦੇ ਹਨ' },
                { en: 'Better flatness and optical quality than fully toughened glass', hi: 'पूरी तरह टफन्ड ग्लास से बेहतर समतलता और ऑप्टिकल क्वालिटी', pa: 'ਪੂਰੀ ਤਰ੍ਹਾਂ ਟਫਨਡ ਗਲਾਸ ਨਾਲੋਂ ਵਧੀਆ ਸਮਤਲਤਾ ਅਤੇ ਆਪਟੀਕਲ ਕੁਆਲਿਟੀ' }
              ],
              uses: {
                en: 'Laminated units, curtain walls, facades, spandrels and skylights.',
                hi: 'लैमिनेटेड यूनिट, कर्टन वॉल, फ़साड, स्पैंड्रल और स्काइलाइट।',
                pa: 'ਲੈਮੀਨੇਟਿਡ ਯੂਨਿਟ, ਕਰਟਨ ਵਾਲ, ਫ਼ਸਾਡ, ਸਪੈਂਡਰਲ ਅਤੇ ਸਕਾਈਲਾਈਟ।'
              },
              page: 'heat-strengthened-glass.html'
            },
            {
              id: 'laminated',
              label: { en: 'Laminated Glass (PVB)', hi: 'लैमिनेटेड ग्लास (PVB)', pa: 'ਲੈਮੀਨੇਟਿਡ ਗਲਾਸ (PVB)' },
              summary: {
                en: 'Two or more glass layers bonded with a PVB interlayer under heat and pressure in an autoclave.',
                hi: 'दो या अधिक ग्लास परतें, जिन्हें ऑटोक्लेव में गर्मी और दबाव से PVB इंटरलेयर के साथ जोड़ा जाता है।',
                pa: 'ਦੋ ਜਾਂ ਵੱਧ ਗਲਾਸ ਪਰਤਾਂ, ਜਿਨ੍ਹਾਂ ਨੂੰ ਆਟੋਕਲੇਵ ਵਿੱਚ ਗਰਮੀ ਅਤੇ ਦਬਾਅ ਨਾਲ PVB ਇੰਟਰਲੇਅਰ ਨਾਲ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ।'
              },
              points: [
                { en: 'Holds fragments in place if broken and resists intrusion', hi: 'टूटने पर टुकड़ों को अपनी जगह रखता है और सेंधमारी रोकता है', pa: 'ਟੁੱਟਣ ’ਤੇ ਟੁਕੜਿਆਂ ਨੂੰ ਥਾਂ ’ਤੇ ਰੱਖਦਾ ਹੈ ਅਤੇ ਘੁਸਪੈਠ ਰੋਕਦਾ ਹੈ' },
                { en: 'Reduces outside noise', hi: 'बाहर का शोर कम करता है', pa: 'ਬਾਹਰ ਦਾ ਸ਼ੋਰ ਘਟਾਉਂਦਾ ਹੈ' },
                { en: 'Screens out about 99% of UV rays', hi: 'लगभग 99% UV किरणों को रोकता है', pa: 'ਲਗਭਗ 99% UV ਕਿਰਨਾਂ ਨੂੰ ਰੋਕਦਾ ਹੈ' }
              ],
              uses: {
                en: 'Skylights, canopies, atriums, overhead glazing, balustrades, security and acoustic glazing.',
                hi: 'स्काइलाइट, कैनोपी, एट्रियम, ओवरहेड ग्लेज़िंग, बालस्ट्रेड, सिक्योरिटी और एकॉस्टिक ग्लेज़िंग।',
                pa: 'ਸਕਾਈਲਾਈਟ, ਕੈਨੋਪੀ, ਐਟ੍ਰੀਅਮ, ਓਵਰਹੈੱਡ ਗਲੇਜ਼ਿੰਗ, ਬਾਲਸਟ੍ਰੇਡ, ਸਿਕਿਓਰਿਟੀ ਅਤੇ ਐਕੋਸਟਿਕ ਗਲੇਜ਼ਿੰਗ।'
              },
              specs: {
                en: 'PVB interlayer, bonded in a cleanroom and autoclaved under heat and pressure. Thickness and build-up for your project are confirmed by our team.',
                hi: 'PVB इंटरलेयर, क्लीनरूम में जोड़कर गर्मी और दबाव से ऑटोक्लेव किया जाता है। आपके प्रोजेक्ट की मोटाई और बनावट हमारी टीम कन्फ़र्म करती है।',
                pa: 'PVB ਇੰਟਰਲੇਅਰ, ਕਲੀਨਰੂਮ ਵਿੱਚ ਜੋੜ ਕੇ ਗਰਮੀ ਅਤੇ ਦਬਾਅ ਨਾਲ ਆਟੋਕਲੇਵ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਤੁਹਾਡੇ ਪ੍ਰੋਜੈਕਟ ਦੀ ਮੋਟਾਈ ਅਤੇ ਬਣਤਰ ਸਾਡੀ ਟੀਮ ਪੱਕੀ ਕਰਦੀ ਹੈ।'
              },
              page: 'laminated-glass.html'
            },
            {
              id: 'bullet-resistant',
              label: { en: 'Bullet Resistant Glass', hi: 'बुलेट रेज़िस्टेंट ग्लास', pa: 'ਬੁਲੇਟ ਰੋਧਕ ਗਲਾਸ' },
              summary: {
                en: 'Multi-layer glass and polycarbonate laminate that absorbs and disperses bullet energy.',
                hi: 'ग्लास और पॉलीकार्बोनेट की कई परतों वाला लैमिनेट, जो गोली की ऊर्जा को सोखकर फैला देता है।',
                pa: 'ਗਲਾਸ ਅਤੇ ਪੌਲੀਕਾਰਬੋਨੇਟ ਦੀਆਂ ਕਈ ਪਰਤਾਂ ਵਾਲਾ ਲੈਮੀਨੇਟ, ਜੋ ਗੋਲੀ ਦੀ ਊਰਜਾ ਨੂੰ ਸੋਖ ਕੇ ਫੈਲਾ ਦਿੰਦਾ ਹੈ।'
              },
              points: [
                { en: 'Certified by the Gujarat Forensic Lab (2017)', hi: 'गुजरात फॉरेंसिक लैब द्वारा प्रमाणित (2017)', pa: 'ਗੁਜਰਾਤ ਫੋਰੈਂਸਿਕ ਲੈਬ ਵੱਲੋਂ ਪ੍ਰਮਾਣਿਤ (2017)' },
                { en: 'Protection level is confirmed by our technical team for each requirement', hi: 'सुरक्षा स्तर हर ज़रूरत के लिए हमारी तकनीकी टीम कन्फ़र्म करती है', pa: 'ਸੁਰੱਖਿਆ ਪੱਧਰ ਹਰ ਲੋੜ ਲਈ ਸਾਡੀ ਤਕਨੀਕੀ ਟੀਮ ਪੱਕਾ ਕਰਦੀ ਹੈ' }
              ],
              uses: {
                en: 'Banks, cash counters, government buildings, security booths, residences and VIP vehicles.',
                hi: 'बैंक, कैश काउंटर, सरकारी इमारतें, सिक्योरिटी बूथ, निवास और VIP वाहन।',
                pa: 'ਬੈਂਕ, ਕੈਸ਼ ਕਾਊਂਟਰ, ਸਰਕਾਰੀ ਇਮਾਰਤਾਂ, ਸਿਕਿਓਰਿਟੀ ਬੂਥ, ਰਿਹਾਇਸ਼ਾਂ ਅਤੇ VIP ਗੱਡੀਆਂ।'
              },
              page: 'bullet-resistant-glass.html'
            }
          ]
        },
        {
          id: 'insulating',
          label: { en: 'Insulating & Energy-Saving Glass', hi: 'इंसुलेटिंग और ऊर्जा-बचत ग्लास', pa: 'ਇੰਸੂਲੇਟਿੰਗ ਅਤੇ ਊਰਜਾ-ਬਚਤ ਗਲਾਸ' },
          products: [
            {
              id: 'dgu',
              label: { en: 'Insulating Glass (DGU / IGU)', hi: 'इंसुलेटिंग ग्लास (DGU / IGU)', pa: 'ਇੰਸੂਲੇਟਿੰਗ ਗਲਾਸ (DGU / IGU)' },
              summary: {
                en: 'Double or triple glazed units: panes separated by an aluminium spacer with desiccant and hermetically dual-sealed.',
                hi: 'डबल या ट्रिपल ग्लेज़्ड यूनिट: शीशे डेसिकेंट वाले एल्युमिनियम स्पेसर से अलग और डुअल-सील से पूरी तरह बंद।',
                pa: 'ਡਬਲ ਜਾਂ ਟ੍ਰਿਪਲ ਗਲੇਜ਼ਡ ਯੂਨਿਟ: ਸ਼ੀਸ਼ੇ ਡੈਸੀਕੈਂਟ ਵਾਲੇ ਐਲੂਮੀਨੀਅਮ ਸਪੇਸਰ ਨਾਲ ਵੱਖ ਅਤੇ ਡੂਅਲ-ਸੀਲ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬੰਦ।'
              },
              points: [
                { en: 'Reduces heat transfer and air-conditioning load', hi: 'गर्मी का आना-जाना और AC का लोड कम करता है', pa: 'ਗਰਮੀ ਦਾ ਆਉਣਾ-ਜਾਣਾ ਅਤੇ AC ਦਾ ਲੋਡ ਘਟਾਉਂਦਾ ਹੈ' },
                { en: 'Reduces noise, more so with one laminated pane or panes of different thickness', hi: 'शोर कम करता है; एक लैमिनेटेड शीशे या अलग मोटाई के शीशों से और ज़्यादा', pa: 'ਸ਼ੋਰ ਘਟਾਉਂਦਾ ਹੈ; ਇੱਕ ਲੈਮੀਨੇਟਿਡ ਸ਼ੀਸ਼ੇ ਜਾਂ ਵੱਖ ਮੋਟਾਈ ਦੇ ਸ਼ੀਸ਼ਿਆਂ ਨਾਲ ਹੋਰ ਵੀ ਵੱਧ' },
                { en: 'Comfortable room temperature all year', hi: 'पूरे साल कमरे का आरामदायक तापमान', pa: 'ਸਾਰਾ ਸਾਲ ਕਮਰੇ ਦਾ ਆਰਾਮਦਾਇਕ ਤਾਪਮਾਨ' }
              ],
              uses: {
                en: 'Energy-efficient windows, doors, facades, curtain walls and skylights.',
                hi: 'ऊर्जा-कुशल खिड़कियाँ, दरवाज़े, फ़साड, कर्टन वॉल और स्काइलाइट।',
                pa: 'ਊਰਜਾ-ਕੁਸ਼ਲ ਖਿੜਕੀਆਂ, ਦਰਵਾਜ਼ੇ, ਫ਼ਸਾਡ, ਕਰਟਨ ਵਾਲ ਅਤੇ ਸਕਾਈਲਾਈਟ।'
              },
              specs: {
                en: 'Double or triple glazed. Aluminium spacer with moisture-absorbing desiccant; primary polyisobutylene and secondary silicone seal; dry air or gas in the cavity. Glass combination and cavity for your project are confirmed by our team.',
                hi: 'डबल या ट्रिपल ग्लेज़्ड। नमी सोखने वाले डेसिकेंट के साथ एल्युमिनियम स्पेसर; प्राइमरी पॉलीआइसोब्यूटिलीन और सेकेंडरी सिलिकॉन सील; बीच की जगह में सूखी हवा या गैस। आपके प्रोजेक्ट का ग्लास कॉम्बिनेशन हमारी टीम कन्फ़र्म करती है।',
                pa: 'ਡਬਲ ਜਾਂ ਟ੍ਰਿਪਲ ਗਲੇਜ਼ਡ। ਨਮੀ ਸੋਖਣ ਵਾਲੇ ਡੈਸੀਕੈਂਟ ਨਾਲ ਐਲੂਮੀਨੀਅਮ ਸਪੇਸਰ; ਪ੍ਰਾਇਮਰੀ ਪੌਲੀਆਈਸੋਬਿਊਟਾਈਲੀਨ ਅਤੇ ਸੈਕੰਡਰੀ ਸਿਲੀਕਾਨ ਸੀਲ; ਵਿਚਕਾਰ ਸੁੱਕੀ ਹਵਾ ਜਾਂ ਗੈਸ। ਤੁਹਾਡੇ ਪ੍ਰੋਜੈਕਟ ਦਾ ਗਲਾਸ ਕੰਬੀਨੇਸ਼ਨ ਸਾਡੀ ਟੀਮ ਪੱਕਾ ਕਰਦੀ ਹੈ।'
              },
              page: 'insulating-glass.html'
            }
          ]
        },
        {
          id: 'curved',
          label: { en: 'Bent & Curved Glass', hi: 'बेंट और घुमावदार ग्लास', pa: 'ਬੈਂਡ ਅਤੇ ਮੋੜਿਆ ਹੋਇਆ ਗਲਾਸ' },
          products: [
            {
              id: 'bend-toughened',
              label: { en: 'Bend Toughened Glass', hi: 'बेंड टफन्ड ग्लास', pa: 'ਬੈਂਡ ਟਫਨਡ ਗਲਾਸ' },
              summary: {
                en: 'Curved and fully toughened glass, made to the radius your design needs.',
                hi: 'घुमावदार और पूरी तरह टफन्ड ग्लास, आपके डिज़ाइन के रेडियस के अनुसार।',
                pa: 'ਮੋੜਿਆ ਹੋਇਆ ਅਤੇ ਪੂਰੀ ਤਰ੍ਹਾਂ ਟਫਨਡ ਗਲਾਸ, ਤੁਹਾਡੇ ਡਿਜ਼ਾਈਨ ਦੇ ਰੇਡੀਅਸ ਮੁਤਾਬਕ।'
              },
              points: [
                { en: 'Safety of toughened glass with a curved form', hi: 'घुमावदार आकार के साथ टफन्ड ग्लास जैसी सुरक्षा', pa: 'ਮੋੜੇ ਹੋਏ ਆਕਾਰ ਨਾਲ ਟਫਨਡ ਗਲਾਸ ਵਰਗੀ ਸੁਰੱਖਿਆ' },
                { en: 'Several thicknesses and radii; our team confirms for each design', hi: 'कई मोटाई और रेडियस; हर डिज़ाइन के लिए टीम कन्फ़र्म करती है', pa: 'ਕਈ ਮੋਟਾਈਆਂ ਅਤੇ ਰੇਡੀਅਸ; ਹਰ ਡਿਜ਼ਾਈਨ ਲਈ ਟੀਮ ਪੱਕਾ ਕਰਦੀ ਹੈ' }
              ],
              uses: {
                en: 'Curved facades and balustrades, revolving doors, spiral staircases, display counters, corner glazing.',
                hi: 'घुमावदार फ़साड और बालस्ट्रेड, रिवॉल्विंग दरवाज़े, घुमावदार सीढ़ियाँ, डिस्प्ले काउंटर, कॉर्नर ग्लेज़िंग।',
                pa: 'ਮੋੜੇ ਹੋਏ ਫ਼ਸਾਡ ਅਤੇ ਬਾਲਸਟ੍ਰੇਡ, ਰਿਵਾਲਵਿੰਗ ਦਰਵਾਜ਼ੇ, ਘੁਮਾਵਦਾਰ ਪੌੜੀਆਂ, ਡਿਸਪਲੇ ਕਾਊਂਟਰ, ਕਾਰਨਰ ਗਲੇਜ਼ਿੰਗ।'
              },
              page: 'bend-toughened-glass.html'
            },
            {
              id: 'bend-annealed',
              label: { en: 'Bend Annealed Glass', hi: 'बेंड एनील्ड ग्लास', pa: 'ਬੈਂਡ ਐਨੀਲਡ ਗਲਾਸ' },
              summary: {
                en: 'Annealed glass softened and sagged over a mould, then slowly cooled for smooth curves.',
                hi: 'एनील्ड ग्लास को गर्म करके साँचे पर मोड़ा जाता है और फिर धीरे ठंडा किया जाता है, जिससे चिकने घुमाव मिलते हैं।',
                pa: 'ਐਨੀਲਡ ਗਲਾਸ ਨੂੰ ਗਰਮ ਕਰਕੇ ਸਾਂਚੇ ’ਤੇ ਮੋੜਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਫਿਰ ਹੌਲੀ ਠੰਢਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ, ਜਿਸ ਨਾਲ ਨਿਰਵਿਘਨ ਮੋੜ ਮਿਲਦੇ ਹਨ।'
              },
              points: [
                { en: 'Smooth, precise curves', hi: 'चिकने और सटीक घुमाव', pa: 'ਨਿਰਵਿਘਨ ਅਤੇ ਸਹੀ ਮੋੜ' },
                { en: 'Not strengthened: less impact-resistant than toughened or laminated glass', hi: 'मजबूत नहीं किया जाता: टफन्ड या लैमिनेटेड ग्लास से कम झटका सहता है', pa: 'ਮਜ਼ਬੂਤ ਨਹੀਂ ਕੀਤਾ ਜਾਂਦਾ: ਟਫਨਡ ਜਾਂ ਲੈਮੀਨੇਟਿਡ ਗਲਾਸ ਨਾਲੋਂ ਘੱਟ ਝਟਕਾ ਸਹਿੰਦਾ ਹੈ' }
              ],
              uses: {
                en: 'Display windows, interior features and decorative curved elements.',
                hi: 'डिस्प्ले विंडो, इंटीरियर फ़ीचर और सजावटी घुमावदार हिस्से।',
                pa: 'ਡਿਸਪਲੇ ਵਿੰਡੋ, ਅੰਦਰੂਨੀ ਫ਼ੀਚਰ ਅਤੇ ਸਜਾਵਟੀ ਮੋੜੇ ਹੋਏ ਹਿੱਸੇ।'
              },
              page: 'bend-annealed-glass.html'
            },
            {
              id: 'windshields',
              label: { en: 'Windshields & Curved Glass', hi: 'विंडशील्ड और घुमावदार ग्लास', pa: 'ਵਿੰਡਸ਼ੀਲਡ ਅਤੇ ਮੋੜਿਆ ਹੋਇਆ ਗਲਾਸ' },
              summary: {
                en: 'Windshield glass with a PVB interlayer that holds the glass together on impact.',
                hi: 'PVB इंटरलेयर वाला विंडशील्ड ग्लास, जो टक्कर पर ग्लास को जोड़े रखता है।',
                pa: 'PVB ਇੰਟਰਲੇਅਰ ਵਾਲਾ ਵਿੰਡਸ਼ੀਲਡ ਗਲਾਸ, ਜੋ ਟੱਕਰ ’ਤੇ ਗਲਾਸ ਨੂੰ ਜੋੜੀ ਰੱਖਦਾ ਹੈ।'
              },
              points: [
                { en: 'PVB interlayer holds the glass together on impact', hi: 'PVB इंटरलेयर टक्कर पर ग्लास को एक साथ रखती है', pa: 'PVB ਇੰਟਰਲੇਅਰ ਟੱਕਰ ’ਤੇ ਗਲਾਸ ਨੂੰ ਇਕੱਠਾ ਰੱਖਦੀ ਹੈ' }
              ],
              uses: {
                en: 'Vehicle windshields and curved glazing.',
                hi: 'वाहनों की विंडशील्ड और घुमावदार ग्लेज़िंग।',
                pa: 'ਗੱਡੀਆਂ ਦੀ ਵਿੰਡਸ਼ੀਲਡ ਅਤੇ ਮੋੜੀ ਹੋਈ ਗਲੇਜ਼ਿੰਗ।'
              },
              page: 'windshields-glass.html'
            }
          ]
        },
        {
          id: 'decorative',
          label: { en: 'Decorative Glass', hi: 'डेकोरेटिव ग्लास', pa: 'ਸਜਾਵਟੀ ਗਲਾਸ' },
          products: [
            {
              id: 'ceramic-printed',
              label: { en: 'Ceramic Printed Glass', hi: 'सिरेमिक प्रिंटेड ग्लास', pa: 'ਸਿਰੈਮਿਕ ਪ੍ਰਿੰਟਿਡ ਗਲਾਸ' },
              summary: {
                en: 'Ceramic frit (enamel) fused permanently into the glass during toughening.',
                hi: 'टफनिंग के दौरान ग्लास में स्थायी रूप से जोड़ा गया सिरेमिक फ्रिट (इनेमल)।',
                pa: 'ਟਫਨਿੰਗ ਦੌਰਾਨ ਗਲਾਸ ਵਿੱਚ ਪੱਕੇ ਤੌਰ ’ਤੇ ਜੋੜਿਆ ਸਿਰੈਮਿਕ ਫ੍ਰਿਟ (ਇਨੈਮਲ)।'
              },
              points: [
                { en: 'Permanent, weather-resistant and UV-stable patterns', hi: 'स्थायी, मौसम-रोधी और UV-स्थिर डिज़ाइन', pa: 'ਪੱਕੇ, ਮੌਸਮ-ਰੋਧੀ ਅਤੇ UV-ਸਥਿਰ ਡਿਜ਼ਾਈਨ' },
                { en: 'Dots, lines, checks or custom designs', hi: 'डॉट्स, लाइनें, चेक या कस्टम डिज़ाइन', pa: 'ਡੌਟਸ, ਲਾਈਨਾਂ, ਚੈੱਕ ਜਾਂ ਕਸਟਮ ਡਿਜ਼ਾਈਨ' }
              ],
              uses: {
                en: 'Facade spandrels, solar shading, privacy screens, partitions and wall cladding.',
                hi: 'फ़साड स्पैंड्रल, सोलर शेडिंग, प्राइवेसी स्क्रीन, पार्टीशन और वॉल क्लैडिंग।',
                pa: 'ਫ਼ਸਾਡ ਸਪੈਂਡਰਲ, ਸੋਲਰ ਸ਼ੇਡਿੰਗ, ਪ੍ਰਾਈਵੇਸੀ ਸਕ੍ਰੀਨ, ਪਾਰਟੀਸ਼ਨ ਅਤੇ ਵਾਲ ਕਲੈਡਿੰਗ।'
              },
              page: 'ceramic-printed-glass.html'
            },
            {
              id: 'designer',
              label: { en: 'Designer Glass', hi: 'डिज़ाइनर ग्लास', pa: 'ਡਿਜ਼ਾਈਨਰ ਗਲਾਸ' },
              summary: {
                en: 'Decorative glass with patterns, textures, colours and finishes, including frosted, acid-etched and sandblasted looks.',
                hi: 'पैटर्न, टेक्सचर, रंग और फ़िनिश वाला सजावटी ग्लास, जिसमें फ्रॉस्टेड, एसिड-एच्ड और सैंडब्लास्टेड लुक शामिल हैं।',
                pa: 'ਪੈਟਰਨ, ਟੈਕਸਚਰ, ਰੰਗ ਅਤੇ ਫ਼ਿਨਿਸ਼ ਵਾਲਾ ਸਜਾਵਟੀ ਗਲਾਸ, ਜਿਸ ਵਿੱਚ ਫ੍ਰੋਸਟਡ, ਐਸਿਡ-ਐਚਡ ਅਤੇ ਸੈਂਡਬਲਾਸਟਡ ਲੁੱਕ ਸ਼ਾਮਲ ਹਨ।'
              },
              points: [
                { en: 'Lets light through while giving privacy', hi: 'रोशनी आने देता है और प्राइवेसी भी देता है', pa: 'ਰੋਸ਼ਨੀ ਆਉਣ ਦਿੰਦਾ ਹੈ ਅਤੇ ਪ੍ਰਾਈਵੇਸੀ ਵੀ ਦਿੰਦਾ ਹੈ' }
              ],
              uses: {
                en: 'Interior partitions, doors, shower enclosures, feature walls, office cubicles and furniture.',
                hi: 'इंटीरियर पार्टीशन, दरवाज़े, शावर एनक्लोज़र, फ़ीचर वॉल, ऑफ़िस क्यूबिकल और फ़र्नीचर।',
                pa: 'ਅੰਦਰੂਨੀ ਪਾਰਟੀਸ਼ਨ, ਦਰਵਾਜ਼ੇ, ਸ਼ਾਵਰ ਐਨਕਲੋਜ਼ਰ, ਫ਼ੀਚਰ ਵਾਲ, ਦਫ਼ਤਰ ਕਿਊਬੀਕਲ ਅਤੇ ਫ਼ਰਨੀਚਰ।'
              },
              page: 'designer-glass.html'
            }
          ]
        },
        {
          id: 'hardware',
          label: { en: 'Glass Hardware & Fittings', hi: 'ग्लास हार्डवेयर और फिटिंग्स', pa: 'ਗਲਾਸ ਹਾਰਡਵੇਅਰ ਅਤੇ ਫਿਟਿੰਗਜ਼' },
          products: [
            {
              id: 'hardware',
              label: { en: 'Glass Hardware & Fittings', hi: 'ग्लास हार्डवेयर और फिटिंग्स', pa: 'ਗਲਾਸ ਹਾਰਡਵੇਅਰ ਅਤੇ ਫਿਟਿੰਗਜ਼' },
              summary: {
                en: 'Stainless steel patch fittings, spider fittings, floor springs, handles and connectors.',
                hi: 'स्टेनलेस स्टील पैच फिटिंग्स, स्पाइडर फिटिंग्स, फ़्लोर स्प्रिंग, हैंडल और कनेक्टर।',
                pa: 'ਸਟੇਨਲੈੱਸ ਸਟੀਲ ਪੈਚ ਫਿਟਿੰਗਜ਼, ਸਪਾਈਡਰ ਫਿਟਿੰਗਜ਼, ਫ਼ਲੋਰ ਸਪ੍ਰਿੰਗ, ਹੈਂਡਲ ਅਤੇ ਕਨੈਕਟਰ।'
              },
              points: [
                { en: 'For frameless glass doors and point-supported glazing', hi: 'फ़्रेमलेस ग्लास दरवाज़ों और पॉइंट-सपोर्टेड ग्लेज़िंग के लिए', pa: 'ਫ਼ਰੇਮਲੈੱਸ ਗਲਾਸ ਦਰਵਾਜ਼ਿਆਂ ਅਤੇ ਪੁਆਇੰਟ-ਸਪੋਰਟਡ ਗਲੇਜ਼ਿੰਗ ਲਈ' },
                { en: 'Hole drilling for patch and spider fittings is done in-house', hi: 'पैच और स्पाइडर फिटिंग के लिए होल ड्रिलिंग प्लांट में ही होती है', pa: 'ਪੈਚ ਅਤੇ ਸਪਾਈਡਰ ਫਿਟਿੰਗ ਲਈ ਹੋਲ ਡ੍ਰਿਲਿੰਗ ਪਲਾਂਟ ਵਿੱਚ ਹੀ ਹੁੰਦੀ ਹੈ' }
              ],
              uses: {
                en: 'Frameless doors, glass entrances, spider and patch-fitted glazing.',
                hi: 'फ़्रेमलेस दरवाज़े, ग्लास एंट्रेंस, स्पाइडर और पैच-फिटेड ग्लेज़िंग।',
                pa: 'ਫ਼ਰੇਮਲੈੱਸ ਦਰਵਾਜ਼ੇ, ਗਲਾਸ ਐਂਟਰੈਂਸ, ਸਪਾਈਡਰ ਅਤੇ ਪੈਚ-ਫਿੱਟ ਗਲੇਜ਼ਿੰਗ।'
              },
              page: 'hardware-glass.html',
              ask: ['quantity', 'specifications', 'deliveryLocation'],
              hints: {
                quantity: { en: 'e.g. 4 door sets, 30 spider fittings', hi: 'जैसे 4 डोर सेट, 30 स्पाइडर फिटिंग', pa: 'ਜਿਵੇਂ 4 ਡੋਰ ਸੈੱਟ, 30 ਸਪਾਈਡਰ ਫਿਟਿੰਗ' },
                specifications: { en: 'e.g. patch fittings for 12 mm glass door', hi: 'जैसे 12 mm ग्लास डोर के लिए पैच फिटिंग', pa: 'ਜਿਵੇਂ 12 mm ਗਲਾਸ ਡੋਰ ਲਈ ਪੈਚ ਫਿਟਿੰਗ' }
              }
            }
          ]
        }
      ]
    },

    /* ============================================================ ALUMINIUM */
    {
      id: 'aluminium',
      icon: 'aluminium',
      label: { en: 'Aluminium Systems', hi: 'एल्युमिनियम सिस्टम', pa: 'ਐਲੂਮੀਨੀਅਮ ਸਿਸਟਮ' },
      intro: {
        en: 'Windows, doors and facade systems in 6063-T6 architectural aluminium, with glass from our own glass division.',
        hi: '6063-T6 आर्किटेक्चरल एल्युमिनियम की खिड़कियाँ, दरवाज़े और फ़साड सिस्टम, हमारे अपने ग्लास डिवीज़न के ग्लास के साथ।',
        pa: '6063-T6 ਆਰਕੀਟੈਕਚਰਲ ਐਲੂਮੀਨੀਅਮ ਦੀਆਂ ਖਿੜਕੀਆਂ, ਦਰਵਾਜ਼ੇ ਅਤੇ ਫ਼ਸਾਡ ਸਿਸਟਮ, ਸਾਡੇ ਆਪਣੇ ਗਲਾਸ ਡਿਵੀਜ਼ਨ ਦੇ ਗਲਾਸ ਨਾਲ।'
      },
      page: 'aluminium-systems.html',
      common: {
        en: 'All systems: 6063-T6 alloy, wind-deflection tested; EPDM gaskets and brush seals; stainless steel multi-point locks. Finishes: anodising, powder coating and wood-grain textures.',
        hi: 'सभी सिस्टम: 6063-T6 एलॉय, विंड-डिफ़्लेक्शन टेस्टेड; EPDM गैस्केट और ब्रश सील; स्टेनलेस स्टील मल्टी-पॉइंट लॉक। फ़िनिश: एनोडाइज़िंग, पाउडर कोटिंग और वुड-ग्रेन टेक्सचर।',
        pa: 'ਸਾਰੇ ਸਿਸਟਮ: 6063-T6 ਐਲੌਏ, ਵਿੰਡ-ਡਿਫ਼ਲੈਕਸ਼ਨ ਟੈਸਟਡ; EPDM ਗੈਸਕੇਟ ਅਤੇ ਬ੍ਰਸ਼ ਸੀਲ; ਸਟੇਨਲੈੱਸ ਸਟੀਲ ਮਲਟੀ-ਪੁਆਇੰਟ ਲੌਕ। ਫ਼ਿਨਿਸ਼: ਐਨੋਡਾਈਜ਼ਿੰਗ, ਪਾਊਡਰ ਕੋਟਿੰਗ ਅਤੇ ਵੁੱਡ-ਗ੍ਰੇਨ ਟੈਕਸਚਰ।'
      },
      ask: ['quantity', 'specifications', 'deliveryLocation', 'timeline'],
      hints: {
        quantity: { en: 'e.g. 8 windows and 2 doors', hi: 'जैसे 8 खिड़कियाँ और 2 दरवाज़े', pa: 'ਜਿਵੇਂ 8 ਖਿੜਕੀਆਂ ਅਤੇ 2 ਦਰਵਾਜ਼ੇ' },
        specifications: { en: 'e.g. 5 ft × 4 ft, black powder coat, DGU glass', hi: 'जैसे 5 फुट × 4 फुट, ब्लैक पाउडर कोट, DGU ग्लास', pa: 'ਜਿਵੇਂ 5 ਫੁੱਟ × 4 ਫੁੱਟ, ਬਲੈਕ ਪਾਊਡਰ ਕੋਟ, DGU ਗਲਾਸ' }
      },
      subcategories: [
        {
          id: 'al-windows',
          label: { en: 'Windows', hi: 'खिड़कियाँ', pa: 'ਖਿੜਕੀਆਂ' },
          products: [
            {
              id: 'al-sliding-windows',
              label: { en: 'Sliding Windows', hi: 'स्लाइडिंग खिड़कियाँ', pa: 'ਸਲਾਈਡਿੰਗ ਖਿੜਕੀਆਂ' },
              summary: {
                en: '2-, 3- and 4-track aluminium sliding windows, with an option for stainless steel 304 mosquito mesh.',
                hi: '2, 3 और 4 ट्रैक एल्युमिनियम स्लाइडिंग खिड़कियाँ, स्टेनलेस स्टील 304 मच्छरदानी के विकल्प के साथ।',
                pa: '2, 3 ਅਤੇ 4 ਟ੍ਰੈਕ ਐਲੂਮੀਨੀਅਮ ਸਲਾਈਡਿੰਗ ਖਿੜਕੀਆਂ, ਸਟੇਨਲੈੱਸ ਸਟੀਲ 304 ਮੱਛਰਦਾਨੀ ਦੇ ਵਿਕਲਪ ਨਾਲ।'
              },
              points: [
                { en: '3-track: wider opening with a dedicated mesh track', hi: '3 ट्रैक: ज़्यादा खुलाव और अलग मेश ट्रैक', pa: '3 ਟ੍ਰੈਕ: ਵੱਧ ਖੁੱਲ੍ਹ ਅਤੇ ਵੱਖਰਾ ਮੈਸ਼ ਟ੍ਰੈਕ' },
                { en: '4-track: large openings, centre-parting or stacking', hi: '4 ट्रैक: बड़े खुलाव, बीच से या एक तरफ़ खुलने वाले', pa: '4 ਟ੍ਰੈਕ: ਵੱਡੀ ਖੁੱਲ੍ਹ, ਵਿਚਕਾਰੋਂ ਜਾਂ ਇੱਕ ਪਾਸੇ ਖੁੱਲ੍ਹਣ ਵਾਲੀਆਂ' },
                { en: 'Silent tandem rollers', hi: 'बिना आवाज़ वाले टैंडम रोलर', pa: 'ਬਿਨਾਂ ਆਵਾਜ਼ ਵਾਲੇ ਟੈਂਡਮ ਰੋਲਰ' }
              ],
              uses: { en: 'Homes, offices and commercial buildings.', hi: 'घर, ऑफ़िस और कमर्शियल इमारतें।', pa: 'ਘਰ, ਦਫ਼ਤਰ ਅਤੇ ਕਮਰਸ਼ੀਅਲ ਇਮਾਰਤਾਂ।' },
              page: 'aluminium-systems.html'
            },
            {
              id: 'al-casement-windows',
              label: { en: 'Casement & Tilt-Turn Windows', hi: 'केसमेंट और टिल्ट-टर्न खिड़कियाँ', pa: 'ਕੇਸਮੈਂਟ ਅਤੇ ਟਿਲਟ-ਟਰਨ ਖਿੜਕੀਆਂ' },
              summary: {
                en: 'Single and double casement (no fixed centre mullion), side-hung, top-hung (awning) and tilt-and-turn windows.',
                hi: 'सिंगल और डबल केसमेंट (बीच में कोई फ़िक्स्ड म्युलियन नहीं), साइड-हंग, टॉप-हंग (ऑनिंग) और टिल्ट-एंड-टर्न खिड़कियाँ।',
                pa: 'ਸਿੰਗਲ ਅਤੇ ਡਬਲ ਕੇਸਮੈਂਟ (ਵਿਚਕਾਰ ਕੋਈ ਫ਼ਿਕਸਡ ਮਿਊਲੀਅਨ ਨਹੀਂ), ਸਾਈਡ-ਹੰਗ, ਟੌਪ-ਹੰਗ (ਔਨਿੰਗ) ਅਤੇ ਟਿਲਟ-ਐਂਡ-ਟਰਨ ਖਿੜਕੀਆਂ।'
              },
              points: [
                { en: 'Friction stays and multi-point locks', hi: 'फ़्रिक्शन स्टे और मल्टी-पॉइंट लॉक', pa: 'ਫ਼੍ਰਿਕਸ਼ਨ ਸਟੇ ਅਤੇ ਮਲਟੀ-ਪੁਆਇੰਟ ਲੌਕ' },
                { en: 'Double or triple EPDM gaskets against rain, air and noise', hi: 'बारिश, हवा और शोर से बचाव के लिए डबल या ट्रिपल EPDM गैस्केट', pa: 'ਮੀਂਹ, ਹਵਾ ਅਤੇ ਸ਼ੋਰ ਤੋਂ ਬਚਾਅ ਲਈ ਡਬਲ ਜਾਂ ਟ੍ਰਿਪਲ EPDM ਗੈਸਕੇਟ' }
              ],
              uses: { en: 'Homes and offices where full opening and tight sealing are needed.', hi: 'घर और ऑफ़िस जहाँ पूरा खुलाव और कसकर सीलिंग चाहिए।', pa: 'ਘਰ ਅਤੇ ਦਫ਼ਤਰ ਜਿੱਥੇ ਪੂਰੀ ਖੁੱਲ੍ਹ ਅਤੇ ਕਸਵੀਂ ਸੀਲਿੰਗ ਚਾਹੀਦੀ ਹੈ।' },
              page: 'aluminium-systems.html'
            },
            {
              id: 'al-fixed-windows',
              label: { en: 'Fixed, Louvre & Bay Windows', hi: 'फ़िक्स्ड, लूवर और बे खिड़कियाँ', pa: 'ਫ਼ਿਕਸਡ, ਲੂਵਰ ਅਤੇ ਬੇ ਖਿੜਕੀਆਂ' },
              summary: {
                en: 'Fixed glass windows, ventilators, louvre windows (fixed or adjustable blades) and bay / corner windows (90° to 135°).',
                hi: 'फ़िक्स्ड ग्लास खिड़कियाँ, वेंटिलेटर, लूवर खिड़कियाँ (फ़िक्स्ड या एडजस्टेबल ब्लेड) और बे / कॉर्नर खिड़कियाँ (90° से 135°)।',
                pa: 'ਫ਼ਿਕਸਡ ਗਲਾਸ ਖਿੜਕੀਆਂ, ਵੈਂਟੀਲੇਟਰ, ਲੂਵਰ ਖਿੜਕੀਆਂ (ਫ਼ਿਕਸਡ ਜਾਂ ਐਡਜਸਟੇਬਲ ਬਲੇਡ) ਅਤੇ ਬੇ / ਕਾਰਨਰ ਖਿੜਕੀਆਂ (90° ਤੋਂ 135°)।'
              },
              points: [
                { en: 'Fixed windows take glass up to 28 mm (suits DGU)', hi: 'फ़िक्स्ड खिड़कियों में 28 mm तक का ग्लास (DGU के लिए उपयुक्त)', pa: 'ਫ਼ਿਕਸਡ ਖਿੜਕੀਆਂ ਵਿੱਚ 28 mm ਤੱਕ ਦਾ ਗਲਾਸ (DGU ਲਈ ਢੁਕਵਾਂ)' }
              ],
              uses: { en: 'Large views, ventilation and corner designs.', hi: 'बड़े व्यू, वेंटिलेशन और कॉर्नर डिज़ाइन।', pa: 'ਵੱਡੇ ਵਿਊ, ਹਵਾਦਾਰੀ ਅਤੇ ਕਾਰਨਰ ਡਿਜ਼ਾਈਨ।' },
              specs: {
                en: 'Fixed glass windows have a glass pocket of up to **28 mm**, which suits DGU. Bay and corner windows from 90° to 135°.',
                hi: 'फ़िक्स्ड ग्लास खिड़कियों में **28 mm** तक का ग्लास पॉकेट है, जो DGU के लिए उपयुक्त है। बे और कॉर्नर खिड़कियाँ 90° से 135° तक।',
                pa: 'ਫ਼ਿਕਸਡ ਗਲਾਸ ਖਿੜਕੀਆਂ ਵਿੱਚ **28 mm** ਤੱਕ ਦਾ ਗਲਾਸ ਪੌਕੇਟ ਹੈ, ਜੋ DGU ਲਈ ਢੁਕਵਾਂ ਹੈ। ਬੇ ਅਤੇ ਕਾਰਨਰ ਖਿੜਕੀਆਂ 90° ਤੋਂ 135° ਤੱਕ।'
              },
              page: 'aluminium-systems.html'
            }
          ]
        },
        {
          id: 'al-doors',
          label: { en: 'Doors', hi: 'दरवाज़े', pa: 'ਦਰਵਾਜ਼ੇ' },
          products: [
            {
              id: 'al-sliding-doors',
              label: { en: 'Sliding & Lift-and-Slide Doors', hi: 'स्लाइडिंग और लिफ़्ट-एंड-स्लाइड दरवाज़े', pa: 'ਸਲਾਈਡਿੰਗ ਅਤੇ ਲਿਫ਼ਟ-ਐਂਡ-ਸਲਾਈਡ ਦਰਵਾਜ਼ੇ' },
              summary: {
                en: '2-, 3- and 4-track sliding doors, lift-and-slide doors and sliding doors with mosquito mesh.',
                hi: '2, 3 और 4 ट्रैक स्लाइडिंग दरवाज़े, लिफ़्ट-एंड-स्लाइड दरवाज़े और मच्छरदानी वाले स्लाइडिंग दरवाज़े।',
                pa: '2, 3 ਅਤੇ 4 ਟ੍ਰੈਕ ਸਲਾਈਡਿੰਗ ਦਰਵਾਜ਼ੇ, ਲਿਫ਼ਟ-ਐਂਡ-ਸਲਾਈਡ ਦਰਵਾਜ਼ੇ ਅਤੇ ਮੱਛਰਦਾਨੀ ਵਾਲੇ ਸਲਾਈਡਿੰਗ ਦਰਵਾਜ਼ੇ।'
              },
              points: [
                { en: 'Lift-and-slide sashes up to 400 kg', hi: 'लिफ़्ट-एंड-स्लाइड सैश 400 kg तक', pa: 'ਲਿਫ਼ਟ-ਐਂਡ-ਸਲਾਈਡ ਸੈਸ਼ 400 kg ਤੱਕ' }
              ],
              uses: { en: 'Balconies, patios and large openings.', hi: 'बालकनी, पैटियो और बड़े खुलाव।', pa: 'ਬਾਲਕਨੀ, ਪੈਟੀਓ ਅਤੇ ਵੱਡੀਆਂ ਖੁੱਲ੍ਹਾਂ।' },
              specs: {
                en: 'Lift-and-slide door sashes up to **400 kg**. 2-, 3- and 4-track options.',
                hi: 'लिफ़्ट-एंड-स्लाइड दरवाज़े के सैश **400 kg** तक। 2, 3 और 4 ट्रैक विकल्प।',
                pa: 'ਲਿਫ਼ਟ-ਐਂਡ-ਸਲਾਈਡ ਦਰਵਾਜ਼ੇ ਦੇ ਸੈਸ਼ **400 kg** ਤੱਕ। 2, 3 ਅਤੇ 4 ਟ੍ਰੈਕ ਵਿਕਲਪ।'
              },
              page: 'aluminium-systems.html'
            },
            {
              id: 'al-hinged-doors',
              label: { en: 'Hinged, French & Entrance Doors', hi: 'हिंज्ड, फ़्रेंच और एंट्रेंस दरवाज़े', pa: 'ਹਿੰਜਡ, ਫ਼੍ਰੈਂਚ ਅਤੇ ਐਂਟਰੈਂਸ ਦਰਵਾਜ਼ੇ' },
              summary: {
                en: 'Single and double hinged doors, French doors, glass entrance and shopfront doors, and office doors with acoustic drop seals.',
                hi: 'सिंगल और डबल हिंज्ड दरवाज़े, फ़्रेंच दरवाज़े, ग्लास एंट्रेंस और शॉपफ़्रंट दरवाज़े, और एकॉस्टिक ड्रॉप सील वाले ऑफ़िस दरवाज़े।',
                pa: 'ਸਿੰਗਲ ਅਤੇ ਡਬਲ ਹਿੰਜਡ ਦਰਵਾਜ਼ੇ, ਫ਼੍ਰੈਂਚ ਦਰਵਾਜ਼ੇ, ਗਲਾਸ ਐਂਟਰੈਂਸ ਅਤੇ ਸ਼ੌਪਫ਼੍ਰੰਟ ਦਰਵਾਜ਼ੇ, ਅਤੇ ਐਕੋਸਟਿਕ ਡ੍ਰੌਪ ਸੀਲ ਵਾਲੇ ਦਫ਼ਤਰ ਦਰਵਾਜ਼ੇ।'
              },
              points: [
                { en: 'Glass entrance doors with floor spring or overhead closer', hi: 'फ़्लोर स्प्रिंग या ओवरहेड क्लोज़र वाले ग्लास एंट्रेंस दरवाज़े', pa: 'ਫ਼ਲੋਰ ਸਪ੍ਰਿੰਗ ਜਾਂ ਓਵਰਹੈੱਡ ਕਲੋਜ਼ਰ ਵਾਲੇ ਗਲਾਸ ਐਂਟਰੈਂਸ ਦਰਵਾਜ਼ੇ' }
              ],
              uses: { en: 'Homes, shops and offices.', hi: 'घर, दुकानें और ऑफ़िस।', pa: 'ਘਰ, ਦੁਕਾਨਾਂ ਅਤੇ ਦਫ਼ਤਰ।' },
              page: 'aluminium-systems.html'
            },
            {
              id: 'al-bifold-doors',
              label: { en: 'Bi-Fold & Automatic Doors', hi: 'बाई-फ़ोल्ड और ऑटोमैटिक दरवाज़े', pa: 'ਬਾਈ-ਫ਼ੋਲਡ ਅਤੇ ਆਟੋਮੈਟਿਕ ਦਰਵਾਜ਼ੇ' },
              summary: {
                en: 'Folding / bi-fold doors with 3 to 7 leaves, and automatic sliding doors with a radar sensor and emergency battery backup.',
                hi: '3 से 7 पल्लों वाले फ़ोल्डिंग / बाई-फ़ोल्ड दरवाज़े, और रडार सेंसर व इमरजेंसी बैटरी बैकअप वाले ऑटोमैटिक स्लाइडिंग दरवाज़े।',
                pa: '3 ਤੋਂ 7 ਪੱਲਿਆਂ ਵਾਲੇ ਫ਼ੋਲਡਿੰਗ / ਬਾਈ-ਫ਼ੋਲਡ ਦਰਵਾਜ਼ੇ, ਅਤੇ ਰਡਾਰ ਸੈਂਸਰ ਤੇ ਐਮਰਜੈਂਸੀ ਬੈਟਰੀ ਬੈਕਅੱਪ ਵਾਲੇ ਆਟੋਮੈਟਿਕ ਸਲਾਈਡਿੰਗ ਦਰਵਾਜ਼ੇ।'
              },
              points: [
                { en: 'Bi-fold: 3 to 7 leaves', hi: 'बाई-फ़ोल्ड: 3 से 7 पल्ले', pa: 'ਬਾਈ-ਫ਼ੋਲਡ: 3 ਤੋਂ 7 ਪੱਲੇ' },
                { en: 'Automatic doors keep working on battery backup in an emergency', hi: 'ऑटोमैटिक दरवाज़े इमरजेंसी में बैटरी बैकअप पर चलते हैं', pa: 'ਆਟੋਮੈਟਿਕ ਦਰਵਾਜ਼ੇ ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਬੈਟਰੀ ਬੈਕਅੱਪ ’ਤੇ ਚੱਲਦੇ ਹਨ' }
              ],
              uses: { en: 'Wide openings, showrooms, malls and offices.', hi: 'चौड़े खुलाव, शोरूम, मॉल और ऑफ़िस।', pa: 'ਚੌੜੀਆਂ ਖੁੱਲ੍ਹਾਂ, ਸ਼ੋਅਰੂਮ, ਮਾਲ ਅਤੇ ਦਫ਼ਤਰ।' },
              page: 'aluminium-systems.html'
            }
          ]
        },
        {
          id: 'al-facades',
          label: { en: 'Facades & Partitions', hi: 'फ़साड और पार्टीशन', pa: 'ਫ਼ਸਾਡ ਅਤੇ ਪਾਰਟੀਸ਼ਨ' },
          products: [
            {
              id: 'al-curtain-walls',
              label: { en: 'Curtain Walls & Structural Glazing', hi: 'कर्टन वॉल और स्ट्रक्चरल ग्लेज़िंग', pa: 'ਕਰਟਨ ਵਾਲ ਅਤੇ ਸਟ੍ਰਕਚਰਲ ਗਲੇਜ਼ਿੰਗ' },
              summary: {
                en: 'Stick and semi-unitised curtain walls, and two- or four-sided structural silicone glazing.',
                hi: 'स्टिक और सेमी-यूनिटाइज़्ड कर्टन वॉल, और दो या चार तरफ़ा स्ट्रक्चरल सिलिकॉन ग्लेज़िंग।',
                pa: 'ਸਟਿਕ ਅਤੇ ਸੈਮੀ-ਯੂਨਿਟਾਈਜ਼ਡ ਕਰਟਨ ਵਾਲ, ਅਤੇ ਦੋ ਜਾਂ ਚਾਰ ਪਾਸੀ ਸਟ੍ਰਕਚਰਲ ਸਿਲੀਕਾਨ ਗਲੇਜ਼ਿੰਗ।'
              },
              points: [
                { en: '50 mm / 60 mm mullions and transoms', hi: '50 mm / 60 mm म्युलियन और ट्रांसम', pa: '50 mm / 60 mm ਮਿਊਲੀਅਨ ਅਤੇ ਟ੍ਰਾਂਸਮ' },
                { en: 'Glass and aluminium from one source', hi: 'ग्लास और एल्युमिनियम एक ही जगह से', pa: 'ਗਲਾਸ ਅਤੇ ਐਲੂਮੀਨੀਅਮ ਇੱਕੋ ਥਾਂ ਤੋਂ' }
              ],
              uses: { en: 'Commercial buildings, malls, hotels and institutions.', hi: 'कमर्शियल इमारतें, मॉल, होटल और संस्थान।', pa: 'ਕਮਰਸ਼ੀਅਲ ਇਮਾਰਤਾਂ, ਮਾਲ, ਹੋਟਲ ਅਤੇ ਸੰਸਥਾਵਾਂ।' },
              specs: {
                en: 'Stick and semi-unitised curtain walls with **50 mm / 60 mm** mullions and transoms; structural glazing with two-sided or four-sided structural silicone. Design and wind-load checks for your building are done by our technical team.',
                hi: '**50 mm / 60 mm** म्युलियन और ट्रांसम के साथ स्टिक और सेमी-यूनिटाइज़्ड कर्टन वॉल; दो या चार तरफ़ा स्ट्रक्चरल सिलिकॉन ग्लेज़िंग। आपकी इमारत का डिज़ाइन और विंड-लोड चेक हमारी तकनीकी टीम करती है।',
                pa: '**50 mm / 60 mm** ਮਿਊਲੀਅਨ ਅਤੇ ਟ੍ਰਾਂਸਮ ਨਾਲ ਸਟਿਕ ਅਤੇ ਸੈਮੀ-ਯੂਨਿਟਾਈਜ਼ਡ ਕਰਟਨ ਵਾਲ; ਦੋ ਜਾਂ ਚਾਰ ਪਾਸੀ ਸਟ੍ਰਕਚਰਲ ਸਿਲੀਕਾਨ ਗਲੇਜ਼ਿੰਗ। ਤੁਹਾਡੀ ਇਮਾਰਤ ਦਾ ਡਿਜ਼ਾਈਨ ਅਤੇ ਵਿੰਡ-ਲੋਡ ਚੈੱਕ ਸਾਡੀ ਤਕਨੀਕੀ ਟੀਮ ਕਰਦੀ ਹੈ।'
              },
              page: 'aluminium-systems.html',
              hints: {
                quantity: { en: 'e.g. approx. 3,000 sq ft of facade', hi: 'जैसे लगभग 3,000 वर्ग फुट फ़साड', pa: 'ਜਿਵੇਂ ਲਗਭਗ 3,000 ਵਰਗ ਫੁੱਟ ਫ਼ਸਾਡ' }
              }
            },
            {
              id: 'al-shopfronts',
              label: { en: 'Shopfront Systems', hi: 'शॉपफ़्रंट सिस्टम', pa: 'ਸ਼ੌਪਫ਼੍ਰੰਟ ਸਿਸਟਮ' },
              summary: {
                en: 'Commercial shopfront systems with a 100 mm profile depth, compatible with DGU.',
                hi: '100 mm प्रोफ़ाइल डेप्थ वाले कमर्शियल शॉपफ़्रंट सिस्टम, DGU के अनुकूल।',
                pa: '100 mm ਪ੍ਰੋਫ਼ਾਈਲ ਡੈਪਥ ਵਾਲੇ ਕਮਰਸ਼ੀਅਲ ਸ਼ੌਪਫ਼੍ਰੰਟ ਸਿਸਟਮ, DGU ਦੇ ਅਨੁਕੂਲ।'
              },
              points: [{ en: '100 mm profile depth, DGU compatible', hi: '100 mm प्रोफ़ाइल डेप्थ, DGU के अनुकूल', pa: '100 mm ਪ੍ਰੋਫ਼ਾਈਲ ਡੈਪਥ, DGU ਦੇ ਅਨੁਕੂਲ' }],
              uses: { en: 'Shops, showrooms and commercial frontages.', hi: 'दुकानें, शोरूम और कमर्शियल फ़्रंट।', pa: 'ਦੁਕਾਨਾਂ, ਸ਼ੋਅਰੂਮ ਅਤੇ ਕਮਰਸ਼ੀਅਲ ਫ਼੍ਰੰਟ।' },
              page: 'aluminium-systems.html'
            },
            {
              id: 'al-partitions',
              label: { en: 'Office Glass Partitions', hi: 'ऑफ़िस ग्लास पार्टीशन', pa: 'ਦਫ਼ਤਰ ਗਲਾਸ ਪਾਰਟੀਸ਼ਨ' },
              summary: {
                en: 'Single or double glazed office partitions, with a micro-blinds option.',
                hi: 'सिंगल या डबल ग्लेज़्ड ऑफ़िस पार्टीशन, माइक्रो-ब्लाइंड्स विकल्प के साथ।',
                pa: 'ਸਿੰਗਲ ਜਾਂ ਡਬਲ ਗਲੇਜ਼ਡ ਦਫ਼ਤਰ ਪਾਰਟੀਸ਼ਨ, ਮਾਈਕ੍ਰੋ-ਬਲਾਈਂਡਜ਼ ਵਿਕਲਪ ਨਾਲ।'
              },
              points: [{ en: 'Single or double glazed; micro-blinds option', hi: 'सिंगल या डबल ग्लेज़्ड; माइक्रो-ब्लाइंड्स विकल्प', pa: 'ਸਿੰਗਲ ਜਾਂ ਡਬਲ ਗਲੇਜ਼ਡ; ਮਾਈਕ੍ਰੋ-ਬਲਾਈਂਡਜ਼ ਵਿਕਲਪ' }],
              uses: { en: 'Offices, cabins, meeting rooms and dividers.', hi: 'ऑफ़िस, केबिन, मीटिंग रूम और डिवाइडर।', pa: 'ਦਫ਼ਤਰ, ਕੈਬਿਨ, ਮੀਟਿੰਗ ਰੂਮ ਅਤੇ ਡਿਵਾਈਡਰ।' },
              page: 'aluminium-systems.html'
            }
          ]
        }
      ]
    },

    /* ================================================================= uPVC */
    {
      id: 'upvc',
      icon: 'upvc',
      label: { en: 'uPVC Systems (JK WINDOORS)', hi: 'uPVC सिस्टम (JK WINDOORS)', pa: 'uPVC ਸਿਸਟਮ (JK WINDOORS)' },
      intro: {
        en: 'JK WINDOORS uPVC windows and doors, in collaboration with the profine group of Germany (KÖMMERLING profiles).',
        hi: 'JK WINDOORS uPVC खिड़कियाँ और दरवाज़े, जर्मनी के profine group (KÖMMERLING प्रोफ़ाइल) के सहयोग से।',
        pa: 'JK WINDOORS uPVC ਖਿੜਕੀਆਂ ਅਤੇ ਦਰਵਾਜ਼ੇ, ਜਰਮਨੀ ਦੇ profine group (KÖMMERLING ਪ੍ਰੋਫ਼ਾਈਲ) ਦੇ ਸਹਿਯੋਗ ਨਾਲ।'
      },
      page: 'upvc-systems.html',
      common: {
        en: 'Multi-chamber profiles with galvanised steel reinforcement, fusion-welded corners and multi-point locking. Up to 30–40 dB noise reduction with DGU glass and up to 30% thermal energy savings. Termite-proof, rot-free, lead-free and UV-stabilised.',
        hi: 'गैल्वनाइज़्ड स्टील रीइन्फ़ोर्समेंट वाले मल्टी-चैंबर प्रोफ़ाइल, फ़्यूज़न-वेल्डेड कोने और मल्टी-पॉइंट लॉकिंग। DGU ग्लास के साथ 30–40 dB तक शोर में कमी और 30% तक थर्मल ऊर्जा बचत। दीमक-रोधी, सड़न-रहित, लेड-फ़्री और UV-स्टेबलाइज़्ड।',
        pa: 'ਗੈਲਵੇਨਾਈਜ਼ਡ ਸਟੀਲ ਰੀਇਨਫ਼ੋਰਸਮੈਂਟ ਵਾਲੇ ਮਲਟੀ-ਚੈਂਬਰ ਪ੍ਰੋਫ਼ਾਈਲ, ਫ਼ਿਊਜ਼ਨ-ਵੈਲਡਡ ਕੋਨੇ ਅਤੇ ਮਲਟੀ-ਪੁਆਇੰਟ ਲੌਕਿੰਗ। DGU ਗਲਾਸ ਨਾਲ 30–40 dB ਤੱਕ ਸ਼ੋਰ ਵਿੱਚ ਕਮੀ ਅਤੇ 30% ਤੱਕ ਥਰਮਲ ਊਰਜਾ ਬਚਤ। ਸਿਉਂਕ-ਰੋਧੀ, ਗਲਣ-ਰਹਿਤ, ਲੈੱਡ-ਫ਼੍ਰੀ ਅਤੇ UV-ਸਟੇਬਲਾਈਜ਼ਡ।'
      },
      ask: ['quantity', 'specifications', 'deliveryLocation', 'timeline'],
      hints: {
        quantity: { en: 'e.g. 10 windows and 1 balcony door', hi: 'जैसे 10 खिड़कियाँ और 1 बालकनी दरवाज़ा', pa: 'ਜਿਵੇਂ 10 ਖਿੜਕੀਆਂ ਅਤੇ 1 ਬਾਲਕਨੀ ਦਰਵਾਜ਼ਾ' },
        specifications: { en: 'e.g. 4 ft × 4 ft, white, with mesh', hi: 'जैसे 4 फुट × 4 फुट, सफ़ेद, मेश के साथ', pa: 'ਜਿਵੇਂ 4 ਫੁੱਟ × 4 ਫੁੱਟ, ਚਿੱਟਾ, ਮੈਸ਼ ਨਾਲ' }
      },
      subcategories: [
        {
          id: 'upvc-windows',
          label: { en: 'Windows', hi: 'खिड़कियाँ', pa: 'ਖਿੜਕੀਆਂ' },
          products: [
            {
              id: 'upvc-sliding-windows',
              label: { en: 'Multi-Chamber Sliding Windows', hi: 'मल्टी-चैंबर स्लाइडिंग खिड़कियाँ', pa: 'ਮਲਟੀ-ਚੈਂਬਰ ਸਲਾਈਡਿੰਗ ਖਿੜਕੀਆਂ' },
              summary: {
                en: '2-track and 3-track uPVC sliding windows, with an option for SS 304 mosquito mesh.',
                hi: '2 ट्रैक और 3 ट्रैक uPVC स्लाइडिंग खिड़कियाँ, SS 304 मच्छरदानी के विकल्प के साथ।',
                pa: '2 ਟ੍ਰੈਕ ਅਤੇ 3 ਟ੍ਰੈਕ uPVC ਸਲਾਈਡਿੰਗ ਖਿੜਕੀਆਂ, SS 304 ਮੱਛਰਦਾਨੀ ਦੇ ਵਿਕਲਪ ਨਾਲ।'
              },
              points: [
                { en: '2-track: 60 mm frame depth', hi: '2 ट्रैक: 60 mm फ़्रेम डेप्थ', pa: '2 ਟ੍ਰੈਕ: 60 mm ਫ਼ਰੇਮ ਡੈਪਥ' },
                { en: '3-track: 88 mm frame depth with a mesh track', hi: '3 ट्रैक: मेश ट्रैक के साथ 88 mm फ़्रेम डेप्थ', pa: '3 ਟ੍ਰੈਕ: ਮੈਸ਼ ਟ੍ਰੈਕ ਨਾਲ 88 mm ਫ਼ਰੇਮ ਡੈਪਥ' }
              ],
              uses: { en: 'Bedrooms, living rooms and kitchens.', hi: 'बेडरूम, लिविंग रूम और रसोई।', pa: 'ਬੈੱਡਰੂਮ, ਲਿਵਿੰਗ ਰੂਮ ਅਤੇ ਰਸੋਈ।' },
              specs: {
                en: '2-track sliding: **60 mm** frame depth. 3-track sliding: **88 mm** frame depth with a mesh track. Mosquito mesh in SS 304 (2.5 / 3 track).',
                hi: '2 ट्रैक स्लाइडिंग: **60 mm** फ़्रेम डेप्थ। 3 ट्रैक स्लाइडिंग: मेश ट्रैक के साथ **88 mm** फ़्रेम डेप्थ। SS 304 मच्छरदानी (2.5 / 3 ट्रैक)।',
                pa: '2 ਟ੍ਰੈਕ ਸਲਾਈਡਿੰਗ: **60 mm** ਫ਼ਰੇਮ ਡੈਪਥ। 3 ਟ੍ਰੈਕ ਸਲਾਈਡਿੰਗ: ਮੈਸ਼ ਟ੍ਰੈਕ ਨਾਲ **88 mm** ਫ਼ਰੇਮ ਡੈਪਥ। SS 304 ਮੱਛਰਦਾਨੀ (2.5 / 3 ਟ੍ਰੈਕ)।'
              },
              page: 'upvc-systems.html'
            },
            {
              id: 'upvc-casement-windows',
              label: { en: 'Casement & Tilt-Turn Windows', hi: 'केसमेंट और टिल्ट-टर्न खिड़कियाँ', pa: 'ਕੇਸਮੈਂਟ ਅਤੇ ਟਿਲਟ-ਟਰਨ ਖਿੜਕੀਆਂ' },
              summary: {
                en: 'Single and double casement, top-hung and tilt-and-turn uPVC windows with German-spec hardware.',
                hi: 'सिंगल और डबल केसमेंट, टॉप-हंग और जर्मन-स्पेक हार्डवेयर वाली टिल्ट-एंड-टर्न uPVC खिड़कियाँ।',
                pa: 'ਸਿੰਗਲ ਅਤੇ ਡਬਲ ਕੇਸਮੈਂਟ, ਟੌਪ-ਹੰਗ ਅਤੇ ਜਰਮਨ-ਸਪੈੱਕ ਹਾਰਡਵੇਅਰ ਵਾਲੀਆਂ ਟਿਲਟ-ਐਂਡ-ਟਰਨ uPVC ਖਿੜਕੀਆਂ।'
              },
              points: [
                { en: 'Tilt-and-turn in 60 / 70 mm systems', hi: '60 / 70 mm सिस्टम में टिल्ट-एंड-टर्न', pa: '60 / 70 mm ਸਿਸਟਮ ਵਿੱਚ ਟਿਲਟ-ਐਂਡ-ਟਰਨ' },
                { en: 'EPDM / TPE compression gaskets for a tight seal', hi: 'कसकर सील के लिए EPDM / TPE कम्प्रेशन गैस्केट', pa: 'ਕਸਵੀਂ ਸੀਲ ਲਈ EPDM / TPE ਕੰਪ੍ਰੈਸ਼ਨ ਗੈਸਕੇਟ' }
              ],
              uses: { en: 'Homes needing full opening, ventilation and quiet rooms.', hi: 'जिन घरों में पूरा खुलाव, हवा और शांत कमरे चाहिए।', pa: 'ਜਿਨ੍ਹਾਂ ਘਰਾਂ ਵਿੱਚ ਪੂਰੀ ਖੁੱਲ੍ਹ, ਹਵਾ ਅਤੇ ਸ਼ਾਂਤ ਕਮਰੇ ਚਾਹੀਦੇ ਹਨ।' },
              page: 'upvc-systems.html'
            },
            {
              id: 'upvc-fixed-windows',
              label: { en: 'Fixed, Combination & Bay Windows', hi: 'फ़िक्स्ड, कॉम्बिनेशन और बे खिड़कियाँ', pa: 'ਫ਼ਿਕਸਡ, ਕੰਬੀਨੇਸ਼ਨ ਅਤੇ ਬੇ ਖਿੜਕੀਆਂ' },
              summary: {
                en: 'Fixed windows, combination windows (fixed plus casement or slider), bay windows (90° / 135°) and ventilators.',
                hi: 'फ़िक्स्ड खिड़कियाँ, कॉम्बिनेशन खिड़कियाँ (फ़िक्स्ड के साथ केसमेंट या स्लाइडर), बे खिड़कियाँ (90° / 135°) और वेंटिलेटर।',
                pa: 'ਫ਼ਿਕਸਡ ਖਿੜਕੀਆਂ, ਕੰਬੀਨੇਸ਼ਨ ਖਿੜਕੀਆਂ (ਫ਼ਿਕਸਡ ਨਾਲ ਕੇਸਮੈਂਟ ਜਾਂ ਸਲਾਈਡਰ), ਬੇ ਖਿੜਕੀਆਂ (90° / 135°) ਅਤੇ ਵੈਂਟੀਲੇਟਰ।'
              },
              points: [{ en: 'Fixed windows take single glass or DGU up to 24 mm', hi: 'फ़िक्स्ड खिड़कियों में सिंगल ग्लास या 24 mm तक DGU', pa: 'ਫ਼ਿਕਸਡ ਖਿੜਕੀਆਂ ਵਿੱਚ ਸਿੰਗਲ ਗਲਾਸ ਜਾਂ 24 mm ਤੱਕ DGU' }],
              uses: { en: 'Picture windows, corners and mixed openings.', hi: 'पिक्चर विंडो, कोने और मिले-जुले खुलाव।', pa: 'ਪਿਕਚਰ ਵਿੰਡੋ, ਕੋਨੇ ਅਤੇ ਮਿਲੀਆਂ-ਜੁਲੀਆਂ ਖੁੱਲ੍ਹਾਂ।' },
              specs: {
                en: 'Fixed windows take single glass or DGU up to **24 mm**. Bay windows at 90° or 135°.',
                hi: 'फ़िक्स्ड खिड़कियों में सिंगल ग्लास या **24 mm** तक DGU। बे खिड़कियाँ 90° या 135° पर।',
                pa: 'ਫ਼ਿਕਸਡ ਖਿੜਕੀਆਂ ਵਿੱਚ ਸਿੰਗਲ ਗਲਾਸ ਜਾਂ **24 mm** ਤੱਕ DGU। ਬੇ ਖਿੜਕੀਆਂ 90° ਜਾਂ 135° ’ਤੇ।'
              },
              page: 'upvc-systems.html'
            }
          ]
        },
        {
          id: 'upvc-doors',
          label: { en: 'Doors', hi: 'दरवाज़े', pa: 'ਦਰਵਾਜ਼ੇ' },
          products: [
            {
              id: 'upvc-sliding-doors',
              label: { en: 'Sliding & Lift-and-Slide Doors', hi: 'स्लाइडिंग और लिफ़्ट-एंड-स्लाइड दरवाज़े', pa: 'ਸਲਾਈਡਿੰਗ ਅਤੇ ਲਿਫ਼ਟ-ਐਂਡ-ਸਲਾਈਡ ਦਰਵਾਜ਼ੇ' },
              summary: {
                en: 'Sliding doors with 2, 3 or 4 panels and a keyed multi-point hook lock, lift-and-slide doors and sliding doors with mosquito mesh.',
                hi: '2, 3 या 4 पैनल और चाबी वाले मल्टी-पॉइंट हुक लॉक के साथ स्लाइडिंग दरवाज़े, लिफ़्ट-एंड-स्लाइड दरवाज़े और मच्छरदानी वाले स्लाइडिंग दरवाज़े।',
                pa: '2, 3 ਜਾਂ 4 ਪੈਨਲ ਅਤੇ ਚਾਬੀ ਵਾਲੇ ਮਲਟੀ-ਪੁਆਇੰਟ ਹੁੱਕ ਲੌਕ ਨਾਲ ਸਲਾਈਡਿੰਗ ਦਰਵਾਜ਼ੇ, ਲਿਫ਼ਟ-ਐਂਡ-ਸਲਾਈਡ ਦਰਵਾਜ਼ੇ ਅਤੇ ਮੱਛਰਦਾਨੀ ਵਾਲੇ ਸਲਾਈਡਿੰਗ ਦਰਵਾਜ਼ੇ।'
              },
              points: [{ en: 'Keyed multi-point hook lock', hi: 'चाबी वाला मल्टी-पॉइंट हुक लॉक', pa: 'ਚਾਬੀ ਵਾਲਾ ਮਲਟੀ-ਪੁਆਇੰਟ ਹੁੱਕ ਲੌਕ' }],
              uses: { en: 'Balconies, terraces and patios.', hi: 'बालकनी, छत और पैटियो।', pa: 'ਬਾਲਕਨੀ, ਛੱਤ ਅਤੇ ਪੈਟੀਓ।' },
              page: 'upvc-systems.html'
            },
            {
              id: 'upvc-casement-doors',
              label: { en: 'Casement, French & Entrance Doors', hi: 'केसमेंट, फ़्रेंच और एंट्रेंस दरवाज़े', pa: 'ਕੇਸਮੈਂਟ, ਫ਼੍ਰੈਂਚ ਅਤੇ ਐਂਟਰੈਂਸ ਦਰਵਾਜ਼ੇ' },
              summary: {
                en: 'Casement doors with 3D-adjustable hinges, single and double openable doors, French and balcony doors, and entrance doors with a reinforced steel core.',
                hi: '3D-एडजस्टेबल हिंज वाले केसमेंट दरवाज़े, सिंगल और डबल खुलने वाले दरवाज़े, फ़्रेंच और बालकनी दरवाज़े, और रीइन्फ़ोर्स्ड स्टील कोर वाले एंट्रेंस दरवाज़े।',
                pa: '3D-ਐਡਜਸਟੇਬਲ ਹਿੰਜ ਵਾਲੇ ਕੇਸਮੈਂਟ ਦਰਵਾਜ਼ੇ, ਸਿੰਗਲ ਅਤੇ ਡਬਲ ਖੁੱਲ੍ਹਣ ਵਾਲੇ ਦਰਵਾਜ਼ੇ, ਫ਼੍ਰੈਂਚ ਅਤੇ ਬਾਲਕਨੀ ਦਰਵਾਜ਼ੇ, ਅਤੇ ਰੀਇਨਫ਼ੋਰਸਡ ਸਟੀਲ ਕੋਰ ਵਾਲੇ ਐਂਟਰੈਂਸ ਦਰਵਾਜ਼ੇ।'
              },
              points: [
                { en: 'Entrance doors: laminated glass inserts and euro-cylinder locks', hi: 'एंट्रेंस दरवाज़े: लैमिनेटेड ग्लास इन्सर्ट और यूरो-सिलिंडर लॉक', pa: 'ਐਂਟਰੈਂਸ ਦਰਵਾਜ਼ੇ: ਲੈਮੀਨੇਟਿਡ ਗਲਾਸ ਇਨਸਰਟ ਅਤੇ ਯੂਰੋ-ਸਿਲੰਡਰ ਲੌਕ' },
                { en: 'French doors with a low-threshold option', hi: 'लो-थ्रेशोल्ड विकल्प वाले फ़्रेंच दरवाज़े', pa: 'ਲੋ-ਥ੍ਰੈਸ਼ਹੋਲਡ ਵਿਕਲਪ ਵਾਲੇ ਫ਼੍ਰੈਂਚ ਦਰਵਾਜ਼ੇ' }
              ],
              uses: { en: 'Main entrances, balconies and garden doors.', hi: 'मुख्य प्रवेश, बालकनी और बगीचे के दरवाज़े।', pa: 'ਮੁੱਖ ਦਾਖ਼ਲਾ, ਬਾਲਕਨੀ ਅਤੇ ਬਗੀਚੇ ਦੇ ਦਰਵਾਜ਼ੇ।' },
              page: 'upvc-systems.html'
            }
          ]
        },
        {
          id: 'upvc-glazing',
          label: { en: 'Acoustic & Energy-Saving Glazing', hi: 'एकॉस्टिक और ऊर्जा-बचत ग्लेज़िंग', pa: 'ਐਕੋਸਟਿਕ ਅਤੇ ਊਰਜਾ-ਬਚਤ ਗਲੇਜ਼ਿੰਗ' },
          products: [
            {
              id: 'upvc-acoustic',
              label: { en: 'Acoustic & Energy-Saving uPVC Glazing', hi: 'एकॉस्टिक और ऊर्जा-बचत uPVC ग्लेज़िंग', pa: 'ਐਕੋਸਟਿਕ ਅਤੇ ਊਰਜਾ-ਬਚਤ uPVC ਗਲੇਜ਼ਿੰਗ' },
              summary: {
                en: 'uPVC windows and doors combined with DGU glass for quieter, more comfortable rooms.',
                hi: 'शांत और आरामदायक कमरों के लिए DGU ग्लास के साथ uPVC खिड़कियाँ और दरवाज़े।',
                pa: 'ਸ਼ਾਂਤ ਅਤੇ ਆਰਾਮਦਾਇਕ ਕਮਰਿਆਂ ਲਈ DGU ਗਲਾਸ ਨਾਲ uPVC ਖਿੜਕੀਆਂ ਅਤੇ ਦਰਵਾਜ਼ੇ।'
              },
              points: [
                { en: 'Up to 30–40 dB outside noise reduction with DGU glass', hi: 'DGU ग्लास के साथ बाहर के शोर में 30–40 dB तक कमी', pa: 'DGU ਗਲਾਸ ਨਾਲ ਬਾਹਰ ਦੇ ਸ਼ੋਰ ਵਿੱਚ 30–40 dB ਤੱਕ ਕਮੀ' },
                { en: 'Up to 30% thermal energy savings', hi: '30% तक थर्मल ऊर्जा बचत', pa: '30% ਤੱਕ ਥਰਮਲ ਊਰਜਾ ਬਚਤ' }
              ],
              uses: { en: 'Homes and hotels near roads, markets or airports.', hi: 'सड़क, बाज़ार या एयरपोर्ट के पास घर और होटल।', pa: 'ਸੜਕ, ਬਾਜ਼ਾਰ ਜਾਂ ਹਵਾਈ ਅੱਡੇ ਨੇੜੇ ਘਰ ਅਤੇ ਹੋਟਲ।' },
              page: 'upvc-systems.html'
            }
          ]
        }
      ]
    }
  ],

  /* Company-wide verified answers used for product questions (answer source: knowledge base). */
  facts: {
    certifications: {
      en: 'JK International is **ISO 9001:2015** certified, its safety glass is **BIS** marked (IS 2553) and products are made to CE norms. The plant was certified by Saint-Gobain India (2016), by ASRTU (2017), and the Gujarat Forensic Lab certified our bullet resistant glass (2017).',
      hi: 'JK International **ISO 9001:2015** प्रमाणित है, इसका सेफ्टी ग्लास **BIS** मार्क (IS 2553) है और उत्पाद CE मानकों के अनुसार बनते हैं। प्लांट को Saint-Gobain India (2016) और ASRTU (2017) ने प्रमाणित किया, और गुजरात फॉरेंसिक लैब ने हमारे बुलेट रेज़िस्टेंट ग्लास को प्रमाणित किया (2017)।',
      pa: 'JK International **ISO 9001:2015** ਪ੍ਰਮਾਣਿਤ ਹੈ, ਇਸਦਾ ਸੇਫ਼ਟੀ ਗਲਾਸ **BIS** ਮਾਰਕ (IS 2553) ਹੈ ਅਤੇ ਉਤਪਾਦ CE ਮਾਪਦੰਡਾਂ ਮੁਤਾਬਕ ਬਣਦੇ ਹਨ। ਪਲਾਂਟ ਨੂੰ Saint-Gobain India (2016) ਅਤੇ ASRTU (2017) ਨੇ ਪ੍ਰਮਾਣਿਤ ਕੀਤਾ, ਅਤੇ ਗੁਜਰਾਤ ਫੋਰੈਂਸਿਕ ਲੈਬ ਨੇ ਸਾਡੇ ਬੁਲੇਟ ਰੋਧਕ ਗਲਾਸ ਨੂੰ ਪ੍ਰਮਾਣਿਤ ਕੀਤਾ (2017)।'
    },
    quoteResponse: {
      en: 'Quotation requests are usually answered within **2–4 business hours**.',
      hi: 'कोटेशन अनुरोधों का जवाब आमतौर पर **2–4 कार्य-घंटों** में दिया जाता है।',
      pa: 'ਕੋਟੇਸ਼ਨ ਬੇਨਤੀਆਂ ਦਾ ਜਵਾਬ ਆਮ ਤੌਰ ’ਤੇ **2–4 ਕੰਮਕਾਜੀ ਘੰਟਿਆਂ** ਵਿੱਚ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।'
    },
    regions: {
      en: 'We serve Punjab, Chandigarh Tricity, Haryana, Himachal Pradesh and Jammu & Kashmir. For other regions, our sales team confirms.',
      hi: 'हम पंजाब, चंडीगढ़ ट्राइसिटी, हरियाणा, हिमाचल प्रदेश और जम्मू-कश्मीर में सेवा देते हैं। अन्य क्षेत्रों के लिए हमारी सेल्स टीम कन्फ़र्म करती है।',
      pa: 'ਅਸੀਂ ਪੰਜਾਬ, ਚੰਡੀਗੜ੍ਹ ਟ੍ਰਾਈਸਿਟੀ, ਹਰਿਆਣਾ, ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼ ਅਤੇ ਜੰਮੂ-ਕਸ਼ਮੀਰ ਵਿੱਚ ਸੇਵਾ ਦਿੰਦੇ ਹਾਂ। ਹੋਰ ਖੇਤਰਾਂ ਲਈ ਸਾਡੀ ਸੇਲਜ਼ ਟੀਮ ਪੱਕਾ ਕਰਦੀ ਹੈ।'
    }
  },

  /* Verified company contacts (from contact.html). */
  contacts: {
    whatsapp: '918566008869',
    whatsappDisplay: '+91-85660-08869',
    phones: [
      { number: '+917814653907', display: '+91-78146-53907', area: { en: 'Punjab, Chandigarh & Haryana', hi: 'पंजाब, चंडीगढ़ और हरियाणा', pa: 'ਪੰਜਾਬ, ਚੰਡੀਗੜ੍ਹ ਅਤੇ ਹਰਿਆਣਾ' } },
      { number: '+919318953907', display: '+91-93189-53907', area: { en: 'Himachal Pradesh & J&K', hi: 'हिमाचल प्रदेश और जम्मू-कश्मीर', pa: 'ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼ ਅਤੇ ਜੰਮੂ-ਕਸ਼ਮੀਰ' } }
    ],
    email: 'sales@jkglasses.com'
  }
};
