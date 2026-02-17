"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Sidebar({
  user,
  activeModule,
  setActiveModule,
  collapsed,
  setCollapsed,
}: any) {
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: bookmarks } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id);

    setTotal(bookmarks?.length || 0);

    const { data: cats } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id);

    if (cats && bookmarks) {
      const enriched = cats.map((cat) => ({
        ...cat,
        count: bookmarks.filter(
          (b) => b.category_id === cat.id
        ).length,
      }));
      setCategories(enriched);
    }
  };

  /* ---------- SVG ICONS ---------- */

  const HomeIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10L12 3l9 7v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
  );

  const PlusIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );

  const TagIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 12l-8-8H4v8l8 8 8-8z" />
    </svg>
  );

  const ToggleIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      {collapsed ? (
        <polyline points="9 18 15 12 9 6" />
      ) : (
        <polyline points="15 18 9 12 15 6" />
      )}
    </svg>
  );

  /* ---------- NAV ITEM FIXED ---------- */

  const navItem = (
    key: string,
    icon: any,
    label: string,
    count?: number
  ) => {
    const isActive = activeModule === key;

    return (
      <div
        onClick={() => setActiveModule(key)}
        className={`cursor-pointer transition-all duration-300 rounded-xl ${
          collapsed
            ? "flex justify-center items-center p-3"
            : "flex justify-between items-center px-4 py-3"
        } ${
          isActive
            ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
            : "hover:bg-gray-100 text-gray-700"
        }`}
      >
        {/* Left Side */}
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          {icon}

          {!collapsed && (
            <span className="whitespace-nowrap transition-all duration-300">
              {label}
            </span>
          )}
        </div>

        {/* Count */}
        {!collapsed && typeof count === "number" && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {count}
          </span>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-72"
      } bg-white border-r border-gray-200 p-6 transition-all duration-300 ease-in-out shadow-sm`}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between mb-10">
        {!collapsed && (
          <div className="flex items-center gap-3 transition-all duration-300">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
              🔖
            </div>
            <span className="font-bold text-gray-800">
              SmartBookmark
            </span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <ToggleIcon />
        </button>
      </div>

      {/* Navigation */}
      <div className="space-y-4">
        {navItem("bookmarks", <HomeIcon />, "My Bookmarks", total)}
        {navItem("add", <PlusIcon />, "Add Bookmark")}
        {navItem("categories", <TagIcon />, "Categories", categories.length)}
      </div>
    </aside>
  );
}
