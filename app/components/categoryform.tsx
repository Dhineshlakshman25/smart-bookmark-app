"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CategoryForm() {
  const [name, setName] = useState("");

  const addCategory = async () => {
    const { data } = await supabase.auth.getUser();

    await supabase.from("categories").insert({
      name,
      user_id: data.user?.id,
    });

    setName("");
    window.location.reload();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="font-semibold text-gray-900 mb-4">
        Add Category
      </h2>

      <div className="flex gap-3">
        <input
          className="flex-1 border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={addCategory}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}
