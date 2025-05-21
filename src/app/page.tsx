// src/app/page.tsx
import LinkHP from "next/link";
import { ArrowRight, CalendarClock, TrendingUp, Zap } from "lucide-react";
import { AnilistMedia, AnilistResponse, AnilistPage } from "@/@types/types";
import AnimeCard from "@/components/shared/AnimeCard";
import PageTitle from "@/components/shared/PageTitle";
import { getSeasonAnilistMedia, getTrendingAnilistMedia } from "@/services/api";
const getUniqueAnimesByAnilistIdHomepage = (
  animes: AnilistMedia[] | null | undefined,
  sourceName: string
): AnilistMedia[] => {
  if (!animes) return [];
  const uniqueMap = new Map<number, AnilistMedia>();
  for (const anime of animes) {
    if (anime && typeof anime.id === "number") {
      if (!uniqueMap.has(anime.id)) {
        uniqueMap.set(anime.id, anime);
      } else {
        console.log(`Duplicate ID found for ${sourceName}: ${anime.id}`);
      }
    }
  }
  return Array.from(uniqueMap.values());
};

async function AnimeSection({
  title,
  icon,
  animes,
  viewMoreLink,
  emptyMessage = "Could not load anime. Please try again later.",
}: {
  title: string;
  icon: React.ReactNode;
  animes: AnilistMedia[];
  viewMoreLink?: string;
  emptyMessage?: string;
}) {
  if (!animes || animes.length === 0) {
    return (
      <section className="mb-10 md:mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
          </h2>
        </div>
        <p className="text-text-muted-light dark:text-text-muted-dark p-4 card-bg rounded-md">
          {emptyMessage}
        </p>
      </section>
    );
  }
  return (
    <section className="mb-10 md:mb-12">
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <h2 className="text-xl md:text-2xl font-semibold flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h2>
        {viewMoreLink && (
          <LinkHP
            href={viewMoreLink}
            className="text-sm font-medium text-brand-primary hover:underline flex items-center"
          >
            View More <ArrowRight size={16} className="ml-1" />
          </LinkHP>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
        {animes.map((anime, index) => (
          <AnimeCard key={anime.id} anime={anime} priorityImage={index < 6} />
        ))}
      </div>
    </section>
  );
}

const getCurrentAnilistSeason = (): {
  season: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  year: number;
} => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  if (month >= 0 && month <= 2) return { season: "WINTER", year: year };
  if (month >= 3 && month <= 5) return { season: "SPRING", year: year };
  if (month >= 6 && month <= 8) return { season: "SUMMER", year: year };
  return { season: "FALL", year: year };
};

const getNextAnilistSeason = (): {
  season: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  year: number;
} => {
  const now = new Date();
  let month = now.getMonth();
  let year = now.getFullYear();

  if (month >= 0 && month <= 2) return { season: "SPRING", year: year };
  if (month >= 3 && month <= 5) return { season: "SUMMER", year: year };
  if (month >= 6 && month <= 8) return { season: "FALL", year: year };
  return { season: "WINTER", year: year + 1 };
};

export default async function HomePage() {
  const currentSeasonInfo = getCurrentAnilistSeason();
  const nextSeasonInfo = getNextAnilistSeason();
  const results = await Promise.allSettled([
    getTrendingAnilistMedia(1, 12),
    getSeasonAnilistMedia(
      currentSeasonInfo.season,
      currentSeasonInfo.year,
      1,
      6
    ),
    getSeasonAnilistMedia(nextSeasonInfo.season, nextSeasonInfo.year, 1, 6, [
      "POPULARITY_DESC",
    ]),
  ]);
  const processData = (
    result: PromiseSettledResult<AnilistResponse<{ Page: AnilistPage }> | null>,
    name: string
  ) => {
    if (result.status === "fulfilled" && result.value?.data?.Page?.media) {
      return getUniqueAnimesByAnilistIdHomepage(
        result.value.data.Page.media,
        name
      );
    }
    console.error(
      `Failed to process data for ${name}:`,
      result.status === "rejected" ? result.reason : "No data returned from API"
    );
    return [];
  };

  const trendingAnimes = processData(results[0], "Trending");
  const currentSeasonAnimes = processData(results[1], "CurrentSeason");
  const upcomingSeasonAnimes = processData(results[2], "UpcomingSeason");

  return (
    <div>
      <PageTitle
        title="Welcome to AnimeHub!"
        subtitle="Your universe of anime, right at your fingertips."
      />
      <AnimeSection
        title="Trending Now"
        icon={<TrendingUp className="text-accent-pink" />}
        animes={trendingAnimes}
        viewMoreLink="/search?sort=TRENDING_DESC"
        emptyMessage="Trending anime couldn't be loaded. Check back soon!"
      />
      <AnimeSection
        title="Currently Airing"
        icon={<Zap className="text-accent-yellow" />}
        animes={currentSeasonAnimes}
        viewMoreLink={`/search?season=${currentSeasonInfo.season}&seasonYear=${currentSeasonInfo.year}`}
        emptyMessage="No currently airing shows found for this season."
      />
      <AnimeSection
        title="Coming Soon"
        icon={<CalendarClock className="text-accent-purple" />}
        animes={upcomingSeasonAnimes}
        viewMoreLink={`/anime/search?season=${nextSeasonInfo.season}&seasonYear=${nextSeasonInfo.year}`}
        emptyMessage="Information about upcoming shows is not available yet."
      />
    </div>
  );
}
