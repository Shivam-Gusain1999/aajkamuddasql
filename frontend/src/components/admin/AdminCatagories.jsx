import { useState, useEffect } from "react";
import api from "../../assets/api";
import { Plus, Edit2, Trash2, List, Settings2, Trash, Check, X } from "lucide-react";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (!editingId && categories.some((c) => c.name.toLowerCase() === name.trim().toLowerCase())) {
      alert("Category already exists");
      return;
    }

    try {
      if (editingId) {
        const { data } = await api.put(`/categories/${editingId}`, { name: name.trim() });
        setCategories((prev) =>
          prev.map((c) => (c._id === editingId || c.id === editingId ? data.data || data : c))
        );
        setEditingId(null);
      } else {
        const { data } = await api.post("/categories", { name: name.trim() });
        setCategories((prev) => [...prev, data.data || data]);
      }
      setName("");
    } catch (err) {
      console.error(err);
      alert("Failed to save category");
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setEditingId(cat._id || cat.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => (c._id || c.id) !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
    }
  };

  const cancelEdit = () => {
    setName("");
    setEditingId(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Categories</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Organize your content effectively</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="md:col-span-1 h-fit">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Settings2 className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-[16px] font-bold text-slate-900">{editingId ? "Edit Category" : "Add New Category"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Technology"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-colors shadow-sm shadow-blue-200 text-sm"
                >
                  {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingId ? "Save Changes" : "Create"}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={cancelEdit}
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
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-3">
                 <h2 className="text-[16px] font-bold text-slate-900">All Categories</h2>
               </div>
               <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{categories.length} Total</span>
            </div>
            
            <div className="p-0">
              {categories.length === 0 ? (
                <div className="py-16 text-center text-slate-500 flex flex-col items-center">
                  <List className="w-12 h-12 text-slate-200 mb-4" />
                  <p className="text-sm font-medium">No categories created yet.</p>
                  <p className="text-xs mt-1 text-slate-400">Use the form to add your first category.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {categories.map((cat) => (
                    <li
                      key={cat._id || cat.id}
                      className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm uppercase shadow-sm">
                          {cat.name.substring(0,2)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 text-[15px]">{cat.name}</span>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">ID: {cat._id || cat.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id || cat.id)}
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

export default AdminCategories;
