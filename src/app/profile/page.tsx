// src/app/profile/page.tsx
"use client";
import LinkProfile from "next/link";
import { ListVideo, History, Settings, Edit3, UserCircle } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
export default function ProfileOverviewPage() {
  const { username, watchlist, getAllHistory } = useUserStore();
  const recentWatchlist = watchlist.slice(0, 3);
  const recentHistory = getAllHistory().slice(0, 3);

  return (
    <div>
      <div className="flex items-center mb-6">
        <UserCircle size={48} className="mr-4 text-brand-primary" />
        <div>
          <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            Welcome, {username || "User"}!
          </h2>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Here's a quick look at your recent activity and lists.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium flex items-center">
              <ListVideo size={20} className="mr-2 text-accent-purple" />
              Recently Added to Watchlist
            </h3>
            {watchlist.length > 0 && (
              <LinkProfile
                href="/profile/watchlist"
                className="text-sm text-brand-primary hover:underline"
              >
                View All ({watchlist.length})
              </LinkProfile>
            )}
          </div>
          {recentWatchlist.length > 0 ? (
            <div className="space-y-3">
              {recentWatchlist.map((watchlistItem) => {
                const anime = watchlistItem.anime;
                const displayTitle =
                  anime.title?.userPreferred ||
                  anime.title?.english ||
                  anime.title?.romaji ||
                  "Unknown Title";
                return (
                  <LinkProfile
                    key={anime.id}
                    href={`/anime/${anime.id}`}
                    className="block p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-border-light dark:border-border-dark"
                  >
                    <h4
                      className="font-semibold text-sm truncate"
                      title={displayTitle}
                    >
                      {displayTitle}
                    </h4>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                      Added:{" "}
                      {new Date(watchlistItem.addedAt).toLocaleDateString()}
                    </p>
                  </LinkProfile>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark p-3 border border-dashed border-border-light dark:border-border-dark rounded-md text-center">
              Your watchlist is empty.{" "}
              <LinkProfile
                href="/search"
                className="text-brand-primary hover:underline"
              >
                Start discovering anime!
              </LinkProfile>
            </p>
          )}
        </section>
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium flex items-center">
              <History size={20} className="mr-2 text-accent-pink" />
              Recently Watched
            </h3>
            {getAllHistory().length > 0 && (
              <LinkProfile
                href="/profile/history"
                className="text-sm text-brand-primary hover:underline"
              >
                View All ({getAllHistory().length})
              </LinkProfile>
            )}
          </div>
          {recentHistory.length > 0 ? (
            <div className="space-y-3">
              {recentHistory.map((historyItem) => {
                const anime = historyItem.anime;
                const displayTitle =
                  anime.title?.userPreferred ||
                  anime.title?.english ||
                  anime.title?.romaji ||
                  `Anime ID: ${anime.id || historyItem.anilistId}`;

                const linkIdForPage = historyItem.anilistId || anime.id;
                if (!linkIdForPage) return null;

                return (
                  <LinkProfile
                    key={`${linkIdForPage}-${historyItem.episodeNumber}`}
                    href={`/anime/${linkIdForPage}`}
                    className="block p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-border-light dark:border-border-dark"
                  >
                    <h4
                      className="font-semibold text-sm truncate"
                      title={displayTitle}
                    >
                      {displayTitle}
                    </h4>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                      Ep. {historyItem.episodeNumber}{" "}
                      {historyItem.episodeTitle &&
                      historyItem.episodeTitle !==
                        `Episode ${historyItem.episodeNumber}`
                        ? `- ${historyItem.episodeTitle}`
                        : ""}
                      <span className="mx-1">·</span>
                      Watched:{" "}
                      {new Date(historyItem.lastWatched).toLocaleDateString()}
                    </p>
                  </LinkProfile>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark p-3 border border-dashed border-border-light dark:border-border-dark rounded-md text-center">
              No viewing history yet. Start watching some episodes!
            </p>
          )}
        </section>
      </div>
      <div className="mt-8 pt-6 border-t border-border-light dark:border-border-dark">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <Settings size={20} className="mr-2 text-brand-secondary" />
          Account Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <LinkProfile
            href="/profile/settings"
            className="btn btn-outline text-sm"
          >
            <Edit3 size={16} className="mr-1.5" /> Edit Profile & Settings
          </LinkProfile>
        </div>
      </div>
    </div>
  );
}
