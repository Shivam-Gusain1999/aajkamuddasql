import React, { useEffect } from 'react';

const TermsCondition = () => {
  // Using useEffect to scroll the page to the top when the component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // This provides a smooth scrolling effect
    });
  }, []);

  return (
    // Used <main> instead of <div>, which is a best practice for SEO and Accessibility
    <main className="bg-gray-50 min-h-screen pt-8 flex flex-col">
      {/* <article> टैग यह बताता है कि यह एक स्वतंत्र कंटेंट ब्लॉक है */}
      <article className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-2xl shadow-sm border border-gray-100 mb-12 flex-grow">

        {/* Header section को अलग किया ताकि कोड पढ़ने में आसान हो */}
        <header className="border-b pb-6 mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            नियम और शर्तें (Terms & Conditions)
          </h1>
          {/* प्रोफेशनल टच: लास्ट अपडेट की तारीख हमेशा होनी चाहिए */}
          <p className="text-sm text-gray-500 mt-2">अंतिम अपडेट: मार्च 2026</p>
        </header>

        <section className="prose max-w-none text-gray-700 leading-relaxed space-y-8">
          <p className="text-lg">
            Aaj Ka Mudda वेबसाइट तक पहुँचने और उसका उपयोग करने के लिए आपका स्वागत है। हमारी वेबसाइट का उपयोग करके, आप निम्नलिखित नियमों और शर्तों को स्वीकार करने और उनका पालन करने के लिए सहमत होते हैं।
          </p>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. सामग्री का उपयोग</h2>
            <p>
              इस वेबसाइट पर प्रकाशित सभी सामग्री (समाचार, लेख, चित्र, वीडियो) Aaj Ka Mudda की संपत्ति है। आप इस सामग्री का उपयोग केवल व्यक्तिगत और गैर-व्यावसायिक उद्देश्यों के लिए कर सकते हैं। बिना पूर्व लिखित अनुमति के किसी भी सामग्री का पुनरुत्पादन या वितरण सख्त वर्जित है।
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. उपयोगकर्ता आचरण</h2>
            <p>
              आप हमारी वेबसाइट का उपयोग किसी भी गैरकानूनी, अपमानजनक, या हानिकारक गतिविधि के लिए नहीं करने के लिए सहमत हैं। टिप्पणियों (Comments) में गाली-गलौज, नफरत फैलाने वाले भाषण या स्पैम की अनुमति नहीं है। हम ऐसे किसी भी उपयोगकर्ता को ब्लॉक करने का अधिकार सुरक्षित रखते हैं।
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. बाहरी लिंक</h2>
            <p>
              हमारी वेबसाइट में अन्य तृतीय-पक्ष (Third-party) वेबसाइटों के लिंक हो सकते हैं। हम उन वेबसाइटों की सामग्री या गोपनीयता नीतियों के लिए ज़िम्मेदार नहीं हैं। उन साइटों का उपयोग आपके अपने जोखिम पर है।
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. नियम और शर्तों में परिवर्तन</h2>
            <p>
              हम किसी भी समय इन नियमों और शर्तों को संशोधित करने का अधिकार सुरक्षित रखते हैं। परिवर्तन पोस्ट किए जाने के बाद आपका निरंतर उपयोग उन परिवर्तनों की स्वीकृति माना जाएगा।
            </p>
          </div>
        </section>
      </article>
    </main>
  );
};

export default TermsCondition;