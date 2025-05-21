// src/app/calendar/page.tsx
import LinkCalendar from "next/link";
import ImageCalendar from "next/image";
import { CalendarDays, TvIcon, AlertTriangle, InfoIcon } from "lucide-react";
import { AnilistMedia } from "@/@types/types";
import PageTitle from "@/components/shared/PageTitle";
import { searchAnilistMedia } from "@/services/api";
import { getDayOfWeek, getFormattedAiringTime, getSeason } from "@/lib/utils";

interface AiringSchedule {
  [key: string]: AnilistMedia[];
}

const DAYS_OF_WEEK_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type SeasonName = "WINTER" | "SPRING" | "SUMMER" | "FALL";
async function getReleasingAnimeForSeason(
  season: SeasonName,
  seasonYear: number,
  isFallback: boolean = false
): Promise<{ anime: AnilistMedia[]; season: SeasonName; year: number }> {
  let allReleasingAnime: AnilistMedia[] = [];
  let page = 1;
  const perPage = 50;
  let hasNextPage = true;

  const logPrefix = isFallback
    ? `[getReleasingAnimeForSeason - FALLBACK]`
    : `[getReleasingAnimeForSeason]`;
  console.log(`${logPrefix} Fetching for ${season} ${seasonYear}`);

  while (hasNextPage) {
    const response = await searchAnilistMedia({
      season,
      seasonYear,
      status: "RELEASING",
      sort: ["POPULARITY_DESC"],
      perPage,
      page,
      isAdult: false,
    });

    if (response?.data?.Page?.media) {
      allReleasingAnime = [...allReleasingAnime, ...response.data.Page.media];
    } else if (response?.errors) {
      console.error(
        `${logPrefix} API errors on page ${page} for ${season} ${seasonYear}:`,
        response.errors
      );
    }

    hasNextPage = response?.data?.Page?.pageInfo?.hasNextPage || false;
    if (hasNextPage) {
      page++;
    } else {
      break;
    }
  }
  return { anime: allReleasingAnime, season, year: seasonYear };
}
function groupAndDistributeAnime(animeList: AnilistMedia[]): AiringSchedule {
  const schedule: AiringSchedule = {};
  DAYS_OF_WEEK_ORDER.forEach((day) => (schedule[day] = []));

  const withAiringTime: AnilistMedia[] = [];
  const withoutAiringTime: AnilistMedia[] = [];

  animeList.forEach((anime) => {
    if (anime.nextAiringEpisode?.airingAt) {
      withAiringTime.push(anime);
    } else {
      withoutAiringTime.push(anime);
    }
  });
  withAiringTime.forEach((anime) => {
    const dayOfWeek = getDayOfWeek(anime.nextAiringEpisode!.airingAt!);
    if (schedule[dayOfWeek]) {
      schedule[dayOfWeek].push(anime);
    } else {
      schedule[DAYS_OF_WEEK_ORDER[0]].push(anime);
    }
  });
  let dayIndexForRandomDistribution = 0;
  withoutAiringTime.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  withoutAiringTime.forEach((anime) => {
    const targetDay =
      DAYS_OF_WEEK_ORDER[
        dayIndexForRandomDistribution % DAYS_OF_WEEK_ORDER.length
      ];
    schedule[targetDay].push(anime);
    dayIndexForRandomDistribution++;
  });
  for (const day in schedule) {
    schedule[day].sort((a, b) => {
      const aHasTime = !!a.nextAiringEpisode?.airingAt;
      const bHasTime = !!b.nextAiringEpisode?.airingAt;

      if (aHasTime && bHasTime) {
        return a.nextAiringEpisode!.airingAt! - b.nextAiringEpisode!.airingAt!;
      }
      if (aHasTime) return -1;
      if (bHasTime) return 1;
      return (b.popularity || 0) - (a.popularity || 0) || a.id - b.id;
    });
  }
  return schedule;
}
function getPreviousSeason(
  currentSeason: SeasonName,
  currentYear: number
): { season: SeasonName; year: number } {
  switch (currentSeason) {
    case "SPRING":
      return { season: "WINTER", year: currentYear };
    case "SUMMER":
      return { season: "SPRING", year: currentYear };
    case "FALL":
      return { season: "SUMMER", year: currentYear };
    case "WINTER":
      return { season: "FALL", year: currentYear - 1 };
    default:
      const exhaustiveCheck: never = currentSeason;
      console.error(
        `[getPreviousSeason] Unexpected season: ${exhaustiveCheck}`
      );
      return { season: "FALL", year: currentYear - 1 };
  }
}

