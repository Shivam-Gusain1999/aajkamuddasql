import { useState, useEffect } from "react";
import api from "../../assets/api";
import { ShieldCheck, Plus, Trash2 } from "lucide-react";

const AdminRoles = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [permissions, setPermissions] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data } = await api.get("/roles");
        // Fallback to initial default roles if api data is not available or empty
        if (data && data.length > 0) {
          setRoles(data);
        } else {
          setRoles([
            { _id: 1, name: "Admin", permissions: "All Access" },
            { _id: 2, name: "Editor", permissions: "Manage News & Videos" },
            { _id: 3, name: "User", permissions: "View Only" },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch roles", err);
        setRoles([
          { _id: 1, name: "Admin", permissions: "All Access" },
          { _id: 2, name: "Editor", permissions: "Manage News & Videos" },
          { _id: 3, name: "User", permissions: "View Only" },
        ]);
      }
    };
    fetchRoles();
  }, []);

  const addRole = async (e) => {
    e.preventDefault();
    if (!newRole.trim() || !permissions.trim()) return;

    try {
      setLoading(true);
      const { data } = await api.post("/roles", {
        name: newRole,
        permissions: permissions
      });
      setRoles((prev) => [...prev, data.data || data]);
      setNewRole("");
      setPermissions("");
    } catch (err) {
      console.error(err);
      // Fallback behavior if endpoint isn't fully set up yet
      alert("Failed to add role to server. Mock adding locally.");
      const role = {
        _id: Date.now().toString(),
        name: newRole,
        permissions,
      };
      setRoles([...roles, role]);
      setNewRole("");
      setPermissions("");
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await api.delete(`/roles/${id}`);
      setRoles(roles.filter((role) => (role._id || role.id) !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete role from server. Mock local deletion.");
      setRoles(roles.filter((role) => (role._id || role.id) !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Roles & Permissions</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Define access levels for your team members</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Form Section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-[16px] font-bold text-slate-900">Create Role</h2>
            </div>
            
            <form onSubmit={addRole} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role Name</label>
                <input
                  type="text"
                  placeholder="e.g. Moderator"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Permissions</label>
                <textarea
                  placeholder="e.g. Manage comments, Create posts"
                  rows="3"
                  value={permissions}
                  onChange={(e) => setPermissions(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 resize-none"
                  required
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold transition-all shadow-sm shadow-blue-200 disabled:opacity-50 text-sm active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4" />
                  {loading ? "Adding..." : "Add Role"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Roles List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-[16px] font-bold text-slate-900">Configured Roles</h2>
              <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100">
                {roles.length} Roles
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                    <th className="py-4 px-6 w-1/3">Role Level</th>
                    <th className="py-4 px-6">Description / Access</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {roles.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                           <ShieldCheck className="w-10 h-10 text-slate-300 mb-3" />
                           <p className="text-[15px] font-bold text-slate-800">No roles configured</p>
                           <p className="text-sm font-medium text-slate-500 mt-1">Create a new role to assign permissions.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    roles.map((role) => (
                      <tr key={role._id || role.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span className="font-bold text-slate-900 text-[15px]">{role.name}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-slate-600 font-medium text-sm">{role.permissions}</p>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => deleteRole(role._id || role.id)}
                            className="p-2 text-slate-400 hover:text-red-600 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100"
                            title="Delete Role"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRoles;
