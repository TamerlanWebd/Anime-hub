// src/stores/userStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
  AnilistMedia,
  FavoriteThreadItem,
  HistoryItem,
  WatchedEpisodeProgress,
  WatchlistItem,
  UserAnimeStatus,
  UserAnimeListEntry,
} from "@/@types/types";
import { toast } from "@/components/shared/Toaster";

export interface UserState {
  username: string | null;
  watchlist: WatchlistItem[];
  history: HistoryItem[];
  favoriteThreads: FavoriteThreadItem[];
  animeList: UserAnimeListEntry[];

  setUsername: (username: string | null) => void;
  addToWatchlist: (anime: AnilistMedia) => void;
  removeFromWatchlist: (animeId: number) => void;
  isInWatchlist: (animeId: number) => boolean;
  addOrUpdateHistory: (
    anime: AnilistMedia,
    episodeNumber: number,
    episodeTitle: string | undefined,
    progressSeconds: number,
    durationSeconds: number,
    forceCoverSnapshot?: string
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
  getAnimeListStatus: (animeId: number) => UserAnimeStatus | null;
  updateAnimeListStatus: (
    status: UserAnimeStatus | null,
    animeFullData: AnilistMedia
  ) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      username: null,
      watchlist: [],
      history: [],
      favoriteThreads: [],
      animeList: [],

      setUsername: (username) => {
        if (!username) {
          set({
            username,
            watchlist: [],
            history: [],
            favoriteThreads: [],
            animeList: [],
          });
        } else {
          set({ username });
        }
      },
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
            `Added "${
              anime.title?.userPreferred || anime.title?.english || "Anime"
            }" to watchlist.`
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
              animeToRemove.title?.userPreferred ||
              animeToRemove.title?.english ||
              "Anime"
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
        durationSeconds,
        forceCoverSnapshot
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
            forceCoverSnapshot ||
            anime.coverImage?.medium ||
            anime.coverImage?.large ||
            undefined,
        };

        let currentHistory = [...get().history];
        const existingItemIndex = currentHistory.findIndex(
          (item) =>
            item.anilistId === anime.id && item.episodeNumber === episodeNumber
        );

        const animeForHistory: Partial<AnilistMedia> = {
          id: anime.id,
          idMal: anime.idMal,
          title: anime.title,
          coverImage: anime.coverImage,
          format: anime.format,
          episodes: anime.episodes,
        };

        if (existingItemIndex > -1) {
          const itemToUpdate = currentHistory.splice(existingItemIndex, 1)[0];
          const updatedItem: HistoryItem = {
            ...itemToUpdate,
            progress: progressData,
            lastWatched: now,
            anime: animeForHistory,
          };
          currentHistory.unshift(updatedItem);
        } else {
          const newItem: HistoryItem = {
            anilistId: anime.id,
            malId: anime.idMal,
            anime: animeForHistory,
            episodeNumber,
            episodeTitle,
            progress: progressData,
            lastWatched: now,
          };
          currentHistory.unshift(newItem);
        }
        set({ history: currentHistory.slice(0, 100) });
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
      getAnimeListStatus: (animeId) => {
        if (!get().username) return null;
        const entry = get().animeList.find((item) => item.animeId === animeId);
        return entry ? entry.status : null;
      },

      updateAnimeListStatus: (status, animeFullData) => {
        if (!get().username) {
          toast.info("Пожалуйста, войдите в систему, чтобы изменить статус.");
          return;
        }
        const animeId = animeFullData.id;
        const now = new Date().toISOString();
        let currentAnimeList = [...get().animeList];
        const existingEntryIndex = currentAnimeList.findIndex(
          (item) => item.animeId === animeId
        );

        const animeListDataForEntry: UserAnimeListEntry["anime"] = {
          id: animeFullData.id,
          idMal: animeFullData.idMal,
          title: animeFullData.title,
          coverImage: animeFullData.coverImage,
          episodes: animeFullData.episodes,
          format: animeFullData.format,
        };

        const animeTitleForToast =
          animeFullData.title?.userPreferred ||
          animeFullData.title?.english ||
          animeFullData.title?.romaji ||
          "Аниме";

        if (status === null) {
          if (existingEntryIndex > -1) {
            currentAnimeList.splice(existingEntryIndex, 1);
            set({ animeList: currentAnimeList });
            toast.info(`"${animeTitleForToast}" удалено из ваших списков.`);
          }
          return;
        }
        if (existingEntryIndex > -1) {
          const entryToUpdate = currentAnimeList.splice(
            existingEntryIndex,
            1
          )[0];
          const updatedEntry: UserAnimeListEntry = {
            ...entryToUpdate,
            status: status,
            anime: animeListDataForEntry,
            updatedAt: now,
            score: status === "COMPLETED" ? entryToUpdate.score : undefined,
            episodesWatched:
              status === "WATCHING" ||
              status === "COMPLETED" ||
              status === "ON_HOLD"
                ? entryToUpdate.episodesWatched
                : undefined,
          };
          currentAnimeList.unshift(updatedEntry);
        } else {
          const newEntry: UserAnimeListEntry = {
            animeId: animeId,
            status: status,
            anime: animeListDataForEntry,
            addedAt: now,
            updatedAt: now,
            score: status === "COMPLETED" ? undefined : undefined,
            episodesWatched:
              status === "WATCHING" ||
              status === "ON_HOLD" ||
              status === "COMPLETED"
                ? 0
                : undefined,
          };
          currentAnimeList.unshift(newEntry);
        }

        set({ animeList: currentAnimeList });

        const statusTranslations: Record<UserAnimeStatus, string> = {
          WATCHING: "Смотрю",
          PLANNING: "Планирую",
          ON_HOLD: "Отложено",
          COMPLETED: "Просмотрено",
          DROPPED: "Брошено",
        };
        toast.success(
          `Статус "${animeTitleForToast}" изменен на "${statusTranslations[status]}".`
        );
        if (status === "WATCHING") {
          const historyItemExistsForThisAnime = get().history.some(
            (item) => item.anilistId === animeId
          );
          if (!historyItemExistsForThisAnime) {
            let initialEpisodeNumber = 1;
            if (
              animeFullData.format === "MOVIE" ||
              animeFullData.episodes === 1
            ) {
              initialEpisodeNumber = 1;
            } else if (animeFullData.episodes === 0) {
              initialEpisodeNumber = 0;
            }

            get().addOrUpdateHistory(
              animeFullData,
              initialEpisodeNumber,
              initialEpisodeNumber === 0
                ? "Просмотр"
                : `Эпизод ${initialEpisodeNumber}`,
              0,
              0,
              animeFullData.coverImage?.medium ||
                animeFullData.coverImage?.large ||
                undefined
            );
            toast.info(
              `"${animeTitleForToast}" добавлен в историю как "Начал смотреть".`
            );
          }
        }
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
        animeList: state.animeList,
      }),
    }
  )
);