export default async function CalendarPage() {
  const currentDate = new Date();
  const initialYear = currentDate.getFullYear();
  const initialSeason = getSeason(currentDate);

  let airingSchedule: AiringSchedule = {};
  let fetchError: string | null = null;
  let finalSeasonDisplayed: SeasonName = initialSeason;
  let finalYearDisplayed: number = initialYear;
  let fetchedAnimeForDisplay: AnilistMedia[] = [];

  try {
    let result = await getReleasingAnimeForSeason(initialSeason, initialYear);
    fetchedAnimeForDisplay = result.anime;

    if (fetchedAnimeForDisplay.length === 0) {
      const fallbackSeasonInfo = getPreviousSeason(initialSeason, initialYear);
      result = await getReleasingAnimeForSeason(
        fallbackSeasonInfo.season,
        fallbackSeasonInfo.year,
        true
      );

      if (result.anime.length > 0) {
        fetchedAnimeForDisplay = result.anime;
        finalSeasonDisplayed = fallbackSeasonInfo.season;
        finalYearDisplayed = fallbackSeasonInfo.year;
        console.log(
          `[CalendarPage] Fallback successful. Displaying RELEASING anime from ${finalSeasonDisplayed} ${finalYearDisplayed}.`
        );
      } else {
        console.log(
          `[CalendarPage] Fallback to ${fallbackSeasonInfo.season} ${fallbackSeasonInfo.year} also yielded no RELEASING data.`
        );
      }
    } else {
      console.log(
        `[CalendarPage] RELEASING Data found for initial season ${initialSeason} ${initialYear}.`
      );
    }

    if (fetchedAnimeForDisplay.length > 0) {
      airingSchedule = groupAndDistributeAnime(fetchedAnimeForDisplay);
    }
  } catch (error: any) {
    console.error("[CalendarPage] Error during fetch or processing:", error);
    fetchError =
      error.message || "Could not load anime schedule. Please try again later.";
  }

  const hasAiringData = Object.values(airingSchedule).some(
    (dayList) => dayList.length > 0
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <PageTitle
        title="Anime Season Schedule"
        subtitle={`Current View: ${
          finalSeasonDisplayed.charAt(0) +
          finalSeasonDisplayed.slice(1).toLowerCase()
        } ${finalYearDisplayed}`}
        icon={
          <CalendarDays
            size={36}
            className="text-indigo-600 dark:text-indigo-400"
          />
        }
      />

      {fetchError && (
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-xl text-center flex flex-col items-center justify-center my-10 max-w-lg mx-auto">
          <AlertTriangle size={56} className="text-red-500 mb-5" />
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Error Loading Schedule
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-3 text-base">
            {fetchError}
          </p>
        </div>
      )}

      {!fetchError && !hasAiringData && (
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-xl text-center flex flex-col items-center justify-center my-10 min-h-[350px] max-w-lg mx-auto">
          <InfoIcon
            size={56}
            className="text-indigo-500 dark:text-indigo-400 mb-5"
          />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            No Releasing Shows Found
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-3 text-base">
            No "Releasing" shows currently found for the{" "}
            {`${finalSeasonDisplayed.toLowerCase()} ${finalYearDisplayed}`}{" "}
            season on AniList. This could be due to data availability or the
            time of year.
          </p>
        </div>
      )}

      {!fetchError && hasAiringData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {DAYS_OF_WEEK_ORDER.map((day) => {
            const animeForDay = airingSchedule[day];
            if (animeForDay && animeForDay.length > 0) {
              return (
                <div
                  key={day}
                  className="bg-white dark:bg-slate-800 p-4 md:p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col border border-slate-200 dark:border-slate-700 min-h-[300px]" // min-height for consistency
                >
                  <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-5 border-b-2 border-indigo-500 dark:border-indigo-400 pb-3 text-slate-800 dark:text-slate-100">
                    {day}
                  </h2>
                  <ul className="space-y-4 flex-grow">
                    {animeForDay.map((anime) => (
                      <li
                        key={anime.id}
                        className="flex items-start space-x-3 md:space-x-4 p-2.5 md:p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-200 group"
                      >
                        <LinkCalendar
                          href={`/anime/${anime.id}`}
                          className="flex-shrink-0"
                        >
                          <div className="relative w-16 h-24 md:w-20 md:h-28 rounded-md overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                            {anime.coverImage?.large ||
                            anime.coverImage?.medium ? (
                              <ImageCalendar
                                src={
                                  anime.coverImage.large ||
                                  anime.coverImage.medium!
                                }
                                alt={
                                  anime.title?.userPreferred || "Anime cover"
                                }
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 768px) 15vw, (max-width: 1024px) 10vw, 7vw"
                                className="group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                <TvIcon
                                  className="text-slate-400 dark:text-slate-500"
                                  size={32}
                                />
                              </div>
                            )}
                          </div>
                        </LinkCalendar>
                        <div className="flex-grow min-w-0 pt-1">
                          <LinkCalendar href={`/anime/${anime.id}`}>
                            <h3
                              className="text-sm md:text-base font-semibold text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-700 dark:hover:text-indigo-300 truncate transition-colors"
                              title={
                                anime.title?.userPreferred || "Untitled Anime"
                              }
                            >
                              {anime.title?.userPreferred || "Untitled Anime"}
                            </h3>
                          </LinkCalendar>
                          {anime.nextAiringEpisode?.airingAt ? (
                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                              Ep {anime.nextAiringEpisode.episode}:{" "}
                              {getFormattedAiringTime(
                                anime.nextAiringEpisode.airingAt
                              )}
                            </p>
                          ) : (
                            <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 italic mt-0.5">
                              Airing time N/A
                            </p>
                          )}
                          {anime.studios?.edges?.[0]?.node?.name && (
                            <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                              {anime.studios.edges.find((e) => e.isMain)?.node
                                .name || anime.studios.edges[0].node.name}
                            </p>
                          )}
                          {anime.genres && anime.genres.length > 0 && (
                            <p
                              className="text-[10px] md:text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 truncate"
                              title={anime.genres.join(", ")}
                            >
                              {anime.genres.slice(0, 3).join(", ")}
                              {anime.genres.length > 3 ? "..." : ""}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            return (
              <div
                key={day}
                className="bg-white dark:bg-slate-800 p-4 md:p-5 rounded-xl shadow-lg flex flex-col border border-slate-200 dark:border-slate-700 opacity-70 min-h-[300px]"
              >
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-5 border-b-2 border-slate-300 dark:border-slate-600 pb-3 text-slate-500 dark:text-slate-400">
                  {day}
                </h2>
                <div className="flex-grow flex items-center justify-center">
                  <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                    No releases scheduled.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400 max-w-3xl mx-auto">
        <p className="mb-1">
          Airing times (if available) are displayed in your local timezone.
        </p>
        <p>
          Shows without specific airing times are distributed across days for
          illustrative purposes. Data sourced from AniList.
        </p>
      </div>
    </div>
  );
}
