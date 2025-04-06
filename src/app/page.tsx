"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-center">
        ⚡ AI-Powered Sports Reels
      </h1>

      <p className="text-xl md:text-2xl text-gray-300 text-center max-w-xl mb-8">
        Instantly generate short, engaging highlight videos of your favorite
        sports legends — powered by AI, audio, and magic.
      </p>

      <Link
        href="/reels"
        className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-lg px-8 py-4 rounded-full shadow-md transition"
      >
        🎬 View Reels
      </Link>

      <footer className="absolute bottom-4 text-sm text-gray-500">
        Built with Next.js, OpenAI, and AWS 💡
      </footer>
    </div>
  );
}
