"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchBookmarks = async (uid: string) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*, categories(name)")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (!error) {
      setBookmarks(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    let channel: any;

    const setup = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);

      // Initial fetch
      await fetchBookmarks(user.id);

      // 🔥 Realtime subscription
      channel = supabase
        .channel("realtime-bookmarks")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${user.id}`,
          },
          async () => {
            await fetchBookmarks(user.id);
          }
        )
        .subscribe();
    };

    setup();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const deleteBookmark = async (id: string) => {
    if (!userId) return;

    // 🔥 Optimistic update (instant UI change)
    setBookmarks((prev) => prev.filter((b) => b.id !== id));

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      // rollback if something fails
      await fetchBookmarks(userId);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading bookmarks...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        Your Bookmarks
      </h2>

      {bookmarks.length === 0 && (
        <p className="text-gray-500">No bookmarks yet.</p>
      )}

      <div className="space-y-4">
        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center"
          >
            <div>
              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium hover:underline"
              >
                {b.title}
              </a>

              {b.categories?.name && (
                <p className="text-sm text-gray-500 mt-1">
                  {b.categories.name}
                </p>
              )}
            </div>

            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500 hover:text-red-600 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
