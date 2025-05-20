// src/app/anime/[id]/components/AnimeRelations.tsx
"use client";
import LinkAR from "next/link";
import ImageAR from "next/image";
import { Link2, Tv, Film, BookOpen as MangaIcon } from "lucide-react";
import { AnilistMediaRelationEdge } from "@/@types/types";

interface AnimeRelationsProps {
  relations: AnilistMediaRelationEdge[] | null | undefined;
  title?: string;
}

const RelationTypeMap: Record<string, string> = {
  ADAPTATION: "Adaptation",
  PREQUEL: "Prequel",
  SEQUEL: "Sequel",
  PARENT: "Parent Story",
  SIDE_STORY: "Side Story",
  CHARACTER: "Features Character",
  SUMMARY: "Summary",
  ALTERNATIVE: "Alternative Version",
  SPIN_OFF: "Spin-Off",
  OTHER: "Other",
  SOURCE: "Original Source",
  COMPILATION: "Compilation",
  CONTAINS: "Contains",
};

const MediaIcon = ({
  format,
  type,
}: {
  format?: string | null;
  type?: string | null;
}) => {
  const itemType = type?.toUpperCase();
  const itemFormat = format?.toUpperCase();

  if (itemType === "MANGA" || itemType === "NOVEL" || itemType === "ONE_SHOT")
    return <MangaIcon size={16} className="mr-1.5 text-gray-500" />;
  if (itemFormat === "TV" || itemFormat === "TV_SHORT")
    return <Tv size={16} className="mr-1.5 text-gray-500" />;
  if (itemFormat === "MOVIE")
    return <Film size={16} className="mr-1.5 text-gray-500" />;
  return <Link2 size={16} className="mr-1.5 text-gray-500" />;
};

const AnimeRelations: React.FC<AnimeRelationsProps> = ({
  relations,
  title = "Related Anime & Manga",
}) => {
  if (!relations || relations.length === 0) {
    return null;
  }
  const groupedRelations: Record<string, AnilistMediaRelationEdge[]> = {};
  relations.forEach((edge) => {
    if (!edge.node || !edge.node.id) return;

    const typeKey = edge.relationType?.toUpperCase() || "OTHER";
    const displayType =
      RelationTypeMap[typeKey] ||
      edge.relationType?.replace(/_/g, " ") ||
      "Related";

    if (!groupedRelations[displayType]) {
      groupedRelations[displayType] = [];
    }
    groupedRelations[displayType].push(edge);
  });

  if (Object.keys(groupedRelations).length === 0) return null;

  return (
    <section className="mb-8 md:mb-12">
      <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center">
        <Link2 className="mr-2 text-brand-secondary" /> {title}
      </h2>
      <div className="space-y-5">
        {Object.entries(groupedRelations).map(
          ([relationDisplayType, edges]) => (
            <div key={relationDisplayType}>
              <h3 className="text-md font-semibold mb-2 text-text-secondary-light dark:text-text-secondary-dark">
                {relationDisplayType}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {edges.map((edge) => {
                  const media = edge.node;
                  if (!media || !media.id) return null;

                  const displayTitle =
                    media.title?.userPreferred || "Unknown Title";
                  const imageUrl =
                    media.coverImage?.medium || "/placeholder-anime.png";
                  const linkUrl =
                    media.type?.toUpperCase() === "ANIME"
                      ? `/anime/${media.id}`
                      : media.siteUrl || "#";

                  return (
                    <LinkAR
                      href={linkUrl}
                      key={edge.id}
                      className="card-bg p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-start space-x-3"
                      target={linkUrl.startsWith("http") ? "_blank" : "_self"}
                      rel={
                        linkUrl.startsWith("http") ? "noopener noreferrer" : ""
                      }
                    >
                      <div className="flex-shrink-0 w-16 h-24 relative">
                        <ImageAR
                          src={imageUrl}
                          alt={displayTitle}
                          fill
                          sizes="64px"
                          style={{ objectFit: "cover" }}
                          className="rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark hover:text-brand-primary truncate"
                          title={displayTitle}
                        >
                          {displayTitle}
                        </h4>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark flex items-center capitalize">
                          <MediaIcon format={media.format} type={media.type} />
                          {media.format?.replace(/_/g, " ") ||
                            media.type?.replace(/_/g, " ")}
                          {media.status && <span className="mx-1">&bull;</span>}
                          {media.status?.replace(/_/g, " ").toLowerCase()}
                        </p>
                      </div>
                    </LinkAR>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default AnimeRelations;
