import React, { useEffect, useRef } from 'react';
import NewsCatagory from './NewsCatagory';
import RightSidebar from './RightSidebar';
import NewsSection from './NewsSection';

const Home = () => {
  const leftSidebarRef = useRef(null);

  // 🚀 PRO SCROLL FIX: Bi-Directional JS Sticky for Left Sidebar (Optimized with rAF)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let currentTop = 80; // default top padding
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sidebar = leftSidebarRef.current;
          if (!sidebar) {
            ticking = false;
            return;
          }
          
          const scrollY = window.scrollY;
          const scrollDiff = scrollY - lastScrollY;
          lastScrollY = scrollY;
          
          const sidebarHeight = sidebar.offsetHeight;
          const windowHeight = window.innerHeight;
          const maxTop = 80;
          
          if (sidebarHeight + maxTop <= windowHeight) {
            if (sidebar.style.top !== `${maxTop}px`) sidebar.style.top = `${maxTop}px`;
            ticking = false;
            return;
          }
          
          const minTop = windowHeight - sidebarHeight - 20;
          currentTop -= scrollDiff;
          
          if (currentTop > maxTop) currentTop = maxTop;
          if (currentTop < minTop) currentTop = minTop;
          
          sidebar.style.top = `${currentTop}px`;
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    setTimeout(handleScroll, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);


  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Mobile: Horizontal Categories */}
      <div className="md:hidden border-b bg-white">
        <NewsCatagory horizontal />
      </div>

      <div className="flex max-w-7xl mx-auto px-2 md:px-4 flex-col lg:flex-row gap-4 py-3">

        {/* Left Sidebar */}
        <div className="hidden lg:block lg:w-52 shrink-0">
          <div ref={leftSidebarRef} className="sticky z-10 bg-white border border-gray-200 rounded overflow-hidden" style={{ top: '80px' }}>
            <div className="bg-red-600 text-white px-3 py-2">
              <h3 className="text-lg text-center font-bold uppercase tracking-wide">कैटेगरी</h3>
            </div>
            <NewsCatagory />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 gap-4 min-h-screen">
          <div className="flex-1 min-w-0">
            <NewsSection />
          </div>

          {/* Right Sidebar */}
          <div className="hidden md:block w-72 shrink-0">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
