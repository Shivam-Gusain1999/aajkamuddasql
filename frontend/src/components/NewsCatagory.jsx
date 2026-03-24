import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Flame, MapPin, Star, Zap, Trophy, Smartphone, Film, TrendingUp, GraduationCap, Heart, Globe, Newspaper, Landmark } from "lucide-react";
import api from '../assets/api';

const categoryConfig = {
  "टॉप न्यूज़": { icon: Flame, bg: "bg-red-100", color: "text-red-600" },
  "देश": { icon: Newspaper, bg: "bg-orange-100", color: "text-orange-600" },
  "विदेश": { icon: Globe, bg: "bg-green-100", color: "text-green-600" },
  "राजनीति": { icon: Landmark, bg: "bg-blue-100", color: "text-blue-600" },
  "खेल": { icon: Trophy, bg: "bg-yellow-100", color: "text-yellow-600" },
  "क्रिकेट": { icon: Trophy, bg: "bg-emerald-100", color: "text-emerald-600" },
  "टेक्नोलॉजी": { icon: Smartphone, bg: "bg-purple-100", color: "text-purple-600" },
  "मनोरंजन": { icon: Film, bg: "bg-pink-100", color: "text-pink-600" },
  "बिजनेस": { icon: TrendingUp, bg: "bg-cyan-100", color: "text-cyan-700" },
  "शिक्षा": { icon: GraduationCap, bg: "bg-indigo-100", color: "text-indigo-600" },
  "लाइफस्टाइल": { icon: Heart, bg: "bg-rose-100", color: "text-rose-500" },
  "राज्य-शहर": { icon: MapPin, bg: "bg-amber-100", color: "text-amber-600" },
  "भास्कर खास": { icon: Star, bg: "bg-yellow-100", color: "text-yellow-500" },
};
const defaultConfig = { icon: Zap, bg: "bg-gray-100", color: "text-gray-600" };

const NewsCatagory = ({ horizontal = false }) => {
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        const fetchedCategories = res.data?.data || [];

        const allCategories = [
          { _id: "home-top-news", name: "टॉप न्यूज़" },
          ...fetchedCategories
        ];

        setCategories(allCategories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className={horizontal ? "py-2" : "w-full"}>

      {/* 🚀 CSS Hack to hide scrollbar but keep scroll functionality */}
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <ul className={`hide-scroll flex ${horizontal
          // 🚀 THE HORIZONTAL FIX: overflow-x-auto, snap-x for smoothness
          ? "flex-row overflow-x-auto whitespace-nowrap gap-3 px-3 snap-x scroll-smooth"
          // 🚀 Vertical: No max-height or overflow so parent sticky JS can control scroll
          : "flex-col"
        }`}>

        {categories.map((item, index) => {
          const config = categoryConfig[item.name] || defaultConfig;
          const Icon = config.icon;
          const linkPath = item.name === "टॉप न्यूज़" ? "/" : `/category/${encodeURIComponent(item.name)}`;
          const isActive = location.pathname === linkPath;

          if (horizontal) {
            return (
              // 🚀 FIX: Added 'shrink-0 snap-start' so it doesn't squish and scrolls perfectly
              <li key={item._id || index} className="shrink-0 snap-start">
                <Link to={linkPath}
                  className={`flex items-center gap-2 text-sm md:text-base font-semibold py-1.5 px-2 rounded-full transition-colors ${isActive ? 'bg-red-50 text-red-600 border border-red-200' : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                    }`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${config.bg}`}>
                    <Icon size={14} className={config.color} />
                  </div>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          }

          return (
            // Desktop Vertical List Item
            <li key={item._id || index}>
              <Link to={linkPath}
                className={`flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-100 last:border-0 ${isActive ? 'bg-red-50 text-red-600 font-bold border-l-4 border-l-red-600' : 'hover:bg-gray-50 text-gray-800 border-l-4 border-l-transparent'
                  }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bg} shrink-0`}>
                  <Icon size={16} className={config.color} />
                </div>
                <span className="font-semibold text-base">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NewsCatagory;