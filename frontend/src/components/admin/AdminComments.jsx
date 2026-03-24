import { useState, useEffect } from "react";
import api from "../../assets/api";
import { MessageSquare, Search, Filter, CheckCircle2, XCircle, Trash2, Clock } from "lucide-react";

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // 1. Fetch All Comments for Admin
  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Updated admin route
        const { data } = await api.get("/comments/admin/all");
        setComments(data.data || data || []);
      } catch (err) {
        console.error("Failed to parse comments", err);
      }
    };
    fetchComments();
  }, []);

  // 2. Update Status (Approved, Pending, Rejected)
  const updateStatus = async (id, status) => {
    try {
      // Updated to PATCH and new admin route
      await api.patch(`/comments/admin/${id}/status`, { status });
      setComments((prev) =>
        prev.map((c) => ((c._id || c.id) === id ? { ...c, status } : c))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // 3. Delete Comment
  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      // Updated route to match backend setup
      await api.delete(`/comments/c/${id}`);
      setComments((prev) => prev.filter((c) => (c._id || c.id) !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment");
    }
  };

  // Filtering Logic (Updated to use author.fullName)
  const filteredComments = comments.filter((c) => {
    const matchesFilter = filter === "All" || c.status === filter;
    const userName = c.author?.fullName || "";
    const matchesSearch = userName.toLowerCase().includes(search.toLowerCase()) ||
      c.content?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Comments & Moderation</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Review and manage user interactions</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by user or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 shadow-sm appearance-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-4 px-6 w-1/4">User</th>
                <th className="py-4 px-6 w-2/5">Comment</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredComments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                        <MessageSquare className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-[15px] font-bold text-slate-800">No comments found</p>
                      <p className="text-sm font-medium text-slate-500 mt-1">There are no comments matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredComments.map((comment) => (
                  <tr
                    key={comment._id || comment.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm uppercase shadow-sm">
                          {/* Updated to use author.fullName */}
                          {comment.author?.fullName ? comment.author.fullName.substring(0, 2) : '?'}
                        </div>
                        <div>
                          {/* Updated to use author.fullName */}
                          <span className="font-bold text-slate-900 block leading-tight">{comment.author?.fullName || 'Unknown User'}</span>
                          <span className="text-xs text-slate-500 font-medium">{new Date(comment.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <p className="text-slate-700 font-medium line-clamp-2 max-w-md">
                        {comment.content}
                      </p>
                    </td>

                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${comment.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                          : comment.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200/50"
                            : "bg-red-50 text-red-700 border-red-200/50"
                        }`}>
                        {comment.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                        {comment.status === 'Pending' && <Clock className="w-3 h-3" />}
                        {comment.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                        {comment.status || "Pending"}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {comment.status !== 'Approved' && (
                          <button
                            onClick={() => updateStatus(comment._id || comment.id, "Approved")}
                            className="p-2 text-slate-400 hover:text-emerald-600 bg-white border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 rounded-xl transition-all shadow-sm"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {comment.status !== 'Rejected' && (
                          <button
                            onClick={() => updateStatus(comment._id || comment.id, "Rejected")}
                            className="p-2 text-slate-400 hover:text-amber-600 bg-white border border-slate-200 hover:border-amber-200 hover:bg-amber-50 rounded-xl transition-all shadow-sm"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                        <button
                          onClick={() => deleteComment(comment._id || comment.id)}
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
    </div>
  );
};

export default AdminComments;