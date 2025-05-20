// src/app/anime/[id]/components/AnimePlayerEmbed.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Maximize, Minimize, Tv2, Loader2, AlertTriangle } from "lucide-react";

interface AnimePlayerEmbedProps {
  playerSrc?: string;
  animeTitle: string;
  episodeNumber?: number;
}

const AnimePlayerEmbed: React.FC<AnimePlayerEmbedProps> = ({
  playerSrc,
  animeTitle,
  episodeNumber,
}) => {
  const [isLoading, setIsLoading] = useState(!!playerSrc);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!playerSrc) {
      setIsLoading(false);
      setError(null);
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      return;
    }

    setIsLoading(true);
    setError(null);
    const iframe = iframeRef.current;
    if (!iframe) return;

    let loaded = false;

    const handleLoad = () => {
      if (loaded) return;
      loaded = true;
      setIsLoading(false);
      setError(null);
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      console.log("Player iframe loaded successfully.");
    };

    const handleErrorEvent = (event: Event | string) => {
      console.error("Player iframe error event:", event);
      setIsLoading(false);
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };

    iframe.addEventListener("load", handleLoad);
    iframe.addEventListener("error", handleErrorEvent);
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      if (!loaded && iframeRef.current) {
        setIsLoading(false);
        setError(
          "Player timed out. Video may not load or play correctly. This can be due to ad-blockers, network issues, or problems with the video source."
        );
        console.warn("Player loading timed out.");
      }
    }, 20000);

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleLoad);
        iframe.removeEventListener("error", handleErrorEvent);
      }
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, [playerSrc]);

  useEffect(() => {
    const handleFullScreenChange = () =>
      setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  if (!playerSrc) {
    return (
      <div className="my-8 p-6 card-bg rounded-lg shadow text-center">
        <Tv2
          size={48}
          className="mx-auto text-text-muted-light dark:text-text-muted-dark mb-3"
        />
        <p className="text-lg font-medium text-text-secondary-light dark:text-text-secondary-dark">
          No direct player available for this anime.
        </p>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
          You might find streaming options on other platforms or the official
          site.
        </p>
      </div>
    );
  }

  return (
    <section id="watch-anime" className="mb-8 md:mb-12">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl md:text-2xl font-bold flex items-center text-text-primary-light dark:text-text-primary-dark">
          <Tv2 className="mr-2 text-brand-primary" /> Watch {animeTitle}
          {episodeNumber && ` - Episode ${episodeNumber}`}
        </h2>
        <button
          onClick={() => {
            if (iframeRef.current?.requestFullscreen) {
              iframeRef.current
                .requestFullscreen()
                .catch((err) =>
                  console.error("Fullscreen request failed:", err)
                );
            }
          }}
          className="btn btn-outline btn-sm flex items-center"
          title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          disabled={!iframeRef.current || !!error || isLoading}
        >
          {isFullScreen ? (
            <Minimize size={16} className="mr-1.5" />
          ) : (
            <Maximize size={16} className="mr-1.5" />
          )}
          {isFullScreen ? "Exit" : "Fullscreen"}
        </button>
      </div>

      <div className="aspect-video relative bg-black rounded-lg shadow-lg overflow-hidden">
        {(isLoading || error) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black z-20 p-4 text-center">
            {isLoading && !error && (
              <>
                <Loader2
                  size={48}
                  className="animate-spin text-brand-primary mb-3"
                />
                <p className="text-gray-300 dark:text-gray-400">
                  Loading player...
                </p>
              </>
            )}
            {error && (
              <>
                <AlertTriangle size={48} className="text-red-500 mb-3" />
                <p className="text-red-500 dark:text-red-400 font-semibold">
                  Player Error
                </p>
                <p className="text-sm text-gray-300 dark:text-gray-400 px-2">
                  {error}
                </p>
              </>
            )}
          </div>
        )}
        <iframe
          ref={iframeRef}
          key={playerSrc}
          className={`w-full h-full absolute inset-0 z-0 ${
            error || isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
          } transition-opacity duration-300`}
          src={playerSrc}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          frameBorder="0"
          title={`Anime Player for ${animeTitle}`}
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-2 text-center">
        If the player doesn't load or shows an error, try disabling ad-blockers.
        The player is provided by a third-party.
      </p>
    </section>
  );
};

export default AnimePlayerEmbed;
