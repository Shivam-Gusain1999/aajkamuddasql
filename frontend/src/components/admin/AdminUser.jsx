import { useState, useEffect } from "react";
import api from "../../assets/api";
import { Users, Search, Plus, Trash2, UserPlus, Shield } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "Editor",
  });

  // Load users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/users/admin/all-users");
        setUsers(data.data || (Array.isArray(data) ? data : []));
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    fetchUsers();
  }, []);

  // Add User
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    try {
      const { data } = await api.post("/users", formData);
      setUsers((prev) => [...prev, data.data || data]);
      setFormData({ fullName: "", email: "", role: "Editor" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add user");
    }
  };

  // Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  // Update Role (Authority Control)
  const handleRoleChange = async (id, newRole) => {
    try {
      const { data } = await api.put(`/users/${id}`, { role: newRole });
      setUsers((prev) =>
        prev.map((user) =>
          (user._id || user.id) === id ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update user role");
    }
  };

  // Filter Users by Email
  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(searchEmail.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage team members and their roles</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm shadow-blue-200 active:scale-[0.98] text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Invite User</span>
          </button>
        )}
      </div>

      {/* Add User Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-slate-900">Add New User</h2>
              <p className="text-xs font-medium text-slate-500">Provide their details to grant access</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address *</label>
              <input
                type="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Initial Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-semibold text-slate-800 appearance-none cursor-pointer capitalize"
              >
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Reporter">Reporter</option>
                <option value="User">User</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors cursor-pointer">
                Save User
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100">
              {filteredUsers.length} Users
            </span>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-4 px-6 w-16">Profile</th>
                <th className="py-4 px-6">User Details</th>
                <th className="py-4 px-6">Role / Access</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-[15px] font-bold text-slate-800">No users found</p>
                      <p className="text-sm font-medium text-slate-500 mt-1">Try a different search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm uppercase shadow-sm">
                        {(user.fullName || user.name || user.username || 'U').substring(0, 1)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900 text-[15px] leading-snug">{user.fullName || user.name || user.username || 'Unknown User'}</p>
                      <p className="text-xs font-medium text-slate-500">{user.email}</p>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Shield className={`w-4 h-4 ${['admin', 'Admin'].includes(user.role) ? 'text-red-500' : ['editor', 'Editor'].includes(user.role) ? 'text-blue-500' : 'text-emerald-500'}`} />
                        <select
                          value={user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()) : 'User'}
                          onChange={(e) => handleRoleChange(user._id || user.id, e.target.value)}
                          className="bg-transparent border-none font-semibold text-slate-700 text-sm focus:ring-0 cursor-pointer hover:bg-slate-100 rounded px-1 -ml-1 py-1 transition-colors capitalize"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Editor">Editor</option>
                          <option value="Reporter">Reporter</option>
                          <option value="User">User</option>
                        </select>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDelete(user._id || user.id)}
                          className="p-2 text-slate-400 hover:text-red-600 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                          title="Delete User"
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

export default AdminUsers;
