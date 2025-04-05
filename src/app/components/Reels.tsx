"use client";

import { Pause, Play } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

type Reel = {
  id: string;
  title: string;
  s3Url: string;
  sport: string;
  duration: string;
};

const Reels = () => {
  const [reels, setReels] = useState<Reel[]>([]);

  useEffect(() => {
    const fetchReels = async () => {
      const res = await fetch("/api/reels");
      const data = await res.json();
      setReels(data);
    };

    fetchReels();
  }, []);

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black">
      {reels.map((reel) => (
        <ReelItem key={reel.id} reel={reel} />
      ))}
    </div>
  );
};

function ReelItem({ reel }: { reel: Reel }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInView({ threshold: 0.7 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (inView) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [inView]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    // Enable sound on user interaction
    video.muted = false;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleVideoClick = () => {
    // Toggle control visibility on tap
    setShowControls((prev) => !prev);
  };

  return (
    <div
      ref={ref}
      className="relative h-screen w-full snap-start flex items-center justify-center"
    >
      <video
        ref={videoRef}
        src={reel.s3Url}
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        onClick={handleVideoClick}
      />

      {/* Title */}
      <div className="absolute bottom-20 left-4 text-white text-xl font-bold bg-black/50 px-4 py-2 rounded-lg">
        {reel.title}
      </div>

      {/* Custom play/pause control, only visible if showControls is true */}
      {showControls && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="bg-white/20 hover:bg-white/30 transition backdrop-blur-md rounded-full p-4">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white" />
            )}
          </div>
        </button>
      )}
    </div>
  );
}

export default Reels;
