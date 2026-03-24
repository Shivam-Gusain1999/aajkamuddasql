import { useState, useEffect } from "react";
import api from "../../assets/api";
import { UploadCloud, Trash2, Image as ImageIcon, Search } from "lucide-react";

const AdminMedia = () => {
  const [media, setMedia] = useState([]);
  const [preview, setPreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const { data } = await api.get("/media");
        setMedia(data.data || data || []);
      } catch (err) {
        console.error("Failed to load media", err);
      }
    };
    fetchMedia();
  }, []);

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const { data } = await api.post("/media", {
          name: file.name,
          url: reader.result,
        });
        setMedia((prev) => [data.data || data, ...prev]);
        setPreview(null);
        // clear input
        document.getElementById("mediaUpload").value = '';
      } catch (err) {
        console.error(err);
        alert("Failed to upload media");
      }
    };
    reader.readAsDataURL(file);
  };

  const deleteMedia = async (id) => {
    if (!window.confirm("Delete this media file entirely?")) return;
    try {
      await api.delete(`/media/${id}`);
      setMedia((prev) => prev.filter((m) => (m._id || m.id) !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete media");
    }
  };

  const filteredMedia = media.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Media Library</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage all uploaded images and assets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Upload Box Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 text-[15px]">Upload New Media</h3>

            <label
              htmlFor="mediaUpload"
              className="relative flex flex-col items-center justify-center w-full min-h-[220px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100/80 hover:border-blue-400 transition-all cursor-pointer group overflow-hidden"
            >
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-sm">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleUpload(document.getElementById("mediaUpload").files[0]);
                      }}
                      className="bg-blue-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
                    >
                      Confirm Upload
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform">
                    <UploadCloud className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-[15px] font-bold text-slate-800">Click to browse file</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">JPG, PNG, GIF up to 10MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setPreview(URL.createObjectURL(file));
                }}
                className="hidden"
                id="mediaUpload"
              />
            </label>
            {preview && (
              <button
                onClick={() => setPreview(null)}
                className="mt-3 w-full py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancel Selection
              </button>
            )}
          </div>
        </div>

        {/* Media Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">

            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search media files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400 shadow-sm"
                />
              </div>
              <span className="text-xs font-bold text-slate-500">{filteredMedia.length} files</span>
            </div>

            <div className="p-6">
              {filteredMedia.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-[15px] font-bold text-slate-800">No media found</p>
                  <p className="text-sm font-medium text-slate-500 mt-1">Upload an image to populate the library.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredMedia.map((item) => (
                    <div
                      key={item._id || item.id}
                      className="group relative bg-slate-50 rounded-xl overflow-hidden border border-slate-200 aspect-square hover:border-blue-300 transition-all"
                    >
                      <img
                        src={item.url || item.image || item.thumbnail}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                        <div className="flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMedia(item._id || item.id);
                            }}
                            className="p-1.5 bg-white/20 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white truncate drop-shadow-md pb-1">{item.name || 'Image File'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMedia;
