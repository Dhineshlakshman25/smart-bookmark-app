"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function Header({ user }: any) {
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm">
          🔖
        </div>
        <span className="font-semibold text-gray-800 text-base">
          SmartBookmark
        </span>
      </div>

      {/* Profile */}
      <div className="relative">
        <img
          src={user.user_metadata?.avatar_url}
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full cursor-pointer border-2 border-transparent hover:border-blue-500 transition"
        />

        {open && (
          <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
            
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user.email}
              </p>
            </div>

            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Animation */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}
