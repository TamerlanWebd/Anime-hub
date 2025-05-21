"use client";
import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Loader2, SearchIcon, XCircle, Filter, RotateCcw } from "lucide-react";
import {
  SearchAnilistMediaParams,
  AnilistMedia,
  AnilistPageInfo,
} from "@/@types/types";
import AnimeCard from "@/components/shared/AnimeCard";
import PageTitle from "@/components/shared/PageTitle";
import { searchAnilistMedia } from "@/services/api";
import PaginationControls from "./components/PaginationControls";
import { getUniqueAnimesByAnilistId } from "@/lib/utils";

const ANILIST_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
  "Boys Love",
  "Girls Love",
  "Gourmet",
  "Harem",
  "Historical",
  "Isekai",
  "Iyashikei",
  "Josei",
  "Kids",
  "Martial Arts",
  "Military",
  "Parody",
  "Police",
  "Post-Apocalyptic",
  "Reverse Harem",
  "School",
  "Seinen",
  "Shoujo",
  "Shounen",
  "Space",
  "Super Power",
  "Survival",
  "Time Travel",
  "Vampire",
  "Video Game",
  "Work Life",
].sort();

const ANILIST_FORMATS: SearchAnilistMediaParams["format"][] = [
  "TV",
  "TV_SHORT",
  "MOVIE",
  "SPECIAL",
  "OVA",
  "ONA",
  "MUSIC",
];
const ANILIST_STATUSES: SearchAnilistMediaParams["status"][] = [
  "RELEASING",
  "FINISHED",
  "NOT_YET_RELEASED",
  "CANCELLED",
  "HIATUS",
];
const ANILIST_SORTS: { value: string; label: string }[] = [
  { value: "POPULARITY_DESC", label: "Popularity" },
  { value: "SCORE_DESC", label: "Score" },
  { value: "TRENDING_DESC", label: "Trending" },
  { value: "FAVOURITES_DESC", label: "Favourites" },
  { value: "START_DATE_DESC", label: "Newest Airing" },
  { value: "START_DATE", label: "Oldest Airing" },
  { value: "TITLE_ROMAJI", label: "Title (A-Z)" },
  { value: "TITLE_ROMAJI_DESC", label: "Title (Z-A)" },
  { value: "EPISODES_DESC", label: "Episodes (Most)" },
  { value: "EPISODES", label: "Episodes (Fewest)" },
];

