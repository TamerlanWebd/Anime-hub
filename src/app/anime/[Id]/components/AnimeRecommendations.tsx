// src/app/anime/[id]/components/AnimeRecommendations.tsx
"use client";
import LinkRec from "next/link";
import ImageRec from "next/image";
import { Star, ThumbsUp } from "lucide-react";
import { AnilistRecommendationNode } from "@/@types/types";

interface AnimeRecommendationsProps {
  recommendations: AnilistRecommendationNode[] | null | undefined;
  title?: string;
}

const AnimeRecommendations: React.FC<AnimeRecommendationsProps> = ({
  recommendations,
  title = "Recommendations",
}) => {
  const validRecommendations =
    recommendations?.filter(
      (rec) => rec.mediaRecommendation && rec.mediaRecommendation.id
    ) || [];

  if (validRecommendations.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 md:mb-12">
      <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center">
        <ThumbsUp className="mr-2 text-green-500" /> {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {validRecommendations.map((rec) => {
          const media = rec.mediaRecommendation!;

          const displayTitle = media.title?.userPreferred || "Unknown Title";
          const imageUrl = media.coverImage?.medium || "/placeholder-anime.png";
          const linkUrl =
            (media as any).type?.toUpperCase() === "ANIME"
              ? `/anime/${media.id}`
              : media.siteUrl || "#";

          return (
            <LinkRec
              href={linkUrl}
              key={rec.id}
              className="card-bg rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              target={linkUrl.startsWith("http") ? "_blank" : "_self"}
              rel={linkUrl.startsWith("http") ? "noopener noreferrer" : ""}
            >
              <div className="aspect-[2/3] relative">
                <ImageRec
                  src={imageUrl}
                  alt={displayTitle}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.6vw"
                  style={{ objectFit: "cover" }}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                {typeof rec.rating === "number" && rec.rating > 0 && (
                  <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center backdrop-blur-sm">
                    <ThumbsUp size={10} className="mr-0.5 text-green-400" />
                    {rec.rating}
                  </div>
                )}
              </div>
              <div className="p-2">
                <h4
                  className="text-xs sm:text-sm font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-brand-primary truncate"
                  title={displayTitle}
                >
                  {displayTitle}
                </h4>
                {typeof media.averageScore === "number" && (
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark flex items-center">
                    <Star
                      size={12}
                      className="mr-1 text-yellow-400 fill-current"
                    />
                    {(media.averageScore / 10).toFixed(1)}
                  </p>
                )}
              </div>
            </LinkRec>
          );
        })}
      </div>
    </section>
  );
};

export default AnimeRecommendations;
