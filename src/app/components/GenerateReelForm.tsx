"use client";

import { useState } from "react";

export default function GenerateReelForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [celebrity, setCelebrity] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  const generate = async () => {
    if (!celebrity.trim()) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/reels/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ celebrity }),
      });

      if (!res.ok) throw new Error("Failed to generate");

      setStatus("done");
      setCelebrity("");

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="bg-white text-black p-4 rounded-xl shadow-md w-full max-w-md mx-auto mb-6">
      <h2 className="text-xl font-semibold mb-2 text-center">
        🎤 Generate a New AI Reel
      </h2>

      <input
        type="text"
        placeholder="Enter celebrity name"
        value={celebrity}
        onChange={(e) => setCelebrity(e.target.value)}
        className="w-full border px-4 py-2 rounded-md mb-3"
      />

      <button
        onClick={generate}
        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 rounded-md transition"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Generating..." : "Generate Reel"}
      </button>

      {status === "done" && (
        <p className="text-green-600 mt-2 text-center">
          ✅ Reel generated successfully!
        </p>
      )}

      {status === "error" && (
        <p className="text-red-600 mt-2 text-center">
          ❌ Something went wrong.
        </p>
      )}
    </div>
  );
}
