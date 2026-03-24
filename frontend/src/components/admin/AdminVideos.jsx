import { useState, useEffect } from "react";
import api from "../../assets/api";
import { Plus, Edit2, Trash2, Video, X, Search, Youtube, Play, CheckCircle2, Pin } from "lucide-react";

const AdminVideos = () => {
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    videoUrl: "",
    status: "DRAFT"
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await api.get("/videos");
        const videoList = data.data?.videos || data.data || [];
        setVideos(Array.isArray(videoList) ? videoList : []);
      } catch (err) {
        console.error("Failed to fetch videos", err);
      }
    };
    fetchVideos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.videoUrl || !formData.category) return;

    const multipartData = new FormData();
    multipartData.append("title", formData.title);
    multipartData.append("description", formData.description);
    multipartData.append("category", formData.category);
    multipartData.append("videoUrl", formData.videoUrl);
    multipartData.append("status", formData.status);
    
    if (thumbnail) {
      multipartData.append("thumbnail", thumbnail);
    }

    try {
      if (editingId) {
        const { data } = await api.patch(`/videos/${editingId}`, multipartData);
        setVideos((prev) =>
          prev.map((v) => (v.id === editingId || v._id === editingId ? data.data || data : v))
        );
      } else {
        const { data } = await api.post("/videos", multipartData);
        setVideos((prev) => [...prev, data.data || data]);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to save video");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      videoUrl: "",
      status: "DRAFT"
    });
    setThumbnail(null);
    setThumbnailPreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (video) => {
    setFormData({
      title: video.title || "",
      description: video.description || "",
      category: video.category?._id || video.category || "",
      videoUrl: video.videoUrl || "",
      status: video.status || "DRAFT"
    });
    setThumbnailPreview(video.thumbnail);
    setThumbnail(null);
    setEditingId(video._id || video.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await api.delete(`/videos/${id}`);
      setVideos((prev) => prev.filter((v) => (v._id || v.id) !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete video");
    }
  };

  const handlePin = async (id) => {
    try {
      await api.patch(`/videos/${id}/top`);
      setVideos((prev) => 
        prev.map((v) => ({
          ...v,
          isTopVideo: (v._id || v.id) === id
        }))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to pin video");
    }
  };

  const filteredVideos = videos.filter(v => 
    v.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Video Content</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage multimedia news and video feeds</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm shadow-blue-200 active:scale-[0.98] text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Video</span>
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Youtube className="w-5 h-5 text-red-600" />
              </div>
              {editingId ? "Edit Video Entry" : "New Video Entry"}
            </h2>
            <button 
              onClick={resetForm} 
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-xl transition-colors border border-transparent hover:border-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Primary Content Column */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Video Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="E.g. Daily News Highlights"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-900 text-sm font-semibold placeholder:text-slate-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">YouTube URL *</label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-900 text-sm font-medium placeholder:text-slate-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Brief Description</label>
                  <textarea
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Summary of the video content..."
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 resize-none font-medium text-sm leading-relaxed"
                  />
                </div>
              </div>
              
              {/* Settings Column */}
              <div className="space-y-6">
                
                {/* Status & Category */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm font-semibold appearance-none cursor-pointer"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm font-semibold appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id || cat.id} value={cat._id || cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Custom Thumbnail</label>
                  
                  <label className="relative flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-all cursor-pointer group overflow-hidden">
                    {thumbnailPreview ? (
                      <>
                        <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                        <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                          <span className="bg-white text-slate-900 font-bold text-xs px-4 py-2 rounded-lg shadow-sm">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                        <Video className="w-8 h-8 text-slate-300 mb-2 group-hover:text-blue-500 transition-colors" />
                        <p className="text-[13px] font-bold text-slate-700">Browse Image</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                  </label>
                  <p className="text-[11px] font-medium text-slate-400 mt-3 text-center">Optional. If empty, tries to fetch from URL.</p>
                </div>

              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-8 border-t border-slate-100 mt-8">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 flex items-center gap-2 active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4" />
                {editingId ? "Update Video" : "Publish Video"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100">
                {filteredVideos.length} Videos
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-4 px-6 w-24">Thumbnail</th>
                  <th className="py-4 px-6 w-1/3">Video Info</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Link</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredVideos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                           <Video className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-[15px] font-bold text-slate-800">No videos found</p>
                        <p className="text-sm font-medium text-slate-500 mt-1 max-w-sm mx-auto">Upload a video or change your search filter.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredVideos.map((video) => (
                    <tr key={video._id || video.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="w-20 h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm relative group">
                          {video.thumbnail ? (
                            <>
                               <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                  <Play className="w-5 h-5 text-white/80" fill="currentColor"/>
                               </div>
                            </>
                          ) : (
                            <Video className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors text-[15px] leading-snug mb-1">
                          {video.title}
                        </p>
                        <p className="text-xs font-medium text-slate-500 line-clamp-1">
                          {video.description || "No description provided."}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center text-sm font-semibold text-slate-700">
                          {video.category?.name || video.category || "Uncategorized"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                          video.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
                          video.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                          'bg-amber-50 text-amber-700 border-amber-200/50'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            video.status === 'PUBLISHED' ? 'bg-emerald-500' : 
                            video.status === 'ARCHIVED' ? 'bg-slate-400' : 'bg-amber-500'
                          }`}></span>
                          {video.status || "DRAFT"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <a 
                          href={video.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 font-semibold text-sm hover:underline"
                        >
                          Watch URL
                        </a>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className={`flex items-center justify-end gap-2 transition-opacity ${video.isTopVideo ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          <button 
                            onClick={() => handlePin(video._id || video.id)}
                            className={`p-2 rounded-xl transition-all shadow-sm border ${video.isTopVideo ? 'text-amber-500 bg-amber-50 border-amber-200' : 'text-slate-400 hover:text-amber-500 bg-white border-slate-200 hover:border-amber-200 hover:bg-amber-50'}`}
                            title={video.isTopVideo ? "Pinned to Top News" : "Pin to Top News"}
                          >
                            <Pin className="w-4 h-4" fill={video.isTopVideo ? "currentColor" : "none"} />
                          </button>
                          <button 
                            onClick={() => handleEdit(video)}
                            className="p-2 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(video._id || video.id)}
                            className="p-2 text-slate-400 hover:text-red-600 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVideos;
