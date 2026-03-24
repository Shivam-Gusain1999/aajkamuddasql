import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TrendingUp, Clock, ChevronRight, Loader2, Play } from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";
import api from "../assets/api";

const NewsSection = () => {
  const navigate = useNavigate();
  const { categoryName } = useParams();

  // ── STATES ──
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]); // 🚀 MASTERSTROKE: Only a single Video State
  const [ad, setAd] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [current, setCurrent] = useState(0);

  // ── 1. RESET STATE ON CATEGORY CHANGE + SCROLL TO TOP ──
  useEffect(() => {
    setArticles([]);
    setVideos([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryName]);

  // Fetch Ad
  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await api.get('/ads?activeOnly=true&placement=feed');
        const adsList = res.data?.data?.ads || [];
        if (adsList.length > 0) {
          setAd(adsList[Math.floor(Math.random() * adsList.length)]);
        }
      } catch (error) {
        console.error("Failed to fetch ad", error);
      }
    };
    fetchAd();
  }, []);

  // ── 2. FETCH DATA FUNCTION ──
  useEffect(() => {
    const fetchData = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        let articleApiUrl = `/articles?page=${page}&limit=10`;
        let videoApiUrl = `/videos?status=PUBLISHED&page=${page}&limit=10`;

        if (categoryName) {
          articleApiUrl += `&category=${categoryName}`;
          videoApiUrl += `&category=${categoryName}`;
        }

        const [articlesRes, videosRes] = await Promise.all([
          api.get(articleApiUrl),
          api.get(videoApiUrl)
        ]);

        const newArticles = articlesRes.data?.data?.articles || [];
        const newVideos = videosRes.data?.data?.videos || [];

        // Articles append logic
        setArticles(prev => {
          if (page === 1) return newArticles;
          const existingIds = new Set(prev.map(a => a._id));
          return [...prev, ...newArticles.filter(a => !existingIds.has(a._id))];
        });

        // Videos append logic (All videos are gathered in one place)
        setVideos(prev => {
          if (page === 1) return newVideos;
          const existingIds = new Set(prev.map(v => v._id));
          return [...prev, ...newVideos.filter(v => !existingIds.has(v._id))];
        });

        setHasMore(articlesRes.data?.data?.pagination?.hasNextPage || false);

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchData();
  }, [categoryName, page]);

  // ── 3. THE SPY (INTERSECTION OBSERVER) ──
  const observer = useRef();
  const lastArticleElementRef = useCallback(node => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore]);

  // ── HELPER FUNCTIONS ──
  const trending = articles.slice(0, 6);

  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => setCurrent(prev => (prev + 1) % trending.length), 3500);
    return () => clearInterval(interval);
  }, [trending.length]);

  const getYtId = (url) => {
    const m = url?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return m && m[2].length === 11 ? m[2] : null;
  };

  const getEmbedUrl = (url) => {
    const id = getYtId(url);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1` : url;
  };

  const timeAgo = (d) => {
    if (!d) return '';
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 60) return `${mins} मिनट पहले`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} घंटे पहले`;
    return `${Math.floor(hrs / 24)} दिन पहले`;
  };

  const strip = (h) => h ? h.replace(/<[^>]*>?/gm, '').substring(0, 200) : '';

  // ── RENDER ──
  if (loading && page === 1) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      <span className="ml-3 text-gray-500 text-lg">लोड हो रहा है...</span>
    </div>
  );

  if (!articles.length && !videos.length) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-600">
        {categoryName ? `"${decodeURIComponent(categoryName)}" में कोई खबर नहीं` : 'अभी कोई समाचार नहीं है'}
      </h2>
      <p className="text-gray-400 mt-2 text-lg">कृपया बाद में देखें।</p>
    </div>
  );

  // 🚀 SLICING LOGIC (NO DUPLICATES)
  const heroVideo = videos[0]; // 1st video
  const restVideos = videos.slice(1, 5); // 2nd to 5th video (for grid)
  const feedVideos = videos.slice(5); // 6th video onwards (ONLY FOR FEED)

  const heroArticle = articles[0]; // 1st article
  const restArticles = articles.slice(1); // 2nd article onwards (for feed)

  return (
    <div className="space-y-6">

      {/* ── 1. TRENDING TICKER ── */}
      {trending.length > 0 && (
        <div className="flex items-center bg-white border border-gray-200 rounded overflow-hidden">
          <div className="bg-red-600 text-white px-4 py-2.5 font-bold text-sm flex items-center gap-1.5 shrink-0">
            <TrendingUp size={16} /> ट्रेंडिंग
          </div>
          <div className="relative h-6 overflow-hidden flex-1 px-4">
            <div className="absolute transition-transform duration-500 w-full"
              style={{ transform: `translateY(-${current * 24}px)` }}>
              {trending.map((item, i) => (
                <div key={item._id || i}
                  className="h-6 text-base text-gray-800 font-medium whitespace-nowrap truncate cursor-pointer hover:text-red-600"
                  onClick={() => navigate(`/news/${item.slug}`)}>
                  {item.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 2. HERO VIDEO ── */}
      {heroVideo && (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <div className="aspect-video bg-black">
            <iframe className="w-full h-full" src={getEmbedUrl(heroVideo.videoUrl)}
              title={heroVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
          </div>
          <div className="p-4 border-t border-gray-100">
            {heroVideo.category?.name && (
              <span className="text-sm font-bold text-red-600 uppercase">{heroVideo.category.name}</span>
            )}
            <h2 className="font-bold text-xl text-gray-900 mt-1 leading-snug">{heroVideo.title}</h2>
          </div>
        </div>
      )}

      {/* ── 3. FEATURED ARTICLE ── */}
      {heroArticle && (
        <div className="bg-white border border-gray-200 rounded overflow-hidden cursor-pointer hover:shadow transition"
          onClick={() => navigate(`/news/${heroArticle.slug}`, { state: heroArticle })}>
          {heroArticle.thumbnail ? (
            <div className="relative">
              <img src={heroArticle.thumbnail} alt={heroArticle.title}
                className="w-full aspect-[2/1] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                {heroArticle.category?.name && (
                  <span className="bg-red-600 text-white text-xs font-bold uppercase px-2.5 py-1 rounded">{heroArticle.category.name}</span>
                )}
                <h1 className="text-white font-bold text-2xl leading-tight mt-2 line-clamp-2">{heroArticle.title}</h1>
              </div>
            </div>
          ) : (
            <div className="p-5">
              <h1 className="font-bold text-2xl text-gray-900 mt-1">{heroArticle.title}</h1>
            </div>
          )}
        </div>
      )}

      {/* ── AD 1 ── */}
      <div className="bg-gray-50 border border-gray-200 rounded text-center flex flex-col items-center justify-center overflow-hidden">
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1 mt-2">विज्ञापन</span>
        {ad ? (
          ad.type === 'script' ? (
            <div className="w-full overflow-hidden flex justify-center items-center my-2" dangerouslySetInnerHTML={{ __html: ad.scriptCode }} />
          ) : (
            <a href={ad.link} target="_blank" rel="noreferrer" className="block w-full h-32 md:h-48 bg-gray-50 flex items-center justify-center p-2">
              <img src={ad.imageUrl} alt={ad.title} className="max-w-full max-h-full object-contain hover:opacity-90 transition-opacity rounded" />
            </a>
          )
        ) : (
          <div className="w-full h-24 flex items-center justify-center">
            <span className="text-gray-400 text-sm font-medium">Ad Space</span>
          </div>
        )}
      </div>

      {/* ── 4. TOP VIDEO GRID ── */}
      {restVideos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-red-600 pl-3 flex items-center gap-2">
              <Play size={18} className="text-red-600" fill="currentColor" /> वीडियो
            </h2>
            <button onClick={() => navigate('/videos')}
              className="text-sm text-red-600 font-bold hover:underline flex items-center">
              और देखें <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {restVideos.map(video => {
              const ytId = getYtId(video.videoUrl);
              const thumb = video.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null);
              return (
                <div key={video._id}
                  className="bg-white border border-gray-200 rounded overflow-hidden cursor-pointer hover:shadow transition group"
                  onClick={() => window.open(video.videoUrl, '_blank')}>
                  <div className="relative aspect-video bg-gray-200 overflow-hidden">
                    {thumb ? (
                      <img src={thumb} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Play size={32} className="text-white" fill="white" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 bg-red-600/90 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:scale-110 transition-all shadow-lg">
                        <Play size={20} className="text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <h4 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug">{video.title}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 5. INFINITE SCROLL ARTICLES (WITH NATIVE VIDEO UI) ── */}
      {restArticles.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 border-l-4 border-orange-500 pl-3 mb-4">
            {categoryName ? decodeURIComponent(categoryName) : 'ताज़ा खबरें'}
          </h2>
          <div className="divide-y divide-gray-100 bg-white border border-gray-200 rounded overflow-hidden">

            {restArticles.map((item, index) => {
              const isLastElement = restArticles.length === index + 1;
              const shouldShowVideo = (index + 1) % 3 === 0;
              const videoIndex = Math.floor(index / 3);
              const videoToRender = feedVideos[videoIndex];

              return (
                <React.Fragment key={item._id || index}>
                  {/* -- ARTICLE ROW -- */}
                  <div
                    ref={isLastElement ? lastArticleElementRef : null}
                    onClick={() => navigate(`/news/${item.slug}`, { state: item })}
                    className="flex gap-4 p-4 hover:bg-gray-50 transition cursor-pointer"
                  >
                    {item.thumbnail && (
                      <img src={item.thumbnail} alt={item.title} className="w-36 h-24 md:w-44 md:h-28 object-cover rounded flex-shrink-0" loading="lazy" decoding="async" />
                    )}
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        {item.category?.name && (
                          <span className="text-xs font-bold text-red-600 uppercase">{item.category.name}</span>
                        )}
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 leading-snug mt-1">{item.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2 hidden md:block">{strip(item.content)}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                        <Clock size={12} /><span>{timeAgo(item.createdAt)}</span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 self-center hidden md:block" />
                  </div>

                  {/* -- INJECTED VIDEO ROW (ARTICLE FORMAT) -- */}
                  {shouldShowVideo && videoToRender && (() => {
                    const ytId = getYtId(videoToRender.videoUrl);
                    const thumb = videoToRender.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null);

                    return (
                      <div
                        className="flex gap-4 p-4 bg-red-50 hover:bg-red-100 transition cursor-pointer"
                        onClick={() => window.open(videoToRender.videoUrl, '_blank')}
                      >
                        {/* 🚀 IMAGE WITH PLAY BUTTON OVERLAY */}
                        <div className="relative w-36 h-24 md:w-44 md:h-28 flex-shrink-0">
                          {thumb ? (
                            <img src={thumb} alt={videoToRender.title} className="w-full h-full object-cover rounded" loading="lazy" decoding="async" />
                          ) : (
                            <div className="w-full h-full bg-gray-800 rounded" />
                          )}
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded transition hover:bg-black/10">
                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                              <Play size={20} fill="white" className="text-white ml-1" />
                            </div>
                          </div>
                        </div>

                        {/* TEXT CONTENT EXTACTLY LIKE ARTICLE */}
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div>
                            <span className="text-xs font-bold text-red-600 uppercase flex items-center gap-1">
                              <Play size={12} fill="currentColor" /> सुझाई गई वीडियो
                            </span>
                            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 leading-snug mt-1">{videoToRender.title}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2 hidden md:block">{videoToRender.description || 'वीडियो देखने के लिए क्लिक करें'}</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                            <Clock size={12} /><span>{timeAgo(videoToRender.createdAt)}</span>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-red-300 self-center hidden md:block" />
                      </div>
                    );
                  })()}
                </React.Fragment>
              );
            })}
          </div>

          {/* LOAD MORE SPINNER */}
          {loadingMore && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
            </div>
          )}

          {/* END OF LIST MESSAGE */}
          {!hasMore && restArticles.length > 0 && (
            <div className="text-center py-8 text-gray-500 font-medium bg-gray-50 rounded-b-lg border border-t-0 border-gray-200">
              आपने सारी खबरें पढ़ ली हैं! 📰
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsSection;