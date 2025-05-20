// src/app/anime/[id]/components/AnimeCharacters.tsx
"use client";
import ReactChar from "react";
import LinkChar from "next/link";
import ImageChar from "next/image";
import { Users, Mic } from "lucide-react";
import { AnilistCharacterEdge } from "@/@types/types";
interface AnimeCharactersProps {
  characters: AnilistCharacterEdge[] | null | undefined;
  title?: string;
}

const CharacterImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="w-16 h-24 relative rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <ImageChar
      src={src}
      alt={alt}
      fill
      sizes="64px"
      style={{ objectFit: "cover" }}
    />
  </div>
);

const CharacterName = ({ name }: { name: string }) => (
  <h4
    className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark hover:text-brand-primary truncate"
    title={name}
  >
    {name}
  </h4>
);
export default function AnimeCharacters({
  characters,
  title = "Main Characters & Voice Actors",
}: AnimeCharactersProps) {
  if (!characters || characters.length === 0) {
    return null;
  }

  const mainAndSupportingCharacters = characters
    .filter(
      (edge) =>
        edge.node && (edge.role === "MAIN" || edge.role === "SUPPORTING")
    )
    .sort((a, b) => {
      if (a.role === "MAIN" && b.role !== "MAIN") return -1;
      if (a.role !== "MAIN" && b.role === "MAIN") return 1;
      return (a.node?.id || 0) - (b.node?.id || 0);
    })
    .slice(0, 12);

  if (mainAndSupportingCharacters.length === 0) return null;

  return (
    <section className="mb-8 md:mb-12">
      <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center">
        <Users className="mr-2 text-accent-purple" /> {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
        {mainAndSupportingCharacters.map((edge) => {
          const character = edge.node;
          const voiceActor =
            edge.voiceActors?.find(
              (va) => va.languageV2?.toUpperCase() === "JAPANESE"
            ) || edge.voiceActors?.[0];

          if (!character || !character.id) return null;

          const charName =
            character.name?.userPreferred ||
            character.name?.native ||
            "Unknown Character";
          const charImage =
            character.image?.large ||
            character.image?.medium ||
            "/placeholder-user.png";
          const charSiteUrl = character.siteUrl;

          const vaName = voiceActor?.name?.userPreferred;
          const vaImage = voiceActor?.image?.medium || "/placeholder-user.png";
          const vaSiteUrl = voiceActor?.siteUrl;

          return (
            <div
              key={`${character.id}-${edge.id}`}
              className="card-bg p-3 rounded-lg shadow-sm flex"
            >
              <div className="flex items-start space-x-2.5 flex-1 min-w-0">
                {charSiteUrl ? (
                  <LinkChar
                    href={charSiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <CharacterImage src={charImage} alt={charName} />
                  </LinkChar>
                ) : (
                  <CharacterImage src={charImage} alt={charName} />
                )}
                <div className="flex-1 min-w-0 pt-0.5">
                  {charSiteUrl ? (
                    <LinkChar
                      href={charSiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <CharacterName name={charName} />
                    </LinkChar>
                  ) : (
                    <CharacterName name={charName} />
                  )}
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark capitalize">
                    {edge.role?.toLowerCase().replace(/_/g, " ")}
                  </p>
                </div>
              </div>

              {voiceActor && (
                <div className="flex items-start space-x-2.5 flex-1 min-w-0 border-l border-border-light dark:border-border-dark pl-2.5 ml-2.5">
                  <div className="flex-1 min-w-0 text-right pt-0.5">
                    {vaSiteUrl ? (
                      <LinkChar
                        href={vaSiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <CharacterName name={vaName || "Unknown VA"} />
                      </LinkChar>
                    ) : (
                      <CharacterName name={vaName || "Unknown VA"} />
                    )}
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark flex items-center justify-end">
                      <Mic size={12} className="mr-1" />{" "}
                      {voiceActor.languageV2 || "VA"}
                    </p>
                  </div>
                  {vaSiteUrl ? (
                    <LinkChar
                      href={vaSiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0"
                    >
                      <CharacterImage
                        src={vaImage}
                        alt={vaName || "Voice Actor"}
                      />
                    </LinkChar>
                  ) : (
                    <CharacterImage
                      src={vaImage}
                      alt={vaName || "Voice Actor"}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {characters.length > mainAndSupportingCharacters.length && (
        <p className="text-xs text-center mt-4 text-text-muted-light dark:text-text-muted-dark">
          And {characters.length - mainAndSupportingCharacters.length} more
          characters...{" "}
          {mainAndSupportingCharacters[0]?.node?.siteUrl?.includes(
            "/character/"
          ) && (
            <a
              href={
                mainAndSupportingCharacters[0].node.siteUrl.split(
                  "/character/"
                )[0] + "/characters"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary hover:underline"
            >
              View all on AniList
            </a>
          )}
        </p>
      )}
    </section>
  );
}
