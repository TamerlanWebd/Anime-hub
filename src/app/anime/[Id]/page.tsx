import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Tv,
  Film,
  Users as UsersIcon,
  Calendar,
  Clock,
  Info as InfoIcon,
  Globe,
  BookOpen,
  Users2,
  Clapperboard,
} from "lucide-react";

import { formatCount } from "@/lib/utils";
import PageTitle from "@/components/shared/PageTitle";
import { getAnilistMediaById } from "@/services/api";
import ScrollToTopButton from "@/app/anime/[Id]/components/ScrollToTopButton";
import AnimeTrailer from "@/app/anime/[Id]/components/AnimeTrailer";
import AnimePlayerEmbed from "./components/AnimePlayerEmbed";
import AnimeRelations from "./components/AnimeRelations";
import AnimeCharacters from "./components/AnimeCharacters";
import AnimeRecommendations from "./components/AnimeRecommendations";
import AnimeUserStatusManager from "./components/AnimeUserStatusManager";
import { AnilistMedia } from "@/@types/types";
import AddToWatchlistButton from "./components/AddToWatchlistButton";

interface AnimePlayerData {
  titleForDebug: string;
  anilistIds: number[];
  playerUrl: string;
}

const ANIME_PLAYERS_DATA: AnimePlayerData[] = [
  {
    titleForDebug: "One Piece",
    anilistIds: [21],
    playerUrl:
      "https://thesaurus.allarknow.online/?token_movie=9b17a12a903c39ebcfbcc103aca350&translation=66&token=45e20a5f584becf7a64dffb7174ddf",
  },
  {
    titleForDebug: "Death Note",
    anilistIds: [1535],
    playerUrl:
      "https://thesaurus.allarknow.online/?token_movie=67ad9a509696c522a7daa1fa27336a&translation=66&token=45e20a5f584becf7a64dffb7174ddf",
  },
  {
    titleForDebug: "Kimetsu no Yaiba",
    anilistIds: [101922, 112151, 129874, 142329, 145139, 163699],
    playerUrl:
      "https://thesaurus.allarknow.online/?token_movie=9ceb642cd6ce5e013fe7a9922430a9&translation=220&token=45e20a5f584becf7a64dffb7174ddf",
  },
  {
    titleForDebug: "Jujutsu Kaisen",
    anilistIds: [113415, 129577, 145064],
    playerUrl:
      "https://thesaurus.allarknow.online/?token_movie=9e3008d4a2ef931d37403be3cdbf36&translation=197&token=45e20a5f584becf7a64dffb7174ddf",
  },
  {
    titleForDebug: "Boku no Hero Academia",
    anilistIds: [21459, 21856, 100166, 108998, 126685, 142938, 162280],
    playerUrl:
      "https://thesaurus.allarknow.online/?token_movie=16a6d566f65512b83fc1bc595b5276&translation=241&token=45e20a5f584becf7a64dffb7174ddf",
  },
  {
    titleForDebug: "HUNTER×HUNTER (2011)",
    anilistIds: [11061],
    playerUrl:
      "https://thesaurus.allarknow.online/?token_movie=9c2fca0f547ed6868c8d87e1fd8cea&translation=103&token=45e20a5f584becf7a64dffb7174ddf",
  },
  {
    titleForDebug: "One Punch Man",
    anilistIds: [21087, 107419],
    playerUrl:
      "https://thesaurus.allarknow.online/?token_movie=f78ac3ff805dfe1461ea3922b48392&translation=158&token=45e20a5f584becf7a64dffb7174ddf",
  },
  {
    titleForDebug: "Tokyo Ghoul",
    anilistIds: [20605, 20850, 100240, 103502],
    playerUrl:
      "https://thesaurus.allarknow.online/?token_movie=0865307b3935ba9e688544a5734b70&translation=10&token=45e20a5f584becf7a64dffb7174ddf",
  },
  {
    titleForDebug: "Sword Art Online",
    anilistIds: [11757, 20594, 21803, 101138, 110124, 116588, 132999, 155932],
    playerUrl:
      "https://thesaurus.allarknow.online/?token_movie=6a9ad74275c5911e340c7d586deb8b&translation=197&token=45e20a5f584becf7a64dffb7174ddf",
  },
  {
    titleForDebug: "Fullmetal Alchemist: Brotherhood",
    anilistIds: [5114],
    playerUrl:
      "https://thesaurus.allarknow.online/?token_movie=38d9d74d2e5576651a1d93eb41f75a&translation=66&token=45e20a5f584becf7a64dffb7174ddf",
  },
  {
    titleForDebug: "NARUTO",
    anilistIds: [20],
    playerUrl:
      "https://thesaurus.allarknow.online/?token_movie=f174d1e9bc42d32d073a2914fd1334&translation=66&token=45e20a5f584becf7a64dffb7174ddf",
  },
  {
    titleForDebug: "Kimi no Na wa.",
    anilistIds: [21519],
    playerUrl:
      "https://thesaurus.allarknow.online/?token_movie=42f9f12e2a556e47fc29d732ae8815&translation=66&token=45e20a5f584becf7a64dffb7174ddf",
  },
  {
    titleForDebug: "Attack on Titan",
    anilistIds: [
      16498, 20958, 21281, 21718, 99147, 104277, 110277, 131681, 154552, 163169,
    ],
    playerUrl:
      "https://thesaurus.allarknow.online/?token_movie=7bc2f2ea7973f85b7609512c636999&translation=66&token=45e20a5f584becf7a64dffb7174ddf",
  },
];

const DynamicBackground = ({ imageUrl }: { imageUrl?: string }) => {
  if (!imageUrl) return null;
  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden" aria-hidden="true">
      <Image
        src={imageUrl}
        alt="Dynamic Background"
        fill
        sizes="100vw"
        style={{ objectFit: "cover" }}
        className="opacity-10 dark:opacity-5 blur-2xl scale-110"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background-light/60 via-background-light/90 to-background-light dark:from-background-dark/60 dark:via-background-dark/90 dark:to-background-dark"></div>
    </div>
  );
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null | boolean;
  className?: string;
}
const DetailItem: React.FC<DetailItemProps> = ({
  icon,
  label,
  value,
  className,
}) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (typeof value === "number" && isNaN(value))
  )
    return null;
  return (
    <div className={`flex items-start text-sm ${className}`}>
      <span className="mr-2 mt-0.5 text-text-muted-light dark:text-text-muted-dark flex-shrink-0">
        {icon}
      </span>
      <div>
        <span className="font-medium text-text-secondary-light dark:text-text-secondary-dark">
          {label}:
        </span>
        <span className="text-text-primary-light dark:text-text-primary-dark">
          {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
        </span>
      </div>
    </div>
  );
};

export async function generateMetadata({
  params,
}: {
  params: { Id?: string };
}) {
  const resolvedParams = await params;
  const idFromParams = resolvedParams.Id;
  const anilistId = idFromParams ? parseInt(idFromParams, 10) : NaN;

  if (isNaN(anilistId)) {
    return { title: `Invalid Anime ID: ${idFromParams || "none provided"}` };
  }

  const animeData = await getAnilistMediaById(anilistId);
  const anime = animeData?.data?.Media;

  if (!anime) {
    return { title: "Anime Not Found" };
  }

  const title =
    anime.title?.userPreferred ||
    anime.title?.english ||
    anime.title?.romaji ||
    "Anime Details";
  const descriptionText = anime.description
    ? anime.description.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "")
    : "No synopsis available.";

  return {
    title,
    description:
      descriptionText.substring(0, 160) +
      (descriptionText.length > 160 ? "..." : ""),
    openGraph: {
      title,
      description:
        descriptionText.substring(0, 160) +
        (descriptionText.length > 160 ? "..." : ""),
      images: [
        {
          url:
            anime.coverImage?.extraLarge ||
            anime.coverImage?.large ||
            anime.coverImage?.medium ||
            "",
          width: anime.coverImage?.large
            ? 600
            : anime.coverImage?.medium
            ? 400
            : undefined,
          height: anime.coverImage?.large
            ? 900
            : anime.coverImage?.medium
            ? 600
            : undefined,
          alt: title,
        },
      ],
    },
  };
}

