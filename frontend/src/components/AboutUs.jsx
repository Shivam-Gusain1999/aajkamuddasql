import React, { useEffect } from 'react';

const AboutUs = () => {

  // Bulletproof scroll-to-top logic (instant scroll after DOM loads)
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);


  return (
    <main className="bg-gray-50 min-h-screen pt-8 flex flex-col">
      <article className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-2xl shadow-sm border border-gray-100 mb-12 flex-grow">

        {/* Header Section */}
        <header className="border-b pb-8 mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            हमारे बारे में (About Us)
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            सच्चाई, निष्पक्षता और निडर पत्रकारिता — Aaj Ka Mudda में आपका स्वागत है।
          </p>
        </header>

        <section className="prose max-w-none text-gray-700 leading-relaxed space-y-10">

          {/* Introduction */}
          <div>
            <p className="text-xl font-medium text-gray-800 border-l-4 border-blue-600 pl-4">
              <strong>Aaj Ka Mudda</strong> भारत और दुनिया भर की ताज़ा खबरों, गहन विश्लेषण, और निष्पक्ष रिपोर्टिंग के लिए आपका सबसे भरोसेमंद स्रोत है। हमारा मिशन हर नागरिक तक सच्ची और सटीक जानकारी पहुँचाना है।
            </p>
          </div>

          {/* Mission & Vision Grid */}
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-0">हमारा मिशन (Our Mission)</h2>
              <p className="m-0">
                हम मानते हैं कि पत्रकारिता लोकतंत्र का चौथा स्तंभ है। हमारी टीम दिन-रात मेहनत करती है ताकि आप राजनीति, खेल, व्यवसाय, शिक्षा और मनोरंजन जगत की हर बड़ी हलचल से सबसे पहले अपडेट रहें।
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-0">हमारा विज़न (Our Vision)</h2>
              <p className="m-0">
                एक ऐसा डिजिटल समाज बनाना जहाँ जानकारी बिना किसी मिलावट के सीधे लोगों तक पहुँचे। हम फेक न्यूज़ (Fake News) के खिलाफ लड़ते हैं और तथ्यों (Facts) पर आधारित खबरें ही प्रकाशित करते हैं।
              </p>
            </div>
          </div>

          {/* Our Team */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 border-b pb-2 inline-block">हमारी टीम (Our Team)</h2>
            <p className="text-lg">
              हमारे पास देशभर में फैले अनुभवी पत्रकारों, सम्पादकों और टेक-एक्सपर्ट्स की एक मजबूत टीम है। ग्राउंड रिपोर्टिंग से लेकर डिजिटल पब्लिशिंग तक, हमारी टीम हर खबर की तह तक जाकर सच्चाई आपके सामने लाती है। हम सिर्फ खबर नहीं बताते, हम उसका असर भी समझाते हैं।
            </p>
          </div>

          {/* Contact CTA */}
          <div className="bg-gray-900 text-white p-8 rounded-2xl text-center mt-12 shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-white">हमसे जुड़ें</h3>
            <p className="mb-6 text-gray-300">
              क्या आपके आस-पास कुछ ऐसा हो रहा है जो दुनिया को जानना चाहिए? हमें बताएं।
            </p>
            <a href="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              संपर्क करें (Contact Us)
            </a>
          </div>

        </section>
      </article>
    </main>
  );
};

export default AboutUs;