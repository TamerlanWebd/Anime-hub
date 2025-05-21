// src/app/profile/history/page.tsx
"use client";
import LinkHist from "next/link";
import ImageHist from "next/image";
import { History as HistoryIcon, Trash2, PlayCircle } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

export default function HistoryPage() {
  const {
    getAllHistory,
    clearHistory: clearStoreHistory,
    username,
  } = useUserStore();
  const historyItems = username ? getAllHistory() : [];
  const handleClearHistory = () => {
    if (
      confirm(
        "Are you sure you want to clear your entire viewing history? This action cannot be undone."
      )
    ) {
      clearStoreHistory();
    }
  };

  if (!username) {
    return (
      <div className="text-center py-10">
        <HistoryIcon
          size={48}
          className="mx-auto text-text-muted-light dark:text-text-muted-dark mb-3"
        />
        <h3 className="text-lg font-medium mb-1">Login Required</h3>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          Please{" "}
          <LinkHist
            href="/login?redirect=/profile/history"
            className="text-brand-primary hover:underline"
          >
            login
          </LinkHist>{" "}
          to view your history.
        </p>
      </div>
    );
  }

  if (historyItems.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-1 flex items-center">
          <HistoryIcon size={24} className="mr-2 text-accent-pink" /> Viewing
          History
        </h2>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
          Episodes you've watched or started watching.
        </p>
        <div className="text-center py-10 border border-dashed border-border-light dark:border-border-dark rounded-lg">
          <HistoryIcon
            size={48}
            className="mx-auto text-text-muted-light dark:text-text-muted-dark mb-3"
          />
          <h3 className="text-lg font-medium mb-1">No Viewing History</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Start watching episodes, and they'll appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-1 flex items-center">
            <HistoryIcon size={24} className="mr-2 text-accent-pink" /> Viewing
            History ({historyItems.length})
          </h2>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Episodes you've watched or started watching. Sorted by most recent.
          </p>
        </div>
        <button
          onClick={handleClearHistory}
          className="btn btn-danger btn-sm mt-2 sm:mt-0"
        >
          <Trash2 size={16} className="mr-1.5" /> Clear All History
        </button>
      </div>

      <div className="space-y-4">
        {historyItems.map((item) => {
          const anime = item.anime;
          const displayTitle =
            anime.title?.userPreferred ||
            anime.title?.english ||
            anime.title?.romaji ||
            `Anime ID: ${anime.id || item.anilistId}`;
          const imageUrl =
            anime.coverImage?.medium ||
            anime.coverImage?.large ||
            item.progress.coverSnapshot ||
            "/placeholder-anime.png";

          const linkIdForPage = item.anilistId || anime.id;

          const progressPercent =
            item.progress.duration > 0
              ? (item.progress.progress / item.progress.duration) * 100
              : 0;

          if (!linkIdForPage) return null;

          return (
            <div
              key={`${linkIdForPage}-${item.episodeNumber}`}
              className="flex flex-col sm:flex-row items-start gap-3 p-3 border border-border-light dark:border-border-dark rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <LinkHist
                href={`/anime/${linkIdForPage}`}
                className="flex-shrink-0 block"
              >
                <ImageHist
                  src={imageUrl}
                  alt={displayTitle}
                  width={80}
                  height={120}
                  className="rounded object-cover aspect-[2/3]"
                />
              </LinkHist>
              <div className="flex-grow">
                <LinkHist href={`/anime/${linkIdForPage}`}>
                  <h3
                    className="font-semibold text-md hover:text-brand-primary transition-colors line-clamp-2"
                    title={displayTitle}
                  >
                    {displayTitle}
                  </h3>
                </LinkHist>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Episode {item.episodeNumber}
                  {item.episodeTitle &&
                  item.episodeTitle !== `Episode ${item.episodeNumber}`
                    ? `: ${item.episodeTitle}`
                    : ""}
                </p>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
                  Last watched: {new Date(item.lastWatched).toLocaleString()}
                </p>
                {item.progress.duration > 0 && (
                  <div className="mt-1.5">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-brand-primary h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
                      {Math.floor(item.progress.progress / 60)}m{" "}
                      {Math.round(item.progress.progress % 60)}s /{" "}
                      {Math.floor(item.progress.duration / 60)}m{" "}
                      {Math.round(item.progress.duration % 60)}s
                      <span className="ml-2">
                        ({progressPercent.toFixed(0)}%)
                      </span>
                    </p>
                  </div>
                )}
              </div>
              <LinkHist
                href={`/anime/${linkIdForPage}`}
                className="btn btn-outline btn-sm mt-2 sm:mt-0 self-start sm:self-center"
                title="View Anime Details"
              >
                <PlayCircle size={16} className="mr-1.5" /> View Anime
              </LinkHist>
            </div>
          );
        })}
      </div>
    </div>
  );
}
