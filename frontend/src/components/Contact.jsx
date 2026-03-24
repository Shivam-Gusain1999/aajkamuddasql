import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Bulletproof scroll-to-top logic (instant scroll after DOM loads)
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setIsSuccess(false), 5000);
    }, 2000);
  };

  return (
    <main className="bg-gray-50 min-h-screen pt-8 flex flex-col">
      <section className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-2xl shadow-sm border border-gray-100 mb-12 flex-grow">

        <header className="text-center border-b pb-8 mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">हमसे संपर्क करें</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Aaj Ka Mudda की टीम हमेशा आपकी बात सुनने के लिए तैयार है। खबर की टिप देनी हो या विज्ञापन देना हो, बेझिझक संपर्क करें।
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">

          {/* Left Side: Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">मुख्य कार्यालय</h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-red-100">
                    <MapPin size={24} />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">पता</p>
                    <p className="text-gray-900 font-medium leading-relaxed">आज का मुद्दा हेडक्वार्टर<br />कनाट प्लेस, नई दिल्ली, 110001<br />भारत</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-red-100">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">फ़ोन नंबर</p>
                    <p className="text-gray-900 font-medium">+91 9876543210</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Department Emails - For a professional News vibe */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">विभागीय ईमेल</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-red-200 transition-colors">
                  <Mail size={20} className="text-red-500 mb-2" />
                  <p className="text-sm text-gray-500 font-semibold">संपादकीय (Editorial)</p>
                  <a href="mailto:editor@timesnews.in" className="text-gray-900 font-medium hover:text-red-600">editor@aajkamudda.in</a>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-red-200 transition-colors">
                  <Mail size={20} className="text-red-500 mb-2" />
                  <p className="text-sm text-gray-500 font-semibold">विज्ञापन (Advertising)</p>
                  <a href="mailto:ads@timesnews.in" className="text-gray-900 font-medium hover:text-red-600">ads@aajkamudda.in</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg relative overflow-hidden">
            {isSuccess && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6">
                <CheckCircle size={60} className="text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">संदेश भेज दिया गया!</h3>
                <p className="text-gray-600">हम जल्द ही आपसे संपर्क करेंगे। Aaj Ka Mudda से जुड़ने के लिए धन्यवाद।</p>
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-800 mb-6">हमें एक संदेश भेजें</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">पूरा नाम</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all" placeholder="आपका नाम" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">ईमेल</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all" placeholder="आपका ईमेल" required />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1">विषय (Subject)</label>
                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all" placeholder="उदा: विज्ञापन के लिए या न्यूज़ टिप" required />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">संदेश</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="5" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all resize-none" placeholder="अपना संदेश यहाँ लिखें..." required></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center gap-2 font-bold py-4 rounded-lg transition-all shadow-md ${isSubmitting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5'} text-white`}
              >
                {isSubmitting ? 'भेजा जा रहा है...' : (
                  <>संदेश भेजें <Send size={18} /></>
                )}
              </button>
            </form>
          </div>

        </div>
      </section>
    </main>
  );
};

export default Contact;