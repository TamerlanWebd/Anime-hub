// src/app/anime/[id]/components/AnimeTrailer.tsx
"use client";
import ReactTrailer, { useState as useStateTrailer } from "react";
import ReactPlayer from "react-player/youtube";
import { Youtube, Video, X } from "lucide-react";

interface AnimeTrailerProps {
  youtubeTrailerId?: string | null;
  animeTitle?: string | null;
}

export default function AnimeTrailer({
  youtubeTrailerId,
  animeTitle,
}: AnimeTrailerProps) {
  const [showPlayer, setShowPlayer] = useStateTrailer(false);

  if (!youtubeTrailerId) {
    return (
      <div className="mt-4 card-bg p-4 rounded-lg shadow text-center">
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
          No official trailer available for {animeTitle || "this anime"} on
          YouTube.
        </p>
      </div>
    );
  }

  const trailerUrl = `https://www.youtube.com/watch?v=${youtubeTrailerId}`;

  if (!showPlayer) {
    return (
      <button
        onClick={() => setShowPlayer(true)}
        className="mt-4 w-full btn btn-danger flex items-center justify-center space-x-2 py-2.5"
      >
        <Youtube size={20} />
        <span>Watch Trailer</span>
      </button>
    );
  }
  return (
    <section
      id="trailer"
      className="my-6 md:my-8 card-bg p-3 md:p-4 rounded-lg shadow-lg"
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg md:text-xl font-semibold flex items-center text-text-primary-light dark:text-text-primary-dark">
          <Video size={22} className="mr-2 text-red-500" /> Official Trailer
        </h2>
        <button
          onClick={() => setShowPlayer(false)}
          className="btn btn-ghost p-1.5 rounded-full"
          aria-label="Close trailer"
        >
          <X size={20} />
        </button>
      </div>
      <div className="player-wrapper bg-black rounded-md overflow-hidden shadow-md">
        <ReactPlayer
          url={trailerUrl}
          playing
          controls
          width="100%"
          height="100%"
          className="react-player"
          config={{
            playerVars: {
              showinfo: 0,
              modestbranding: 1,
              rel: 0,
              autoplay: 1,
              iv_load_policy: 3,
            },
          }}
        />
      </div>
    </section>
  );
}
