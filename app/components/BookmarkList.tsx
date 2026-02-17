"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch bookmarks
  const fetchBookmarks = async (uid: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*, categories(name)")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  useEffect(() => {
    let channel: any;

    const setup = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

      const uid = data.user.id;
      setUserId(uid);

      // Initial fetch
      await fetchBookmarks(uid);

      // 🔥 Proper realtime subscription
      channel = supabase
        .channel("realtime-bookmarks")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${uid}`,
          },
          async (payload) => {
            console.log("Realtime event:", payload);

            // Instead of refetching everything,
            // update state directly for instant UI update

            if (payload.eventType === "INSERT") {
              setBookmarks((prev) => [payload.new, ...prev]);
            }

            if (payload.eventType === "DELETE") {
              setBookmarks((prev) =>
                prev.filter((b) => b.id !== payload.old.id)
              );
            }

            if (payload.eventType === "UPDATE") {
              setBookmarks((prev) =>
                prev.map((b) =>
                  b.id === payload.new.id ? payload.new : b
                )
              );
            }
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
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        Your Bookmarks
      </h2>

      <div className="space-y-4">
        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between"
          >
            <div>
              <a
                href={b.url}
                target="_blank"
                className="text-blue-600 font-medium hover:underline"
              >
                {b.title}
              </a>
              <p className="text-sm text-gray-500">
                {b.categories?.name}
              </p>
            </div>

            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
