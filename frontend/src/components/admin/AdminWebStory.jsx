import { useState, useEffect } from "react";
import api from "../../assets/api";
import { Plus, Edit2, Trash2, X, Search, BookOpen, CheckCircle2, Image as ImageIcon } from "lucide-react";

const AdminWebStories = () => {
  const [categories, setCategories] = useState([]);
  const [stories, setStories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    status: "DRAFT",
    articleUrl: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

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
    const fetchStories = async () => {
      try {
        const { data } = await api.get("/webstories");
        setStories(data.data || data || []);
      } catch (err) {
        console.error("Failed to fetch web stories", err);
      }
    };
    fetchStories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category) return;

    const multipartData = new FormData();
    multipartData.append("title", formData.title);
    multipartData.append("category", formData.category);
    multipartData.append("status", formData.status);
    if (formData.articleUrl) multipartData.append("articleUrl", formData.articleUrl);
    
    if (image) {
      multipartData.append("image", image);
    }

    try {
      if (editingId) {
        const { data } = await api.patch(`/webstories/${editingId}`, multipartData);
        setStories((prev) =>
          prev.map((story) =>
            story.id === editingId || story._id === editingId ? data.data || data : story
          )
        );
      } else {
        const { data } = await api.post("/webstories", multipartData);
        setStories((prev) => [...prev, data.data || data]);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to save web story");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      status: "DRAFT",
      articleUrl: ""
    });
    setImage(null);
    setPreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (story) => {
    setFormData({
      title: story.title || "",
      category: story.category?._id || story.category || "",
      status: story.status || "DRAFT",
      articleUrl: story.articleUrl || ""
    });
    setPreview(story.image || story.preview);
    setImage(null);
    setEditingId(story._id || story.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await api.delete(`/webstories/${id}`);
      setStories((prev) => prev.filter((story) => (story._id || story.id) !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete web story");
    }
  };

  const filteredStories = stories.filter(s => 
    s.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Web Stories</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage vertical, visual stories for mobile</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm shadow-blue-200 active:scale-[0.98] text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Story</span>
          </button>
        )}
      </div>

      {/* FORM SECTION */}
      {showForm ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-orange-600" />
              </div>
              {editingId ? "Edit Web Story" : "New Web Story"}
            </h2>
            <button 
              onClick={resetForm} 
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-xl transition-colors border border-transparent hover:border-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Story Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="E.g. Top 10 Tech Trends"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-900 text-sm font-semibold placeholder:text-slate-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Article Link (Optional)</label>
                  <input
                    type="url"
                    name="articleUrl"
                    value={formData.articleUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/news/tech"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-900 text-sm font-semibold placeholder:text-slate-400"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm font-semibold appearance-none cursor-pointer"
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
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm font-semibold appearance-none cursor-pointer"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Cover Image Upload (Portrait) */}
              <div className="flex flex-col items-center">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 w-full max-w-[200px] text-center">Story Cover (Portrait)</label>
                <label className="relative flex flex-col items-center justify-center w-[200px] h-[300px] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-all cursor-pointer group overflow-hidden shadow-sm">
                  {preview ? (
                    <>
                      <img src={preview} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                      <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <span className="bg-white text-slate-900 font-bold text-xs px-4 py-2 rounded-lg shadow-sm">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                      <ImageIcon className="w-10 h-10 text-slate-300 mb-3 group-hover:text-blue-500 transition-colors" />
                      <p className="text-[13px] font-bold text-slate-700">Upload Cover</p>
                      <p className="text-[11px] font-medium text-slate-400 mt-1 flex flex-col">
                        <span>9:16 Ratio</span>
                      </p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-8 border-t border-slate-100">
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
                {editingId ? "Update Story" : "Publish Story"}
              </button>
            </div>
          </form>
        </div>
      ) : (

        /* TABLE SECTION */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search web stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100">
                {filteredStories.length} Stories
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-4 px-6 w-16">Cover</th>
                  <th className="py-4 px-6 w-1/3">Story Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStories.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                           <BookOpen className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-[15px] font-bold text-slate-800">No web stories found</p>
                        <p className="text-sm font-medium text-slate-500 mt-1 max-w-sm mx-auto">Click "Create Story" to publish your first mobile web story.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStories.map((story) => (
                    <tr key={story._id || story.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3 px-6">
                        <div className="w-10 h-16 rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                          {(story.image || story.preview) ? (
                            <img src={story.image || story.preview} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors text-[15px] leading-snug">
                          {story.title}
                        </p>
                      </td>
                      <td className="py-3 px-6">
                        <span className="inline-flex items-center text-sm font-semibold text-slate-700">
                          {story.category?.name || story.category || "Uncategorized"}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                          story.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
                          story.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                          'bg-amber-50 text-amber-700 border-amber-200/50'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            story.status === 'PUBLISHED' ? 'bg-emerald-500' : 
                            story.status === 'ARCHIVED' ? 'bg-slate-400' : 'bg-amber-500'
                          }`}></span>
                          {story.status || "DRAFT"}
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-sm font-semibold text-slate-700">
                           {new Date(story.createdAt || story.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(story)}
                            className="p-2 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(story._id || story.id)}
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

export default AdminWebStories;
