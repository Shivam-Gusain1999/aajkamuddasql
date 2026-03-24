import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { Home, Video, Search, User, BookOpen, Layers, LogOut, Settings, ChevronDown, KeyRound } from "lucide-react"
import { useUser } from './admin/UserContext.jsx';
import logoImg from '../assets/aajkamudda2.jpg';
const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  // 🚀 NEW STATE: For Dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 🚀 NEW REF: To reference the dropdown box
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const { currentUser, logout } = useUser();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
    setSearchOpen(false);
    setQuery("");
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false); // Close menu on logout
    navigate("/");
  };

  // 🚀 THE MAGIC: Click Outside Logic
  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-[60] bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">

        {/* Logo */}
        <div className="w-auto md:w-64 shrink-0 flex items-center pr-2">
          <NavLink
            to="/"
            className="inline-block group cursor-pointer"
          >
            <img
              src={logoImg}
              alt="Aaj Ka Mudda Logo"
              className="h-12 sm:h-12 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </NavLink>
        </div>
        {/* 🔵 CENTER: Main navigation */}
        <div className="hidden md:flex flex-1 justify-center font-bold text-gray-700">
          <div className="flex items-center gap-8">

            <NavLink to="/" className={({ isActive }) =>
              `flex items-center gap-2 hover:text-red-600 transition-colors py-1 ${isActive ? "text-red-600 border-b-2 border-red-600" : ""}`
            }>
              <Home size={22} />
              <span>होम</span>
            </NavLink>

            <NavLink to="/videos" className={({ isActive }) =>
              `flex items-center gap-2 hover:text-red-600 transition-colors py-1 ${isActive ? "text-red-600 border-b-2 border-red-600" : ""}`
            }>
              <Video size={22} />
              <span>वीडियो</span>
            </NavLink>

            {/* 🔍 Search */}
            {!searchOpen ? (
              <div
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 cursor-pointer hover:text-red-600 transition-colors py-1"
              >
                <Search size={22} />
                <span>खोजें</span>
              </div>
            ) : (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="समाचार खोजें..."
                  className="border border-gray-300 rounded-full px-4 py-1.5 outline-none w-56 text-sm font-normal focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                  autoFocus
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setSearchOpen(false);
                    }
                  }}
                />
              </form>
            )}
          </div>
        </div>

        {/* 🟢 RIGHT: Secondary actions & User Profile */}
        <div className="w-auto flex justify-end items-center gap-2 sm:gap-5 font-bold shrink-0 text-gray-700">
          <NavLink to="/epaper" className={({ isActive }) =>
            `flex items-center gap-1 sm:gap-2 hover:text-red-600 whitespace-nowrap py-1 transition-colors text-sm sm:text-base ${isActive ? "text-red-600 border-b-2 border-red-600" : ""}`
          }>
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">ई-पेपर</span>
          </NavLink>

          <NavLink to="/webstory" className={({ isActive }) =>
            `flex items-center gap-1 sm:gap-2 hover:text-red-600 whitespace-nowrap py-1 transition-colors text-sm sm:text-base ${isActive ? "text-red-600 border-b-2 border-red-600" : ""}`
          }>
            <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">वेबस्टोरी</span>
          </NavLink>

          {/* 👤 USER SECTION (LOGIN OR DROPDOWN) */}
          <div className="sm:ml-2 sm:pl-4 border-l border-gray-200">
            {!currentUser ? (
              // Login Button for Guests
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-1 sm:gap-2 bg-red-50 text-red-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-red-100 transition-colors text-sm sm:text-base"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>लॉगिन</span>
              </button>
            ) : (
              // 🚀 DROPDOWN MENU FOR LOGGED IN USERS
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 sm:gap-2 bg-gray-50 border border-gray-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                >
                  {/* Agar user ka avatar hai toh wo dikhao, warna default icon */}
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Profile" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  )}
                  <span className="hidden sm:inline text-sm font-semibold max-w-[80px] truncate">
                    {currentUser.fullName || currentUser.username || "Account"}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Box */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">

                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">{currentUser.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-1">
                      {/* Admin Button (Only if Role matches) */}
                      {(currentUser.role === "admin" || currentUser.role === "ADMIN") && (
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate("/admin");
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors"
                        >
                          <Settings size={16} />
                          Admin Panel
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/change-password");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors"
                      >
                        <KeyRound size={16} />
                        पासवर्ड बदलें (Change Password)
                      </button>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut size={16} />
                        लॉगआउट (Logout)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Navbar