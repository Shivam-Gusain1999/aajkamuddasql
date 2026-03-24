import { useState, useEffect, useRef } from "react";
import api from "../../assets/api";
import { Plus, Edit2, Trash2, List, Settings2, Trash, Check, X, Image as ImageIcon, Link } from "lucide-react";

const AdminAds = () => {
  const [ads, setAds] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("banner");
  const [placement, setPlacement] = useState("both");
  const [scriptCode, setScriptCode] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const { data } = await api.get("/ads");
      setAds(data.data.ads || []);
    } catch (err) {
      console.error("Failed to fetch ads", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    if (type === 'banner') {
      if (!link.trim()) return;
      if (!editingId && !image) {
        alert("Please select an image for the banner ad.");
        return;
      }
    } else {
      if (!scriptCode.trim()) {
        alert("Please enter the custom script code.");
        return;
      }
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("type", type);
    formData.append("placement", placement);
    formData.append("isActive", isActive);
    
    if (type === 'banner') {
      formData.append("link", link.trim());
      if (image) formData.append("image", image);
    } else {
      formData.append("scriptCode", scriptCode.trim());
    }

    try {
      if (editingId) {
        await api.patch(`/ads/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setEditingId(null);
      } else {
        await api.post("/ads", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      resetForm();
      fetchAds();
    } catch (err) {
      console.error(err);
      alert("Failed to save ad");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ad) => {
    setTitle(ad.title);
    setType(ad.type || 'banner');
    setPlacement(ad.placement || 'both');
    setLink(ad.link || "");
    setScriptCode(ad.scriptCode || "");
    setIsActive(ad.isActive);
    setEditingId(ad._id);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ad?")) return;
    try {
      await api.delete(`/ads/${id}`);
      setAds((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete ad");
    }
  };

  const toggleActive = async (ad) => {
    try {
      await api.patch(`/ads/${ad._id}`, { isActive: !ad.isActive });
      fetchAds();
    } catch (err) {
      console.error(err);
      alert("Failed to toggle status");
    }
  };

  const resetForm = () => {
    setTitle("");
    setType("banner");
    setPlacement("both");
    setLink("");
    setScriptCode("");
    setImage(null);
    setIsActive(true);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Advertisement Management</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Manage sidebar and banner ads for your website</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="xl:col-span-1 h-fit">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Settings2 className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-[16px] font-bold text-slate-900">{editingId ? "Edit Ad" : "Add New Ad"}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ad Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Summer Sale 2026"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Location (Placement)</label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800"
                >
                  <option value="both">Everywhere (Sidebar & News Feed)</option>
                  <option value="sidebar">Right Sidebar Only</option>
                  <option value="feed">Main News Feed Only</option>
                </select>
              </div>

              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                  <input type="radio" checked={type === 'banner'} onChange={() => setType('banner')} className="text-blue-600 focus:ring-blue-500" />
                  Banner Image
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                  <input type="radio" checked={type === 'script'} onChange={() => setType('script')} className="text-blue-600 focus:ring-blue-500" />
                  Custom Script (HTML/JS)
                </label>
              </div>

              {type === 'banner' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target URL (Link) *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <Link className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full pl-10 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
                        required={type === 'banner'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ad Image {editingId ? "" : "*"}</label>
                    <div className="relative">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setImage(e.target.files[0])}
                        accept="image/*"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        {...(!editingId && type === 'banner' && { required: true })}
                      />
                    </div>
                    {editingId && <p className="text-[10px] text-slate-500 mt-2">Leave blank to keep existing image</p>}
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Custom Script Code *</label>
                  <textarea
                    value={scriptCode}
                    onChange={(e) => setScriptCode(e.target.value)}
                    placeholder="<script async src='...'></script>"
                    rows={4}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-mono text-slate-800 placeholder:text-slate-400"
                    required={type === 'script'}
                  />
                </div>
              )}

              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 cursor-pointer">
                  Set as Active Ad
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-colors shadow-sm shadow-blue-200 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingId ? "Save Changes" : "Create Ad"}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 py-2.5 rounded-xl font-semibold transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-3">
                 <h2 className="text-[16px] font-bold text-slate-900">Manage Ads</h2>
               </div>
               <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{ads.length} Total</span>
            </div>
            
            <div className="p-0">
              {ads.length === 0 ? (
                <div className="py-16 text-center text-slate-500 flex flex-col items-center">
                  <ImageIcon className="w-12 h-12 text-slate-200 mb-4" />
                  <p className="text-sm font-medium">No ads available.</p>
                  <p className="text-xs mt-1 text-slate-400">Use the form to add your first advertisement.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {ads.map((ad) => (
                    <li
                      key={ad._id}
                      className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center gap-5">
                        {ad.type === 'script' ? (
                           <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-800 flex items-center justify-center font-mono text-[10px] text-green-400 p-2 break-all">
                             {'{ Code }'}
                           </div>
                        ) : (
                           <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                             <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                           </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900 text-[15px]">{ad.title}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${ad.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                              {ad.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">Type: {ad.type === 'script' ? 'Custom Script' : 'Banner Image'}</p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">Location: {ad.placement === 'sidebar' ? 'Right Sidebar' : ad.placement === 'feed' ? 'News Feed' : 'Everywhere'}</p>
                          {ad.type === 'banner' && (
                            <a href={ad.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1 font-medium mt-1 truncate max-w-[200px] md:max-w-md">
                              <Link className="w-3 h-3" /> {ad.link}
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                         <button
                          onClick={() => toggleActive(ad)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${ad.isActive ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'}`}
                        >
                          {ad.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleEdit(ad)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ad._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="Delete"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAds;
