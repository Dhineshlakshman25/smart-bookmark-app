"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BookmarkForm() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    setCategories(data || []);
  };

  const addBookmark = async () => {
    const { data } = await supabase.auth.getUser();

    await supabase.from("bookmarks").insert({
      title,
      url,
      category_id: categoryId || null,
      user_id: data.user?.id,
    });

    setTitle("");
    setUrl("");
    window.location.reload();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="font-semibold text-gray-900 mb-4">
        Add Bookmark
      </h2>

      <div className="grid grid-cols-3 gap-4">
        <input
          className="border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <select
          className="border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={addBookmark}
        className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition"
      >
        Add Bookmark
      </button>
    </div>
  );
}
