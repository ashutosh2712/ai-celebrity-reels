import React, { useEffect, useState } from "react";
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
  const { ref, inView } = useInView({
    threshold: 0.7, // play only if 70% in view
    triggerOnce: false,
  });

  return (
    <div
      ref={ref}
      className="h-screen snap-start flex flex-col items-center justify-center relative"
    >
      <video
        src={reel.s3Url}
        className="w-full h-full object-cover"
        autoPlay={inView}
        muted
        loop
        playsInline
      />
      <div className="absolute bottom-10 left-5 text-white text-xl font-bold bg-black/50 px-3 py-1 rounded">
        {reel.title}
      </div>
    </div>
  );
}

export default Reels;
