// src/components/shared/AnimeCard.tsx
"use client";
import ImageAC from "next/image";
import LinkAC from "next/link";
import {
  Star,
  Calendar,
  Users,
  ThumbsUp,
  Film,
  Tv,
  PlayCircle,
} from "lucide-react";
import ReactAC from "react";
import { AnilistMedia } from "@/@types/types";
import { formatCount } from "@/lib/utils";

interface AnimeCardProps {
  anime: AnilistMedia;
  priorityImage?: boolean;
}

const hexToRgbValues = (hex?: string): string => {
  if (!hex) return "107, 114, 128";
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : "107, 114, 128";
};

export default function AnimeCard({
  anime,
  priorityImage = false,
}: AnimeCardProps) {
  const imageUrl =
    anime.coverImage?.extraLarge ||
    anime.coverImage?.large ||
    anime.coverImage?.medium ||
    "/placeholder-anime.png";

  const title =
    anime.title?.userPreferred ||
    anime.title?.english ||
    anime.title?.romaji ||
    "Untitled";
  const score = anime.averageScore
    ? (anime.averageScore / 10).toFixed(1)
    : null;

  const FormatIcon =
    anime.format === "TV" || anime.format === "TV_SHORT" ? Tv : Film;
  const accentRgb = hexToRgbValues(anime.coverImage?.color ?? undefined);
  const cardRef = ReactAC.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { width, height } = rect;
    const mouseX = (x / width - 0.5) * 2;
    const mouseY = (y / height - 0.5) * -2;

    const rotateY = mouseX * 5;
    const rotateX = mouseY * 5;

    cardRef.current.style.setProperty("--mouse-x-factor", `${rotateY}deg`);
    cardRef.current.style.setProperty("--mouse-y-factor", `${rotateX}deg`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--mouse-x-factor", `0deg`);
    cardRef.current.style.setProperty("--mouse-y-factor", `0deg`);
  };

  return (
    <LinkAC
      href={`/anime/${anime.id}`}
      className="group/card block outline-none [transform-style:preserve-3d] 
                 focus-visible:ring-4 focus-visible:ring-[rgba(var(--accent-rgb),0.7)] rounded-xl"
      style={
        {
          "--accent-rgb": accentRgb,
          "--card-border-color": `rgba(var(--accent-rgb), 0.6)`,
          "--card-border-color-light": `rgba(var(--accent-rgb), 0.7)`,
          perspective: "1000px",
        } as React.CSSProperties
      }
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl 
                   rounded-xl shadow-xl dark:shadow-2xl h-full flex flex-col overflow-hidden
                   border-2 border-transparent 
                   transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] 
                   hover:shadow-[0_30px_50px_-15px_rgba(var(--accent-rgb),0.25)] dark:hover:shadow-[0_45px_70px_-20px_rgba(var(--accent-rgb),0.35)]
                   hover:border-[var(--card-border-color-light)] dark:hover:border-[var(--card-border-color)]
                   hover:[transform:rotateX(var(--mouse-y-factor,0deg))_rotateY(var(--mouse-x-factor,0deg))_translateZ(20px)_scale(1.04)]
                   focus-visible:[transform:translateZ(20px)_scale(1.04)] 
                   focus-visible:border-[var(--card-border-color-light)] dark:focus-visible:border-[var(--card-border-color)]"
      >
        <div
          className="absolute -inset-6 rounded-[calc(0.75rem+0.375rem)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 ease-out pointer-events-none -z-10"
          style={{
            background: `radial-gradient(circle, rgba(var(--accent-rgb), 0.15) 0%, transparent 70%)`,
            filter: `blur(25px)`,
          }}
        ></div>
        <div className="relative aspect-[10/16] w-full overflow-hidden [transform:translateZ(30px)] [transform-style:preserve-3d]">
          <ImageAC
            src={imageUrl}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.15] [transform:translateZ(-10px)]"
            sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
            priority={priorityImage}
            quality={95}
          />
          <div
            className="absolute inset-0 transition-all duration-700 ease-out 
                          opacity-10 dark:opacity-20 group-hover/card:opacity-40 dark:group-hover/card:opacity-60
                          [background:linear-gradient(170deg,rgba(var(--accent-rgb),0.1)_0%,rgba(var(--accent-rgb),0.03)_35%,transparent_60%),linear-gradient(30deg,transparent_40%,rgba(var(--accent-rgb),0.15)_100%)]
                          dark:[background:linear-gradient(170deg,rgba(var(--accent-rgb),0.15)_0%,rgba(var(--accent-rgb),0.05)_35%,transparent_60%),linear-gradient(30deg,transparent_40%,rgba(var(--accent-rgb),0.25)_100%)]
                          group-hover/card:[background:linear-gradient(170deg,rgba(var(--accent-rgb),0.2)_0%,rgba(var(--accent-rgb),0.1)_35%,transparent_60%),linear-gradient(30deg,transparent_20%,rgba(var(--accent-rgb),0.3)_100%)]
                          dark:group-hover/card:[background:linear-gradient(170deg,rgba(var(--accent-rgb),0.3)_0%,rgba(var(--accent-rgb),0.15)_35%,transparent_60%),linear-gradient(30deg,transparent_20%,rgba(var(--accent-rgb),0.4)_100%)]
                          mix-blend-hard-light dark:mix-blend-color-dodge group-hover/card:mix-blend-multiply dark:group-hover/card:mix-blend-overlay"
          ></div>
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent/30 
                          dark:from-black/95 dark:via-black/60 dark:to-transparent/50 
                          flex flex-col justify-between p-3 md:p-4 [transform:translateZ(10px)]"
          >
            <div className="flex justify-between items-start gap-2 opacity-0 group-hover/card:opacity-100 transition-all duration-500 delay-200 [transform:translateY(-10px)] group-hover/card:[transform:translateY(0px)]">
              {anime.format && (
                <div
                  className="text-white px-3 py-1.5 rounded-lg text-[0.7rem] font-bold flex items-center backdrop-blur-md shadow-lg
                                transition-all duration-300 ease-out
                                group-hover/card:text-black"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.6)",
                    border: "1px solid rgba(var(--accent-rgb), 0.3)",
                    backgroundImage: `linear-gradient(45deg, rgba(var(--accent-rgb),0.8), rgba(var(--accent-rgb),1))`,
                    backgroundSize: "200% 200%",
                    backgroundPosition: "100% 100%",
                    transition:
                      "background-position 0.4s ease-out, color 0.3s ease-out, box-shadow 0.3s ease-out",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundPosition = "0% 0%";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundPosition = "100% 100%";
                  }}
                >
                  <FormatIcon size={14} className="mr-1.5" />
                  <span className="uppercase tracking-wider">
                    {anime.format.replace(/_/g, " ")}
                  </span>
                </div>
              )}
              {score && (
                <div className="bg-black/60 text-white px-3 py-1.5 rounded-lg text-[0.7rem] font-bold flex items-center backdrop-blur-md shadow-lg border border-yellow-500/50">
                  <Star
                    size={14}
                    className="mr-1.5 text-yellow-400 fill-yellow-400/70 group-hover/card:text-yellow-300 group-hover/card:fill-yellow-300/80 transition-colors"
                  />
                  {score}
                </div>
              )}
            </div>

            <div className="relative mt-auto">
              <h3
                className="text-white text-lg md:text-xl lg:text-2xl font-black line-clamp-2 group-hover/card:line-clamp-4 
                               transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] mb-2 group-hover/card:mb-12 group-hover/card:text-white"
                style={{
                  textShadow: `0 1px 2px rgba(0,0,0,0.9), 0 0 20px rgba(var(--accent-rgb),0.7), 0 0 35px rgba(var(--accent-rgb),0.5)`,
                }}
              >
                {title}
              </h3>

              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[150%] group-hover/card:translate-y-1 
                           opacity-0 group-hover/card:opacity-100 
                           transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] delay-200 group-hover/card:delay-100
                           p-2 bg-[rgba(var(--accent-rgb),0.1)] dark:bg-[rgba(var(--accent-rgb),0.1)] 
                           rounded-full backdrop-blur-sm border border-[rgba(var(--accent-rgb),0.3)]"
              >
                <PlayCircle
                  size={52}
                  className="text-white drop-shadow-[0_2px_8px_rgba(var(--accent-rgb),0.7)] hover:text-[rgba(var(--accent-rgb),1)] 
                             transition-all duration-300 ease-out hover:scale-110 hover:drop-shadow-[0_4px_15px_rgba(var(--accent-rgb),1)]"
                  strokeWidth={1.2}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="p-3 md:p-4 pt-2 md:pt-3 flex-grow flex flex-col justify-between 
                     bg-gradient-to-b from-gray-50/80 to-gray-100/90 dark:from-gray-800/70 dark:to-gray-900/80 
                     backdrop-blur-md 
                     border-t-2 border-transparent group-hover/card:border-[rgba(var(--accent-rgb),0.15)] dark:group-hover/card:border-[rgba(var(--accent-rgb),0.2)] 
                     transition-colors duration-500"
        >
          <div>
            {anime.studios?.edges?.find((e) => e.isMain)?.node.name && (
              <p
                className="text-xs text-gray-600 dark:text-gray-400 mb-2 truncate font-medium 
                            group-hover/card:text-[rgba(var(--accent-rgb),1)] dark:group-hover/card:text-[rgba(var(--accent-rgb),0.9)] 
                            transition-colors duration-300"
              >
                {anime.studios.edges.find((e) => e.isMain)!.node.name}
              </p>
            )}
            <div
              className="flex flex-wrap gap-x-3 gap-y-1 text-[0.7rem] text-gray-500 dark:text-gray-500 mt-1 mb-2.5 
                            group-hover/card:text-gray-700 dark:group-hover/card:text-gray-300 
                            transition-colors duration-300"
            >
              {anime.seasonYear && (
                <span className="flex items-center group/metaitem">
                  <Calendar
                    size={12}
                    className="mr-1 opacity-50 dark:opacity-60 group-hover/metaitem:opacity-100 group-hover/metaitem:text-[rgba(var(--accent-rgb),0.8)] transition-all"
                  />{" "}
                  {anime.seasonYear}{" "}
                  {anime.season &&
                    anime.season.charAt(0) +
                      anime.season.slice(1).toLowerCase()}
                </span>
              )}
              {typeof anime.popularity === "number" && (
                <span className="flex items-center group/metaitem">
                  <Users
                    size={12}
                    className="mr-1 opacity-50 dark:opacity-60 group-hover/metaitem:opacity-100 group-hover/metaitem:text-[rgba(var(--accent-rgb),0.8)] transition-all"
                  />{" "}
                  {formatCount(anime.popularity)}
                </span>
              )}
              {typeof anime.favourites === "number" && (
                <span className="flex items-center group/metaitem">
                  <ThumbsUp
                    size={12}
                    className="mr-1 opacity-50 dark:opacity-60 group-hover/metaitem:opacity-100 group-hover/metaitem:text-[rgba(var(--accent-rgb),0.8)] transition-all"
                  />{" "}
                  {formatCount(anime.favourites)}
                </span>
              )}
            </div>
          </div>
          {anime.genres && anime.genres.length > 0 && (
            <div className="mt-auto pt-1.5 flex flex-wrap gap-1.5">
              {anime.genres.slice(0, 3).map((genreName) => (
                <span
                  key={genreName}
                  className="text-[0.65rem] px-2.5 py-1 rounded-full font-semibold border transition-all duration-300 ease-out 
                             transform group-hover/card:scale-105 group-hover/card:shadow-md opacity-90 group-hover/card:opacity-100
                             hover:!opacity-100 hover:!scale-110"
                  style={{
                    borderColor: `rgba(var(--accent-rgb), 0.5)`,
                    color: `rgba(var(--accent-rgb), 1)`,
                    backgroundColor: `rgba(var(--accent-rgb), 0.1)`,
                  }}
                >
                  {genreName.toUpperCase()}
                </span>
              ))}
              {anime.genres.length > 3 && (
                <span className="text-[0.65rem] bg-gray-200 dark:bg-gray-700/60 px-2 py-1 rounded-full text-gray-500 dark:text-gray-300/80 font-medium border border-gray-300 dark:border-gray-600/70">
                  +{anime.genres.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </LinkAC>
  );
}
