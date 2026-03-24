import { useState, useEffect } from "react";
import api from "../../assets/api";
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Search, FileText, UploadCloud, CheckCircle2, Settings2 } from "lucide-react";

const AdminNews = () => {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    status: "DRAFT",
    thumbnail: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await api.get('/articles');
        setArticles(data.data?.articles || []);
      } catch (err) {
        console.error("Failed to fetch articles", err);
      }
    };
    fetchArticles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.content) return;

    const multipartData = new FormData();
    multipartData.append("title", formData.title);
    multipartData.append("content", formData.content);
    multipartData.append("category", formData.category);
    multipartData.append("status", formData.status);
    if (formData.thumbnail) {
      multipartData.append("thumbnail", formData.thumbnail);
    }

    try {
      if (editingId) {
        const { data } = await api.patch(`/articles/${editingId}`, multipartData);
        setArticles((prev) =>
          prev.map((a) => (a.id === editingId || a._id === editingId ? data.data || data : a))
        );
      } else {
        const { data } = await api.post('/articles', multipartData);
        setArticles((prev) => [...prev, data.data || data]);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to save article");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "",
      status: "DRAFT",
      thumbnail: null,
    });
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (article) => {
    setFormData({
      title: article.title || "",
      content: article.content || "",
      category: article.category?._id || article.category || "",
      status: article.status || "DRAFT",
      thumbnail: null,
    });
    setImagePreview(article.thumbnail || article.image);
    setEditingId(article._id || article.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await api.delete(`/articles/${id}`);
      setArticles((prev) => prev.filter((a) => (a._id || a.id) !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete article");
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Articles</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage and publish news content</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm shadow-blue-200 active:scale-[0.98] text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              {editingId ? "Edit Article" : "New Article"}
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
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Article Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter an engaging title"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-900 text-sm font-semibold placeholder:text-slate-400 placeholder:font-medium"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Content *</label>
                  <textarea
                    name="content"
                    rows="16"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your article content here..."
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 resize-none font-medium text-sm leading-relaxed"
                    required
                  />
                </div>
              </div>
              
              {/* Settings Column */}
              <div className="space-y-6">
                
                {/* Status & Category */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2 text-[15px]">
                    <Settings2 className="w-4 h-4 text-slate-400" />
                    Publishing Setting
                  </h3>
                  
                  <div className="space-y-5">
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
                </div>

                {/* Featured Image */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <label className="block text-[15px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                    Cover Image
                  </label>
                  
                  <label className="relative flex flex-col items-center justify-center w-full min-h-[180px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100/50 hover:border-blue-400 transition-all cursor-pointer group overflow-hidden">
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                        <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                          <span className="bg-white text-slate-900 font-bold text-xs px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                            <UploadCloud className="w-4 h-4"/> Replace
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform">
                          <UploadCloud className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">Click to browse file</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">Supported: JPG, PNG (Max 5MB)</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
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
                {editingId ? "Save Changes" : "Publish Article"}
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
                placeholder="Search articles by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100">
                Total {filteredArticles.length} Entries
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-4 px-6 w-20">Cover</th>
                  <th className="py-4 px-6 w-1/3">Title & Summary</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Published</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                           <FileText className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-[15px] font-bold text-slate-800">No articles found</p>
                        <p className="text-sm font-medium text-slate-500 mt-1 max-w-sm mx-auto">Try adjusting your search criteria or create a new article to get started.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr key={article._id || article.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                          {(article.thumbnail || article.image) ? (
                            <img src={article.thumbnail || article.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors text-[15px] leading-snug mb-1">
                          {article.title}
                        </p>
                        <p className="text-xs font-medium text-slate-500 line-clamp-1">
                          {article.content?.replace(/<[^>]*>?/gm, '').substring(0, 80) || "No content"}...
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center text-sm font-semibold text-slate-700">
                          {article.category?.name || article.category || "Uncategorized"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                          article.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
                          article.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                          'bg-amber-50 text-amber-700 border-amber-200/50'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            article.status === 'PUBLISHED' ? 'bg-emerald-500' : 
                            article.status === 'ARCHIVED' ? 'bg-slate-400' : 'bg-amber-500'
                          }`}></span>
                          {article.status || "DRAFT"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                         <p className="text-sm font-semibold text-slate-700">
                           {new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                         </p>
                         <p className="text-xs font-medium text-slate-400 mt-0.5">
                           {new Date(article.createdAt || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                         </p>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(article)}
                            className="p-2 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(article._id || article.id)}
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

export default AdminNews;
