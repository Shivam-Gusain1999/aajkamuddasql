import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, ChevronRight, Cloud, Sun, CloudRain, Loader2, AlertCircle, Wind } from 'lucide-react';
import api from '../assets/api';

// 💡 SENIOR DEV TIP: Helper function to map weather codes to Icons and Hindi Text
const getWeatherCondition = (code) => {
  if (code === 0) return { text: "साफ आसमान", icon: <Sun size={32} className="text-yellow-500" /> };
  if (code >= 1 && code <= 3) return { text: "हल्के बादल", icon: <Cloud size={32} className="text-gray-400" /> };
  if (code >= 51 && code <= 67) return { text: "बारिश", icon: <CloudRain size={32} className="text-blue-500" /> };
  if (code >= 71 && code <= 77) return { text: "बर्फबारी", icon: <Cloud size={32} className="text-blue-300" /> };
  return { text: "सामान्य", icon: <Wind size={32} className="text-teal-500" /> };
};

const RightSidebar = () => {
  const [videos, setVideos] = useState([]);
  const [ad, setAd] = useState(null);
  const sidebarRef = useRef(null);

  // 🚀 New State for Live Weather & AQI
  const [weather, setWeather] = useState({
    temp: null,
    condition: null,
    aqi: null,
    loading: true,
    error: false
  });

  const navigate = useNavigate();

  // Fetch Videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get('/videos?status=PUBLISHED');
        setVideos(res.data?.data?.videos?.slice(0, 5) || []);
      } catch (error) {
        console.error("Failed to fetch sidebar videos", error);
      }
    };
    fetchVideos();
  }, []);

  // Fetch Ad
  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await api.get('/ads?activeOnly=true&placement=sidebar');
        const adsList = res.data?.data?.ads || [];
        if (adsList.length > 0) {
          setAd(adsList[Math.floor(Math.random() * adsList.length)]); // randomly pick an active ad
        }
      } catch (error) {
        console.error("Failed to fetch ad", error);
      }
    };
    fetchAd();
  }, []);

  // 🚀 Fetch Live Weather & AQI (Delhi Coordinates)
  useEffect(() => {
    const fetchWeatherAndAQI = async () => {
      try {
        // Using Promise.all so both APIs load fast in parallel
        const [weatherRes, aqiRes] = await Promise.all([
          fetch("https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current_weather=true"),
          fetch("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=28.6139&longitude=77.2090&current=us_aqi")
        ]);

        if (!weatherRes.ok || !aqiRes.ok) throw new Error("Failed to fetch data");

        const weatherData = await weatherRes.json();
        const aqiData = await aqiRes.json();

        setWeather({
          temp: Math.round(weatherData.current_weather.temperature),
          condition: getWeatherCondition(weatherData.current_weather.weathercode),
          aqi: aqiData.current.us_aqi,
          loading: false,
          error: false
        });
      } catch (error) {
        console.error("Weather fetch error:", error);
        setWeather(prev => ({ ...prev, loading: false, error: true }));
      }
    };

    fetchWeatherAndAQI();
  }, []);

  const getEmbedUrl = (url) => {
    const m = url?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return m && m[2].length === 11 ? `https://www.youtube.com/embed/${m[2]}` : url;
  };

  const getThumbUrl = (url) => {
    const m = url?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return m && m[2].length === 11 ? `https://img.youtube.com/vi/${m[2]}/mqdefault.jpg` : null;
  };

  // 🚀 PRO SCROLL FIX: Bi-Directional Optimized JS Sticky
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let currentTop = 80; // 5rem default top padding
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sidebar = sidebarRef.current;
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

          // If sidebar is shorter than window, just keep it at top
          if (sidebarHeight + maxTop <= windowHeight) {
            if (sidebar.style.top !== `${maxTop}px`) sidebar.style.top = `${maxTop}px`;
            ticking = false;
            return;
          }

          // 20px bottom padding
          const minTop = windowHeight - sidebarHeight - 20;

          // Move currentTop opposite to the scroll
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
  }, [videos, ad, weather]);

  return (
    // 🚀 SCROLL FIX: JS calculated sticky behavior
    <div ref={sidebarRef} className='space-y-5 pb-4 sticky z-10' style={{ top: '80px' }}>

      {/* Video Widget */}
      {videos.length > 0 && (
        <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
          <div className="flex items-center justify-between bg-red-600 text-white px-4 py-2.5">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <Play size={14} fill="white" /> वीडियो
            </h3>
            <button onClick={() => navigate('/videos')}
              className="text-xs font-bold hover:underline flex items-center">
              और देखें <ChevronRight size={14} />
            </button>
          </div>

          <div className="aspect-video bg-black">
            <iframe className="w-full h-full" src={getEmbedUrl(videos[0].videoUrl)}
              title={videos[0].title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
          </div>
          <div className="p-3 border-b border-gray-100">
            <h4 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug">{videos[0].title}</h4>
            <span className="text-xs font-bold text-red-600 uppercase mt-1 inline-block">{videos[0].category?.name}</span>
          </div>

          {videos.slice(1).map(video => {
            const thumb = video.thumbnail || getThumbUrl(video.videoUrl);
            return (
              <div key={video._id} className="flex gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors">
                <div className="relative w-24 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                  {thumb && <img src={thumb} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play size={16} className="text-white" fill="white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-snug">{video.title}</h5>
                  <span className="text-xs font-bold text-red-600 uppercase mt-1 inline-block">{video.category?.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🚀 LIVE Weather Widget */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
        <div className="bg-red-600 text-white px-4 py-2.5 flex items-center justify-between">
          <h3 className="text-base font-bold">दिल्ली का मौसम</h3>
          <Cloud size={18} />
        </div>

        <div className="p-5">
          {weather.loading ? (
            // Loading State
            <div className="flex flex-col items-center justify-center py-4 space-y-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-500 font-medium">लाइव डेटा लोड हो रहा है...</p>
            </div>
          ) : weather.error ? (
            // Error State
            <div className="flex flex-col items-center justify-center py-4 space-y-2 text-red-500">
              <AlertCircle className="w-8 h-8" />
              <p className="text-sm font-medium">मौसम अपडेट नहीं मिल सका</p>
            </div>
          ) : (
            // Success State (Live Data)
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {weather.condition?.icon}
                <div>
                  <p className="text-4xl font-black text-gray-800 tracking-tighter">
                    {weather.temp}°<span className="text-2xl text-gray-400">C</span>
                  </p>
                  <p className="text-sm font-bold text-gray-500 mt-0.5">{weather.condition?.text}</p>
                </div>
              </div>

              <div className="text-right border-l border-gray-100 pl-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">AQI Level</p>
                <p className="text-xl font-black text-gray-800">
                  {weather.aqi}
                </p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${weather.aqi <= 50 ? 'bg-green-100 text-green-700' :
                  weather.aqi <= 100 ? 'bg-yellow-100 text-yellow-700' :
                    weather.aqi <= 150 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                  }`}>
                  {weather.aqi <= 50 ? 'Good' : weather.aqi <= 100 ? 'Moderate' : 'Poor'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ad Space */}
      <div className="bg-gray-50 border border-gray-200 rounded p-5 text-center flex flex-col items-center justify-center shadow-inner">
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">विज्ञापन</span>
        {ad ? (
          ad.type === 'script' ? (
            <div className="w-full overflow-hidden flex justify-center items-center my-2" dangerouslySetInnerHTML={{ __html: ad.scriptCode }} />
          ) : (
            <a href={ad.link} target="_blank" rel="noreferrer" className="block w-full">
              <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto rounded shadow-sm hover:opacity-90 transition-opacity" loading="lazy" decoding="async" />
            </a>
          )
        ) : (
          <div className="w-full h-40 bg-gray-200/50 rounded flex items-center justify-center border border-gray-200 border-dashed">
            <span className="text-gray-400 text-sm font-medium">Ad Space (300x250)</span>
          </div>
        )}
      </div>

      {/* Mini Footer */}
      <div className="text-xs text-gray-500 text-center space-y-2 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          <Link to="/about" className="hover:text-red-600 transition-colors font-medium">About Us</Link>
          <Link to="/contact" className="hover:text-red-600 transition-colors font-medium">Contact</Link>
          <Link to="/privacy" className="hover:text-red-600 transition-colors font-medium">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-red-600 transition-colors font-medium">Terms & Conditions</Link>
        </div>
        <p className="font-semibold text-[11px]">© {new Date().getFullYear()} Aaj Ka Mudda.</p>
      </div>

    </div>
  );
};

export default RightSidebar;