const SearchForm = ({
  initialParams,
  onSearch,
  isLoading,
}: {
  initialParams: SearchAnilistMediaParams;
  onSearch: (params: SearchAnilistMediaParams) => void;
  isLoading: boolean;
}) => {
  const [searchQuery, setSearchQuery] = useState(initialParams.search || "");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    initialParams.genres || []
  );
  const [selectedFormat, setSelectedFormat] = useState(
    initialParams.format || ""
  );
  const [selectedStatus, setSelectedStatus] = useState(
    initialParams.status || ""
  );
  const [selectedSort, setSelectedSort] = useState(
    (initialParams.sort && initialParams.sort[0]) || "POPULARITY_DESC"
  );
  const [showAllGenres, setShowAllGenres] = useState(false);
  const displayGenres = showAllGenres
    ? ANILIST_GENRES
    : ANILIST_GENRES.slice(0, 15);

  const handleGenreChange = (genre: string) =>
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      search: searchQuery.trim() || undefined,
      genres: selectedGenres.length > 0 ? selectedGenres : undefined,
      format:
        (selectedFormat as SearchAnilistMediaParams["format"]) || undefined,
      status:
        (selectedStatus as SearchAnilistMediaParams["status"]) || undefined,
      sort: [selectedSort],
      page: 1,
    });
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedGenres([]);
    setSelectedFormat("");
    setSelectedStatus("");
    setSelectedSort("POPULARITY_DESC");
    onSearch({ page: 1, sort: ["POPULARITY_DESC"] });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 p-5 sm:p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg"
    >
      <div className="relative mb-5">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search anime by title..."
          className="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-base"
          disabled={isLoading}
        />
        <SearchIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
          Genres:
        </label>
        <div className="flex flex-wrap gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700/50">
          {displayGenres.map((g) => (
            <button
              type="button"
              key={g}
              onClick={() => handleGenreChange(g)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-700 focus:ring-indigo-500/80
                ${
                  selectedGenres.includes(g)
                    ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-600"
                }`}
              disabled={isLoading}
            >
              {g}
            </button>
          ))}
          {ANILIST_GENRES.length > 15 && (
            <button
              type="button"
              onClick={() => setShowAllGenres((prev) => !prev)}
              className="px-3 py-1.5 text-xs font-medium rounded-full text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none focus:ring-1 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {showAllGenres
                ? "Show Less"
                : `Show ${ANILIST_GENRES.length - 15} More...`}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-6">
        <div>
          <label
            htmlFor="format_select"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Format:
          </label>
          <select
            id="format_select"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            disabled={isLoading}
          >
            <option value="">All Formats</option>
            {ANILIST_FORMATS.map((f) => (
              <option key={f} value={f}>
                {f!.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="status_select"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Status:
          </label>
          <select
            id="status_select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            disabled={isLoading}
          >
            <option value="">All Statuses</option>
            {ANILIST_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s!
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="sort_select"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Sort By:
          </label>
          <select
            id="sort_select"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            disabled={isLoading}
          >
            {ANILIST_SORTS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-500 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          disabled={isLoading}
        >
          <RotateCcw size={16} className="mr-1.5" /> Reset
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin mr-2" />
          ) : (
            <Filter size={16} className="mr-2" />
          )}
          Apply Filters
        </button>
      </div>
    </form>
  );
};

function SearchResultsDisplay() {
  const searchParamsHook = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [results, setResults] = useState<AnilistMedia[] | null>(null);
  const [pageInfo, setPageInfo] = useState<AnilistPageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildSearchParamsFromURL = useCallback((): SearchAnilistMediaParams => {
    const params: SearchAnilistMediaParams = {
      page: parseInt(searchParamsHook.get("page") || "1", 10),
      perPage: 24,
      isAdult: false,
    };
    const searchVal = searchParamsHook.get("search");
    if (searchVal) params.search = searchVal;
    const genresVal = searchParamsHook.get("genres");
    if (genresVal) params.genres = genresVal.split(",");
    const formatVal = searchParamsHook.get(
      "format"
    ) as SearchAnilistMediaParams["format"];
    if (formatVal) params.format = formatVal;
    const statusVal = searchParamsHook.get(
      "status"
    ) as SearchAnilistMediaParams["status"];
    if (statusVal) params.status = statusVal;
    const sortVal = searchParamsHook.get("sort");
    if (sortVal) params.sort = [sortVal];
    else params.sort = ["POPULARITY_DESC"];
    const seasonYearVal = searchParamsHook.get("seasonYear");
    if (seasonYearVal) params.seasonYear = parseInt(seasonYearVal, 10);
    const seasonVal = searchParamsHook.get(
      "season"
    ) as SearchAnilistMediaParams["season"];
    if (seasonVal) params.season = seasonVal;

    return params;
  }, [searchParamsHook]);

  useEffect(() => {
    const currentParams = buildSearchParamsFromURL();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setResults(null);
      setPageInfo(null);
      try {
        const data = await searchAnilistMedia(currentParams);
        if (data?.data?.Page) {
          setResults(
            getUniqueAnimesByAnilistId(data.data.Page.media, "SearchPage")
          );
          setPageInfo(data.data.Page.pageInfo || null);
          if (!data.data.Page.media || data.data.Page.media.length === 0) {
            if (
              currentParams.search ||
              currentParams.genres?.length ||
              currentParams.format ||
              currentParams.status ||
              currentParams.season
            ) {
              setError(
                "No anime found matching your criteria. Try adjusting your search or filters."
              );
            }
          }
        } else if (data?.errors) {
          setError(
            `API Error: ${data.errors[0]?.message || "Unknown API error"}`
          );
        } else {
          setError("Could not fetch search results or no data returned.");
        }
      } catch (e: any) {
        setError("An unexpected error occurred: " + e.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (pathname === "/search") {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [searchParamsHook, buildSearchParamsFromURL, pathname]);

  const handleSearch = (newApiParams: SearchAnilistMediaParams) => {
    const params = new URLSearchParams();
    if (newApiParams.search) params.set("search", newApiParams.search);
    if (newApiParams.genres?.length)
      params.set("genres", newApiParams.genres.join(","));
    if (newApiParams.format) params.set("format", newApiParams.format);
    if (newApiParams.status) params.set("status", newApiParams.status);
    if (newApiParams.sort?.length) params.set("sort", newApiParams.sort[0]);
    if (newApiParams.seasonYear)
      params.set("seasonYear", String(newApiParams.seasonYear));
    if (newApiParams.season) params.set("season", newApiParams.season);
    params.set("page", String(newApiParams.page || 1));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const currentApiParams = buildSearchParamsFromURL();
    handleSearch({ ...currentApiParams, page: newPage });
  };

  const initialFormParams = buildSearchParamsFromURL();
  const filtersActive = !!(
    initialFormParams.search ||
    initialFormParams.genres?.length ||
    initialFormParams.format ||
    initialFormParams.status ||
    initialFormParams.season
  );

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <PageTitle
        title="Discover Anime"
        subtitle="Find your next favorite series or movie."
        className="mb-6 md:mb-8"
      />
      <SearchForm
        initialParams={initialFormParams}
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-indigo-500 dark:text-indigo-400 mx-auto mb-6" />
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Searching for awesome anime...
          </p>
        </div>
      )}
      {error && !isLoading && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <XCircle className="h-16 w-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <p className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Oops! Something went wrong.
          </p>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {error}
          </p>
        </div>
      )}
      {!isLoading && !error && results && results.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6 md:gap-x-5 md:gap-y-8 mb-8">
            {results.map((anime, index) => (
              <AnimeCard
                key={anime.id || `fallback-key-${index}`}
                anime={anime}
                priorityImage={index < 6}
              />
            ))}
          </div>
          {pageInfo && pageInfo.lastPage && pageInfo.lastPage > 1 && (
            <PaginationControls
              currentPage={pageInfo.currentPage || 1}
              totalPages={pageInfo.lastPage}
              onPageChange={handlePageChange}
              hasNextPage={pageInfo.hasNextPage || false}
            />
          )}
        </>
      )}
      {!isLoading &&
        !error &&
        (!results || results.length === 0) &&
        filtersActive && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <SearchIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              No Results Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any anime matching your current filters. Try a
              different search or clear some filters!
            </p>
          </div>
        )}
      {!isLoading &&
        !error &&
        (!results || results.length === 0) &&
        !filtersActive && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <SearchIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Ready to Discover?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Use the search bar and filters above to find your next favorite
              anime series or movie.
            </p>
          </div>
        )}
    </div>
  );
}

const SearchPageSkeleton = () => (
  <div className="container mx-auto px-4 py-6 md:py-8">
    <PageTitle
      title="Discover Anime"
      subtitle="Find your next favorite series or movie."
      className="mb-6 md:mb-8"
    />
    <div className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-md mb-4 animate-pulse"></div>
      <div className="mb-4">
        <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
        <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i}>
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-1.5 animate-pulse"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-3">
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
      </div>
    </div>
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Loader2 className="h-16 w-16 animate-spin text-indigo-500 dark:text-indigo-400 mx-auto mb-6" />
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Loading search interface...
      </p>
    </div>
  </div>
);

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchResultsDisplay />
    </Suspense>
  );
}
