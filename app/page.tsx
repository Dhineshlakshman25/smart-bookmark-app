"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      router.push("/dashboard");
    }
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      },
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#f8fafc]">
      {/* Radial Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.15),transparent_40%)]"></div>

      {/* Soft Blur Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl px-10 py-14 text-center border border-white/40">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white text-2xl">🔖</span>
          </div>
          <p className="text-blue-600 font-semibold tracking-wider text-sm">
            SMARTBOOKMARK
          </p>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-900 leading-snug mb-4">
          Your bookmarks,
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            smarter.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 mb-10">Secure, real-time, and private.</p>

        {/* Google Button */}
        <button
          onClick={signInWithGoogle}
          className="w-full border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all px-6 py-3 rounded-xl flex items-center justify-center gap-3 bg-white"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="font-medium text-gray-700">
            Continue with Google
          </span>
        </button>

        {/* Terms */}
        <p className="text-xs text-gray-400 mt-6">
          By continuing, you agree to our Terms of Service.
        </p>

        {/* Footer */}
        <div className="mt-14 text-sm text-gray-400">© 2026 SmartBookmark</div>
      </div>
    </div>
  );
}
