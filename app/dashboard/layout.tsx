"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";

import BookmarkList from "@/app/components/BookmarkList";
import BookmarkForm from "@/app/components/BookmarkForm";
import CategoryForm from "@/app/components/categoryform";

export default function DashboardLayout() {
  const [user, setUser] = useState<any>(null);
  const [activeModule, setActiveModule] = useState("bookmarks");
  const [collapsed, setCollapsed] = useState(false); // ✅ REQUIRED

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/");
      else setUser(data.user);
    };
    checkUser();
  }, []);

  if (!user) return null;

  const renderModule = () => {
    switch (activeModule) {
      case "bookmarks":
        return <BookmarkList />;
      case "add":
        return <BookmarkForm />;
      case "categories":
        return <CategoryForm />;
      default:
        return <BookmarkList />;
    }
  };

  return (
    <div className="min-h-screen flex transition-all duration-300">

      {/* Sidebar */}
      <Sidebar
        user={user}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Header user={user} />

        <main className="p-10">
          {renderModule()}
        </main>
      </div>

    </div>
  );
}
