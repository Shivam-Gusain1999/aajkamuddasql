import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import api from '../assets/api';
import { useUser } from './admin/UserContext';
import RightSidebar from './RightSidebar';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';

const NewsDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useUser();
    const { state } = useLocation();
    
    const [article, setArticle] = useState(state || null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(!state);
    const [relatedNews, setRelatedNews] = useState([]);

    // ── SCROLL TO TOP on every article change ──
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    // ── FETCH ARTICLE (only if not provided via Router state) ──
    useEffect(() => {
        const fetchArticle = async () => {
            if (!state) {
                try {
                    const { data } = await api.get(`/articles/${slug}`);
                    setArticle(data.data);
                } catch(err) {
                    console.error("Failed to fetch article", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        if (slug) fetchArticle();
    }, [slug, state]);

    // ── ALWAYS FETCH COMMENTS when article is available ──
    useEffect(() => {
        const fetchComments = async () => {
            if (!article?._id) return;
            try {
                const { data } = await api.get(`/comments/article/${article._id}`);
                setComments(data.data || []);
            } catch (err) {
                console.error("Failed to fetch comments", err);
            }
        };
        fetchComments();
    }, [article?._id]);

    // ── FETCH RELATED NEWS from same category ──
    useEffect(() => {
        const fetchRelated = async () => {
            if (!article?.category?.name) return;
            try {
                const { data } = await api.get(`/articles?category=${article.category.name}&limit=5`);
                const articles = data.data?.articles || [];
                // Filter out the current article
                setRelatedNews(articles.filter(a => a._id !== article._id).slice(0, 4));
            } catch (err) {
                console.error("Failed to fetch related news", err);
            }
        };
        fetchRelated();
    }, [article?.category?.name, article?._id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const { data } = await api.post(`/comments/${article._id}`, { content: newComment });
            setComments(prev => [data.data, ...prev]);
            setNewComment("");
        } catch (err) {
            console.error("Failed to post comment", err);
            if (err.response?.status === 401) {
                alert("Please login to comment.");
                navigate('/login');
            } else {
                alert("Failed to submit comment.");
            }
        }
    };

    const timeAgo = (d) => {
        if (!d) return '';
        const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
        if (mins < 60) return `${mins} मिनट पहले`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs} घंटे पहले`;
        return `${Math.floor(hrs / 24)} दिन पहले`;
    };

    if (loading) return <div className='p-4 text-center mt-10'>Loading article...</div>;
    if (!article) return <div className='p-4 text-center mt-10'>Article not found</div>;

    const isExternal = !article._id;
    const metaDescription = article.content ? article.content.replace(/<[^>]*>?/gm, '').substring(0, 155) + '...' : article.title;

    return (
        <div className="bg-gray-100 min-h-screen">
            <Helmet>
                <title>{article.title} | Aaj Ka Mudda</title>
                <meta name="description" content={metaDescription} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={metaDescription} />
                {article.thumbnail && <meta property="og:image" content={article.thumbnail} />}
                <meta property="og:type" content="article" />
            </Helmet>
            <div className="max-w-7xl mx-auto px-2 md:px-4 py-4">
                <div className="flex flex-col lg:flex-row gap-5">
                    
                    {/* ── MAIN CONTENT (70%) ── */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            {/* Back Button */}
                            <div className="px-5 pt-5">
                                <button onClick={() => navigate(-1)} className='text-red-600 font-semibold hover:underline text-sm'>
                                    &larr; वापस जाएं
                                </button>
                            </div>

                            {/* Article Image */}
                            {(article.thumbnail || article.image || article.urlToImage) && (
                                <div className="px-5 pt-4">
                                    <img
                                        src={article.thumbnail || article.image || article.urlToImage}
                                        alt={article.title}
                                        className="w-full max-h-[480px] object-cover rounded-lg shadow-md"
                                    />
                                </div>
                            )}

                            {/* Article Meta */}
                            <div className="p-5">
                                {article.category?.name && (
                                    <span className="bg-red-600 text-white text-xs font-bold uppercase px-2.5 py-1 rounded">
                                        {article.category.name}
                                    </span>
                                )}
                                <h1 className="text-2xl md:text-3xl font-bold mt-3 mb-3 leading-snug text-gray-900">
                                    {article.title}
                                </h1>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-5 border-b border-gray-100">
                                    <span>By: {article.author?.fullName || (typeof article.author === 'string' ? article.author : 'Anonymous')}</span>
                                    <span>•</span>
                                    <span>{new Date(article.createdAt || article.publishedAt || Date.now()).toLocaleDateString()}</span>
                                    {article.views !== undefined && (
                                        <>
                                            <span>•</span>
                                            <span>{article.views} Views</span>
                                        </>
                                    )}
                                </div>

                                <div 
                                    className="text-lg leading-relaxed text-gray-800 prose prose-red max-w-none" 
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content || article.description) }}>
                                </div>

                                {isExternal && article.url && (
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-6 text-red-600 font-semibold hover:underline"
                                    >
                                        Read original source →
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* ── RELATED NEWS SECTION ── */}
                        {relatedNews.length > 0 && (
                            <div className="mt-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900 border-l-4 border-red-600 pl-3">
                                        संबंधित खबरें
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {relatedNews.map((item) => (
                                        <div
                                            key={item._id}
                                            className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition group"
                                            onClick={() => navigate(`/news/${item.slug}`, { state: item })}
                                        >
                                            {item.thumbnail && (
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            )}
                                            <div className="p-3">
                                                {item.category?.name && (
                                                    <span className="text-xs font-bold text-red-600 uppercase">{item.category.name}</span>
                                                )}
                                                <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug mt-1">
                                                    {item.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                                                    <Clock size={12} /><span>{timeAgo(item.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── COMMENTS SECTION ── */}
                        {!isExternal && (
                            <div className="bg-white rounded-lg border border-gray-200 mt-5 p-5">
                                <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                                    💬 टिप्पणियाँ <span className="text-base font-normal text-gray-500">({comments.length})</span>
                                </h2>
                                
                                {currentUser ? (
                                    <form onSubmit={handleCommentSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="अपनी टिप्पणी लिखें..."
                                            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px] resize-none"
                                            required
                                        />
                                        <div className="flex justify-end mt-3">
                                            <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition">
                                                पोस्ट करें
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
                                        <p className="text-gray-600 mb-3">टिप्पणी करने के लिए लॉगिन करें</p>
                                        <button onClick={() => navigate('/login')} className="bg-gray-800 text-white px-5 py-2 rounded-md hover:bg-black transition">
                                            लॉगिन करें
                                        </button>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {comments.length === 0 ? (
                                        <p className="text-gray-500 italic text-center py-6">अभी कोई टिप्पणी नहीं है। पहले टिप्पणी करें!</p>
                                    ) : (
                                        comments.map((comment, idx) => (
                                            <div key={comment._id || idx} className="flex gap-3">
                                                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">
                                                    {comment.author?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="bg-gray-50 px-4 py-3 rounded-xl rounded-tl-sm border border-gray-100">
                                                        <div className="flex items-baseline gap-2 mb-1">
                                                            <span className="font-semibold text-sm text-gray-900">{comment.author?.fullName || 'User'}</span>
                                                            <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                                                        </div>
                                                        <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT SIDEBAR (30%) ── */}
                    <div className="w-full lg:w-80 shrink-0">
                        <RightSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewsDetail;