export default async function AnimeDetailPage({
  params,
}: {
  params: { Id?: string };
}) {
  const resolvedParams = await params;
  const idFromParams = resolvedParams.Id;
  const anilistId = idFromParams ? parseInt(idFromParams, 10) : NaN;

  if (isNaN(anilistId)) {
    return (
      <div className="container mx-auto py-10 text-center">
        <PageTitle
          title="Invalid Anime ID"
          subtitle={`The provided ID ("${
            idFromParams || "none"
          }") is not a valid number.`}
        />
        <h1 className="text-2xl font-bold mt-4">Invalid Anime ID</h1>
        <p>
          The provided ID ("{idFromParams || "none"}") is not a valid number.
        </p>
        <p className="text-sm mt-2">
          Full params: {JSON.stringify(resolvedParams)}
        </p>
      </div>
    );
  }

  const animeDataResult = await getAnilistMediaById(anilistId);
  const anime = animeDataResult?.data?.Media;

  if (!anime) {
    return (
      <div className="container mx-auto py-10 text-center">
        <PageTitle
          title="Anime Not Found"
          subtitle="The requested anime could not be found or there was an API error."
        />
        <h1 className="text-2xl font-bold">Anime Not Found</h1>
        <p>The requested anime could not be found or there was an API error.</p>
      </div>
    );
  }

  const mainImageUrl =
    anime.coverImage?.extraLarge ||
    anime.coverImage?.large ||
    anime.coverImage?.medium ||
    "/placeholder-anime.png";
  const displayTitle =
    anime.title?.userPreferred ||
    anime.title?.english ||
    anime.title?.romaji ||
    "Untitled Anime";

  const synopsisHtml = anime.description
    ? anime.description
        .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '<p class="my-1 md:my-1.5"></p>')
        .replace(/<br\s*\/?>/gi, "<br />")
    : "<p>No synopsis available.</p>";

  let playerSrcForThisAnime: string | undefined = undefined;
  const foundPlayerData = ANIME_PLAYERS_DATA.find((playerData) =>
    playerData.anilistIds.includes(anime.id)
  );
  if (foundPlayerData) {
    playerSrcForThisAnime = foundPlayerData.playerUrl;
  }

  return (
    <div className="relative min-h-screen">
      <DynamicBackground imageUrl={anime.bannerImage || mainImageUrl} />
      <ScrollToTopButton />

      <section className="relative mb-8 md:mb-12 pt-6 md:pt-8">
        <div className="container mx-auto px-4">
          <div className="md:flex md:space-x-8 items-start">
            <div className="md:w-1/3 lg:w-1/4 mb-6 md:mb-0 flex-shrink-0">
              <div className="aspect-[2/3] relative rounded-lg shadow-xl overflow-hidden border-2 border-white/10 dark:border-black/20">
                <Image
                  src={mainImageUrl}
                  alt={displayTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  style={{ objectFit: "cover" }}
                  priority
                  className="rounded-lg"
                />
              </div>
              <AnimeUserStatusManager
                anime={anime as AnilistMedia}
                className="mt-4 w-full"
              />
              <AddToWatchlistButton
                anime={anime as AnilistMedia}
                className="mt-4 w-full"
              ></AddToWatchlistButton>
              {anime.siteUrl && (
                <Link
                  href={anime.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full btn btn-outline flex items-center justify-center space-x-2 text-sm"
                >
                  <Globe size={16} /> <span>View on AniList</span>
                </Link>
              )}
            </div>
            <div className="md:w-2/3 lg:w-3/4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display mb-1 text-text-primary-light dark:text-text-primary-dark">
                {displayTitle}
              </h1>
              {anime.title?.native && (
                <p className="text-md text-text-secondary-light dark:text-text-secondary-dark mb-3">
                  {anime.title.native}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {typeof anime.averageScore === "number" && (
                  <span className="flex items-center font-semibold">
                    <Star
                      size={18}
                      className="mr-1 text-accent-yellow fill-accent-yellow/70"
                    />
                    {(anime.averageScore / 10).toFixed(1)}/10
                    {typeof anime.popularity === "number" &&
                      ` (${formatCount(anime.popularity)} users)`}
                  </span>
                )}
                {anime.format && (
                  <span className="flex items-center">
                    {anime.format === "TV" || anime.format === "TV_SHORT" ? (
                      <Tv size={18} className="mr-1" />
                    ) : (
                      <Film size={18} className="mr-1" />
                    )}
                    {anime.format.replace(/_/g, " ")}
                  </span>
                )}
                {anime.status && (
                  <span className="capitalize">
                    {anime.status.replace(/_/g, " ").toLowerCase()}
                  </span>
                )}
                {typeof anime.episodes === "number" && (
                  <span>{anime.episodes} episodes</span>
                )}
              </div>

              {anime.description && (
                <div className="mb-5">
                  <h3 className="text-lg font-semibold mb-1.5 flex items-center text-text-primary-light dark:text-text-primary-dark">
                    <InfoIcon size={18} className="mr-2 text-brand-primary" />
                    Synopsis
                  </h3>
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none text-text-secondary-light dark:text-text-secondary-dark leading-relaxed max-h-60 overflow-y-auto pr-2 custom-scrollbar"
                    dangerouslySetInnerHTML={{ __html: synopsisHtml }}
                  />
                </div>
              )}

              {(anime.genres?.length || 0) > 0 && (
                <div className="mb-5">
                  <h3 className="text-lg font-semibold mb-1.5 text-text-primary-light dark:text-text-primary-dark">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres?.map((genreName) => (
                      <Link
                        key={genreName}
                        href={`/anime/search?genres=${encodeURIComponent(
                          genreName
                        )}`}
                        className="text-xs bg-gray-200 dark:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark px-2.5 py-1 rounded-full hover:bg-brand-primary hover:text-white dark:hover:bg-brand-primary transition-colors"
                      >
                        {genreName}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-5">
                <DetailItem
                  icon={<Clapperboard size={16} />}
                  label="Format"
                  value={anime.format?.replace(/_/g, " ")}
                />
                {anime.startDate?.year && (
                  <DetailItem
                    icon={<Calendar size={16} />}
                    label="Aired"
                    value={`${anime.startDate.day || ""}${
                      anime.startDate.month ? "/" + anime.startDate.month : ""
                    }/${anime.startDate.year} to ${anime.endDate?.day || ""}${
                      anime.endDate?.month ? "/" + anime.endDate.month : ""
                    }/${anime.endDate?.year || "?"}`}
                  />
                )}
                <DetailItem
                  icon={<Tv size={16} />}
                  label="Episodes"
                  value={anime.episodes}
                />
                <DetailItem
                  icon={<Clock size={16} />}
                  label="Duration"
                  value={anime.duration ? `${anime.duration} min/ep` : null}
                />
                <DetailItem
                  icon={<BookOpen size={16} />}
                  label="Source"
                  value={anime.source?.replace(/_/g, " ")}
                />
                <DetailItem
                  icon={<Calendar size={16} />}
                  label="Season"
                  value={
                    `${anime.season || ""} ${anime.seasonYear || ""}`.trim() ||
                    null
                  }
                />
                <DetailItem
                  icon={<Users2 size={16} />}
                  label="Adult Content"
                  value={anime.isAdult}
                />
                <DetailItem
                  icon={<UsersIcon size={16} />}
                  label="Popularity Rank"
                  value={
                    typeof anime.popularity === "number"
                      ? `#${formatCount(anime.popularity)}`
                      : null
                  }
                />
                <DetailItem
                  icon={<Star size={16} />}
                  label="Favourites Count"
                  value={
                    typeof anime.favourites === "number"
                      ? formatCount(anime.favourites)
                      : null
                  }
                />
              </div>

              {anime.studios?.edges &&
                anime.studios.edges.filter((e) => e.isMain).length > 0 && (
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                      Studios:
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {anime.studios.edges
                        .filter((e) => e.isMain)
                        .map((edge) => (
                          <Link
                            key={edge.node.id}
                            href={`/studios/${edge.node.id}`}
                            className="text-sm text-brand-primary hover:underline"
                          >
                            {edge.node.name}
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <AnimeTrailer
          youtubeTrailerId={
            anime.trailer?.site === "youtube" ? anime.trailer.id : null
          }
          animeTitle={displayTitle}
        />
        <AnimePlayerEmbed
          playerSrc={playerSrcForThisAnime}
          animeTitle={displayTitle}
        />
        <AnimeRelations relations={anime.relations?.edges} />
        <AnimeCharacters characters={anime.characters?.edges} />
        <AnimeRecommendations recommendations={anime.recommendations?.nodes} />
      </div>
    </div>
  );
}
