import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  // To scroll to the top as soon as the page loads
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen pt-8 flex flex-col">
      <article className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-2xl shadow-sm border border-gray-100 mb-12 flex-grow">

        <header className="border-b pb-6 mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            निजता नीति (Privacy Policy)
          </h1>
          <p className="text-sm text-gray-500 mt-2">अंतिम अपडेट: 18 मार्च 2026</p>
        </header>

        <section className="prose max-w-none text-gray-700 leading-relaxed space-y-8">
          <p className="text-lg font-medium">
            Aaj Ka Mudda में आपका स्वागत है। आपकी निजता (Privacy) हमारे लिए सर्वोपरि है। यह नीति स्पष्ट करती है कि जब आप हमारी वेबसाइट और सेवाओं का उपयोग करते हैं, तो हम आपका डेटा कैसे एकत्र, उपयोग और सुरक्षित करते हैं।
          </p>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. जानकारी जो हम एकत्र करते हैं</h2>
            <p>
              हम दो प्रकार की जानकारी एकत्र करते हैं:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>व्यक्तिगत जानकारी:</strong> जब आप न्यूज़लेटर सब्सक्राइब करते हैं, अकाउंट बनाते हैं या कमेंट करते हैं, तब हम आपका नाम, ईमेल और फोन नंबर एकत्र कर सकते हैं।</li>
              <li><strong>गैर-व्यक्तिगत जानकारी:</strong> इसमें आपका IP एड्रेस, ब्राउज़र का प्रकार, डिवाइस की जानकारी और हमारी साइट पर बिताया गया समय शामिल है, जो एनालिटिक्स के लिए उपयोग किया जाता है।</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. कुकीज़ (Cookies) और ट्रैकिंग</h2>
            <p>
              हम यूज़र एक्सपीरियंस को बेहतर बनाने और प्रासंगिक विज्ञापन (Relevant Ads) दिखाने के लिए कुकीज़ का उपयोग करते हैं। आप अपनी ब्राउज़र सेटिंग से कुकीज़ को डिसेबल कर सकते हैं, लेकिन इससे वेबसाइट के कुछ फीचर्स काम करना बंद कर सकते हैं।
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. थर्ड-पार्टी लिंक्स और विज्ञापन (Third-Party Ads)</h2>
            <p>
              हमारी वेबसाइट पर Google AdSense या अन्य थर्ड-पार्टी विज्ञापनदाताओं के लिंक हो सकते हैं। ये नेटवर्क आपके ब्राउज़िंग पैटर्न के आधार पर विज्ञापन दिखाने के लिए कुकीज़ (जैसे DoubleClick DART cookie) का उपयोग कर सकते हैं। हम इन थर्ड-पार्टी वेबसाइटों की प्राइवेसी पॉलिसी के लिए ज़िम्मेदार नहीं हैं।
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. डेटा सुरक्षा और गोपनीयता</h2>
            <p>
              हम आपके डेटा को सुरक्षित रखने के लिए इंडस्ट्री-स्टैंडर्ड एन्क्रिप्शन (SSL) का उपयोग करते हैं। हम कानूनी दायित्वों (Legal obligations) को छोड़कर, आपकी सहमति के बिना कभी भी आपका डेटा किसी तीसरे पक्ष को बेचते या साझा नहीं करते हैं।
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">5. संपर्क करें</h2>
            <p>
              यदि इस निजता नीति के संबंध में आपके कोई प्रश्न या सुझाव हैं, तो कृपया हमसे संपर्क करें:
              <br />
              <strong>ईमेल:</strong> contact@aajkamudda.com
            </p>
          </div>
        </section>
      </article>
    </main>
  );
};

export default PrivacyPolicy;