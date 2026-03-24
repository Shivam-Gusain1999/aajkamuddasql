import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  Video,
  BookOpen,
  Tags,
  Users,
  ShieldCheck,
  MessageSquare,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  X,
  ChevronDown,
  Megaphone
} from "lucide-react";
import { useState } from "react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "News", path: "/admin/news", icon: Newspaper },
    { name: "Videos", path: "/admin/videos", icon: Video },
    { name: "Web Stories", path: "/admin/webstory", icon: BookOpen },
    { name: "Categories", path: "/admin/categories", icon: Tags },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Roles", path: "/admin/roles", icon: ShieldCheck },
    { name: "Comments", path: "/admin/comments", icon: MessageSquare },
    { name: "Ads", path: "/admin/ads", icon: Megaphone },
    // { name: "Media", path: "/admin/media", icon: ImageIcon },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-[#F4F7F9] overflow-hidden font-sans text-slate-800">
      {/* Sidebar background overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } lg:w-64`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-transparent shrink-0 mt-2">
          <div className="flex items-center gap-3 font-bold text-xl text-slate-900 tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-blue-600 shadow-md shadow-blue-600/20 flex items-center justify-center shrink-0">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <span>Aaj Ka Mudda</span>
          </div>
          <button
            className="lg:hidden p-1 text-slate-400 hover:text-slate-700 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Main Menu</div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${active
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "hover:bg-slate-50 text-slate-500 hover:text-slate-900 font-medium"
                    }`}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                >
                  <Icon className={`w-5 h-5 shrink-0 transition-colors ${active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                  <span className="text-[14px]">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 shrink-0 mb-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-medium group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[14px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        {/* <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-50 shrink-0 shadow-sm relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-md text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header> */}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <div className="max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
