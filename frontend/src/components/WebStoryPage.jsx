import React, { useState, useEffect } from "react";
import api from "../assets/api";
import { BookOpen, X } from "lucide-react";

const WebStoryPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const [progress, setProgress] = useState(0);

  // 🚀 Auto-Advance Timer Logic
  useEffect(() => {
    if (activeIndex === null) return;
    setProgress(0);
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Auto-advance to next story or close if at the end
          if (activeIndex < stories.length - 1) setActiveIndex(activeIndex + 1);
          else setActiveIndex(null);
          return 100;
        }
        return prev + 1; // 1% per 50ms = 5 seconds total
      });
    }, 50);

    return () => clearInterval(timer);
  }, [activeIndex, stories.length]);

  const activeStory = activeIndex !== null ? stories[activeIndex] : null;

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await api.get('/webstories?status=PUBLISHED');
        setStories(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch web stories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
         <BookOpen className="w-8 h-8 text-orange-600" />
         <h1 className="text-2xl md:text-3xl font-bold text-gray-900">वेब स्टोरीज़</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : stories.length === 0 ? (
         <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600">कोई वेब स्टोरी नहीं मिली</h2>
            <p className="text-gray-500 mt-2">जल्द ही नई स्टोरीज़ अपलोड की जाएंगी।</p>
         </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {stories.map((story, index) => (
            <div key={story._id} onClick={() => setActiveIndex(index)} className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all aspect-[9/16] cursor-pointer">
               <img src={story.image} alt={story.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <span className="bg-orange-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded inline-block mb-2 w-max">
                     {story.category?.name || "Story"}
                  </span>
                  <h3 className="text-white font-bold text-sm md:text-base leading-snug line-clamp-3">
                     {story.title}
                  </h3>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* 🚀 FULLSCREEN STORY VIEWER MODAL */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8 backdrop-blur-sm">
          {/* Close Button */}
          <button 
            onClick={() => setActiveIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          
          {/* Story Container (Instagram Reel Style) */}
          <div className="relative w-full max-w-md h-[80vh] sm:h-[85vh] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20 animate-in fade-in zoom-in duration-300">
            
            {/* 🚀 Progress Bar */}
            <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-3">
              <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-75 ease-linear" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <img 
              src={activeStory.image} 
              alt={activeStory.title}
              className="w-full h-full object-cover"
            />
            {/* Story Overlay Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-6">
              <span className="bg-orange-600 text-white text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full inline-block mb-3 w-max shadow-lg">
                {activeStory.category?.name || "Story"}
              </span>
              <h2 className="text-white font-bold text-xl sm:text-2xl leading-snug drop-shadow-md">
                {activeStory.title}
              </h2>
              
              {/* 🚀 Swipe Up Article Link */}
              {activeStory.articleUrl && (
                <div className="mt-8 mb-2 flex justify-center w-full animate-bounce">
                  <a href={activeStory.articleUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-white/90 hover:text-white transition-colors group/link">
                    <span className="text-[10px] font-bold uppercase tracking-widest mb-1 group-hover/link:-translate-y-1 transition-transform">Swipe Up</span>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover/link:bg-white/30 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebStoryPage;
