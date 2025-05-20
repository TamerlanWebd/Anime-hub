// src/store/userStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
  AnilistMedia,
  FavoriteThreadItem,
  HistoryItem,
  WatchedEpisodeProgress,
  WatchlistItem,
} from "@/@types/types";
import { toast } from "@/components/shared/Toaster";

export interface UserState {
  username: string | null;
  watchlist: WatchlistItem[];
  history: HistoryItem[];
  favoriteThreads: FavoriteThreadItem[];
  setUsername: (username: string | null) => void;
  addToWatchlist: (anime: AnilistMedia) => void;
  removeFromWatchlist: (animeId: number) => void;
  isInWatchlist: (animeId: number) => boolean;
  addOrUpdateHistory: (
    anime: AnilistMedia,
    episodeNumber: number,
    episodeTitle: string | undefined,
    progressSeconds: number,
    durationSeconds: number
  ) => void;
  clearHistory: () => void;
  getAllHistory: () => HistoryItem[];
  getHistoryItem: (
    animeId: number,
    episodeNumber: number
  ) => HistoryItem | undefined;
  addFavoriteThread: (threadId: string, threadTitle: string) => void;
  removeFavoriteThread: (threadId: string) => void;
  isFavoriteThread: (threadId: string) => boolean;
  getFavoriteThreads: () => FavoriteThreadItem[];
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      username: null,
      watchlist: [],
      history: [],
      favoriteThreads: [],

      setUsername: (username) => set({ username }),
      addToWatchlist: (anime) => {
        if (!get().username) {
          toast.info("Please login to add to watchlist.");
          return;
        }
        if (!get().isInWatchlist(anime.id)) {
          set((state) => ({
            watchlist: [
              { anime, addedAt: new Date().toISOString() },
              ...state.watchlist,
            ],
          }));
          toast.success(
            `Added "${anime.title?.userPreferred || "Anime"}" to watchlist.`
          );
        } else {
          get().removeFromWatchlist(anime.id);
        }
      },
      removeFromWatchlist: (animeId) => {
        const animeToRemove = get().watchlist.find(
          (item) => item.anime.id === animeId
        )?.anime;
        set((state) => ({
          watchlist: state.watchlist.filter(
            (item) => item.anime.id !== animeId
          ),
        }));
        if (animeToRemove) {
          toast.info(
            `Removed "${
              animeToRemove.title?.userPreferred || "Anime"
            }" from watchlist.`
          );
        }
      },
      isInWatchlist: (animeId) =>
        get().watchlist.some((item) => item.anime.id === animeId),
      addOrUpdateHistory: (
        anime,
        episodeNumber,
        episodeTitle,
        progressSeconds,
        durationSeconds
      ) => {
        if (!get().username) return;

        const now = new Date().toISOString();
        const progressData: WatchedEpisodeProgress = {
          progress: progressSeconds,
          duration: durationSeconds,
          watchedAt: now,
          anilistId: anime.id,
          malId: anime.idMal,
          titleSnapshot: episodeTitle || `Episode ${episodeNumber}`,
          coverSnapshot:
            anime.coverImage?.medium || anime.coverImage?.large || undefined,
        };

        const existingItemIndex = get().history.findIndex(
          (item) =>
            item.anilistId === anime.id && item.episodeNumber === episodeNumber
        );

        let newHistory: HistoryItem[];
        if (existingItemIndex > -1) {
          newHistory = [...get().history];
          const updatedItem: HistoryItem = {
            ...newHistory[existingItemIndex],
            progress: progressData,
            lastWatched: now,

            anime: {
              id: anime.id,
              idMal: anime.idMal,
              title: anime.title,
              coverImage: anime.coverImage,
            },
          };
          newHistory[existingItemIndex] = updatedItem;
        } else {
          const newItem: HistoryItem = {
            anilistId: anime.id,
            malId: anime.idMal,
            anime: {
              id: anime.id,
              idMal: anime.idMal,
              title: anime.title,
              coverImage: anime.coverImage,
            },
            episodeNumber,
            episodeTitle,
            progress: progressData,
            lastWatched: now,
          };
          newHistory = [newItem, ...get().history];
        }
        newHistory.sort(
          (a, b) =>
            new Date(b.lastWatched).getTime() -
            new Date(a.lastWatched).getTime()
        );
        set({ history: newHistory.slice(0, 100) });
      },
      clearHistory: () => {
        if (!get().username) return;
        set({ history: [] });
        toast.success("Viewing history cleared.");
      },
      getAllHistory: () => {
        return get().history;
      },
      getHistoryItem: (animeId, episodeNumber) => {
        return get().history.find(
          (item) =>
            item.anilistId === animeId && item.episodeNumber === episodeNumber
        );
      },
      addFavoriteThread: (threadId, threadTitle) => {
        if (!get().username) {
          toast.info("Please login to add to favorites.");
          return;
        }
        if (!get().isFavoriteThread(threadId)) {
          const newItem: FavoriteThreadItem = {
            threadId,
            threadTitle,
            addedAt: new Date().toISOString(),
          };
          set((state) => ({
            favoriteThreads: [newItem, ...state.favoriteThreads],
          }));
          toast.success(`Added "${threadTitle}" to favorite discussions.`);
        } else {
          get().removeFavoriteThread(threadId);
        }
      },
      removeFavoriteThread: (threadId) => {
        const threadToRemove = get().favoriteThreads.find(
          (item) => item.threadId === threadId
        );
        set((state) => ({
          favoriteThreads: state.favoriteThreads.filter(
            (item) => item.threadId !== threadId
          ),
        }));
        if (threadToRemove) {
          toast.info(
            `Removed "${threadToRemove.threadTitle}" from favorite discussions.`
          );
        }
      },
      isFavoriteThread: (threadId) =>
        get().favoriteThreads.some((item) => item.threadId === threadId),
      getFavoriteThreads: () => {
        return [...get().favoriteThreads].sort(
          (a, b) =>
            new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        );
      },
    }),
    {
      name: "user-profile-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        username: state.username,
        watchlist: state.watchlist,
        history: state.history,
        favoriteThreads: state.favoriteThreads,
      }),
    }
  )
);
