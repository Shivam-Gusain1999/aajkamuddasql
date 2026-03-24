import { useState, useEffect } from "react";
import api from "../../assets/api";
import { Settings, Globe, Mail, Search, Share2, CheckCircle2 } from "lucide-react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "Aaj Ka Mudda",
    contactEmail: "admin@timesnews.com",
    seoDescription: "The latest news and updates.",
    facebookUrl: "https://facebook.com",
    twitterUrl: "https://twitter.com",
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        if (data && Object.keys(data).length > 0) {
          setSettings(data);
        }
      } catch (err) {
        console.error("Failed to load settings or endpoint not available yet", err);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    try {
      await api.post("/settings", settings);
      setSuccessMsg("Settings updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to update settings. Please check server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Configure your main application parameters</p>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span className="font-bold text-sm">{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Globe className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-[16px] font-bold text-slate-900">General Information</h2>
          </div>
          
          <div className="p-6 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Site Name</label>
                  <input
                    type="text"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-semibold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="contactEmail"
                      value={settings.contactEmail}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-semibold text-slate-900"
                      required
                    />
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* SEO & Social */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Search className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-[16px] font-bold text-slate-900">SEO & Social Links</h2>
          </div>
          
          <div className="p-6 space-y-6">
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">SEO Description / Meta Tag</label>
                <textarea
                  name="seoDescription"
                  rows="3"
                  value={settings.seoDescription}
                  onChange={handleChange}
                  placeholder="Brief description for search engines..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800 resize-none"
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Facebook Page URL</label>
                  <div className="relative">
                    <Share2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      name="facebookUrl"
                      value={settings.facebookUrl}
                      onChange={handleChange}
                      placeholder="https://facebook.com/yourpage"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Twitter Profile URL</label>
                  <div className="relative">
                    <Share2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      name="twitterUrl"
                      value={settings.twitterUrl}
                      onChange={handleChange}
                      placeholder="https://twitter.com/yourhandle"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Advanced Systems */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <Settings className="w-4 h-4 text-orange-600" />
            </div>
            <h2 className="text-[16px] font-bold text-slate-900">System Preferences</h2>
          </div>
          
          <div className="p-6">
            <label className="flex items-center gap-4 cursor-pointer group w-fit">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500 transition-colors"></div>
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block group-hover:text-orange-600 transition-colors">Enable Maintenance Mode</span>
                <span className="text-xs text-slate-500 font-medium mt-0.5 block">Hide public access while performing upgrades.</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
           <button
             type="submit"
             disabled={loading}
             className="px-8 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 disabled:opacity-50 active:scale-[0.98] flex items-center gap-2"
           >
             <CheckCircle2 className="w-4 h-4" />
             {loading ? "Saving Changes..." : "Save Preferences"}
           </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
