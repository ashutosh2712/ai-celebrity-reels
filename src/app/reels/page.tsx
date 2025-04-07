"use client";

import Head from "next/head";
import Reels from "../components/Reels";
import GenerateReelForm from "../components/GenerateReelForm";
import { useState } from "react";
//import dynamic from "next/dynamic";

//const Reels = dynamic(() => import("@/app/components/Reels"), { ssr: false });

export default function Home() {
  const [reloadKey, setReloadKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <Head>
        <title>Sports Reels</title>
        <meta name="description" content="AI-generated sports history reels" />
      </Head>
      <main className="relative h-screen bg-black text-white">
        {/* Scrollable full-screen reels */}
        <Reels key={reloadKey} />

        {/* Floating generate button */}
        <button
          onClick={() => setShowForm(true)}
          className="absolute bottom-6 right-6 bg-amber-500 text-black px-5 py-3 rounded-full font-semibold shadow-xl hover:bg-amber-600 transition"
        >
          + Generate Reel
        </button>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white text-black p-6 rounded-lg w-full max-w-md">
              <GenerateReelForm
                onSuccess={() => {
                  setReloadKey((k) => k + 1);
                  setShowForm(false);
                }}
              />
              <button
                onClick={() => setShowForm(false)}
                className="text-sm text-gray-600 mt-2 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
