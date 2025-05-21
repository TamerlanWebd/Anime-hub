// src/@types/types.ts

export interface AnilistImage {
  large?: string | null;
  medium?: string | null;
  extraLarge?: string | null;
  color?: string | null;
}

export interface AnilistTitle {
  romaji?: string | null;
  english?: string | null;
  native?: string | null;
  userPreferred?: string | null;
}

export interface AnilistTrailer {
  id?: string | null;
  site?: string | null;
  thumbnail?: string | null;
}

export interface AnilistTag {
  id: number;
  name: string;
  rank?: number | null;
  isMediaSpoiler?: boolean | null;
}

export interface AnilistStudioNode {
  id: number;
  name: string;
  isAnimationStudio: boolean;
}

export interface AnilistStudioEdge {
  node: AnilistStudioNode;
  isMain: boolean;
}

export interface AnilistCharacterNode {
  id: number;
  name: {
    full?: string | null;
    native?: string | null;
    userPreferred?: string | null;
  };
  image: AnilistImage;
  siteUrl?: string | null;
  description?: string | null;
}

export interface AnilistStaffNode {
  id: number;
  name: {
    full?: string | null;
    userPreferred?: string | null;
  };
  image: AnilistImage;
  languageV2?: string | null;
  siteUrl?: string | null;
}

export interface AnilistCharacterEdge {
  id: number;
  role?: string | null;
  node: AnilistCharacterNode;
  voiceActors?: AnilistStaffNode[] | null;
}

export interface AnilistRecommendationNode {
  id: number;
  rating?: number | null;
  mediaRecommendation?: Partial<AnilistMedia> | null;
}

export interface AnilistMediaRelationEdge {
  id: number;
  relationType?: string | null;
  node: Partial<
    AnilistMedia & { type?: "ANIME" | "MANGA" | "NOVEL" | "ONE_SHOT" }
  >;
}

export interface AnilistMedia {
  id: number;
  idMal?: number | null;
  title?: AnilistTitle | null;
  description?: string | null;
  format?: string | null;
  status?: string | null;
  startDate?: {
    year?: number | null;
    month?: number | null;
    day?: number | null;
  } | null;
  endDate?: {
    year?: number | null;
    month?: number | null;
    day?: number | null;
  } | null;
  season?: string | null;
  seasonYear?: number | null;
  episodes?: number | null;
  duration?: number | null;
  countryOfOrigin?: string | null;
  source?: string | null;
  trailer?: AnilistTrailer | null;
  coverImage?: AnilistImage | null;
  bannerImage?: string | null;
  genres?: string[] | null;
  synonyms?: string[] | null;
  averageScore?: number | null;
  meanScore?: number | null;
  popularity?: number | null;
  favourites?: number | null;
  tags?: AnilistTag[] | null;
  studios?: { edges: AnilistStudioEdge[] } | null;
  isAdult?: boolean | null;
  nextAiringEpisode?: {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  } | null;
  siteUrl?: string | null;
  relations?: { edges: AnilistMediaRelationEdge[] } | null;
  characters?: {
    pageInfo?: AnilistPageInfo;
    edges: AnilistCharacterEdge[];
  } | null;
  recommendations?: {
    pageInfo?: AnilistPageInfo;
    nodes: AnilistRecommendationNode[];
  } | null;
}

export interface AnilistPageInfo {
  total?: number | null;
  perPage?: number | null;
  currentPage?: number | null;
  lastPage?: number | null;
  hasNextPage?: boolean | null;
}

export interface AnilistPage {
  pageInfo?: AnilistPageInfo | null;
  media?: AnilistMedia[] | null;
}

export interface AnilistResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    status?: number;
    locations?: any[];
  }> | null;
}
export interface SearchAnilistMediaParams {
  page?: number;
  perPage?: number;
  search?: string;
  sort?: string[];
  genres?: string[];
  tags?: string[];
  season?: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  seasonYear?: number;
  format?:
    | "TV"
    | "TV_SHORT"
    | "MOVIE"
    | "SPECIAL"
    | "OVA"
    | "ONA"
    | "MUSIC"
    | "MANGA"
    | "NOVEL"
    | "ONE_SHOT";
  status?:
    | "FINISHED"
    | "RELEASING"
    | "NOT_YET_RELEASED"
    | "CANCELLED"
    | "HIATUS";
  isAdult?: boolean;
  id_in?: number[];
  idMal_in?: number[];
}

export interface WatchlistItem {
  anime: AnilistMedia;
  addedAt: string;
}

export interface WatchedEpisodeProgress {
  progress: number;
  duration: number;
  watchedAt: string;
  anilistId?: number;
  malId?: number | null;
  titleSnapshot?: string;
  coverSnapshot?: string;
}

export interface HistoryItem {
  anime: Partial<AnilistMedia & { mal_id?: number | null }>;
  episodeNumber: number;
  episodeTitle?: string;
  progress: WatchedEpisodeProgress;
  lastWatched: string;
  malId?: number | null;
  anilistId?: number;
}
export interface Comment {
  id: string;
  animeId: number;
  userId: string;
  username: string;
  avatar?: string | null;
  text: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string | null;
  replies?: Comment[];
  isDeleted?: boolean;
}
export interface DiscussionPost {
  id: string;
  threadId: string;
  userId: string;
  username: string;
  avatar?: string | null;
  text: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string | null;
  replies?: DiscussionPost[];
  isDeleted?: boolean;
}

export interface DiscussionThread {
  id: string;
  title: string;
  content?: string;
  contentPreview?: string;
  createdByUserId: string;
  createdByUsername: string;
  createdAt: string;
  updatedAt?: string;
  lastActivityAt: string;
  postCount: number;
  isDeleted?: boolean;
}

export type ActivityItemType =
  | "new_comment"
  | "added_to_watchlist"
  | "new_discussion_thread"
  | "new_discussion_post";

export interface BaseActivityItem {
  id: string;
  type: ActivityItemType;
  timestamp: string;
  username: string;
}

export interface CommentActivityItem extends BaseActivityItem {
  type: "new_comment";
  animeId: number;
  animeTitle: string;
  commentTextPreview: string;
  commentId: string;
}

export interface WatchlistActivityItem extends BaseActivityItem {
  type: "added_to_watchlist";
  animeId: number;
  animeTitle: string;
  animeCoverImage?: string | null;
}

export interface NewThreadActivityItem extends BaseActivityItem {
  type: "new_discussion_thread";
  threadId: string;
  threadTitle: string;
}

export interface NewPostActivityItem extends BaseActivityItem {
  type: "new_discussion_post";
  threadId: string;
  threadTitle: string;
  postTextPreview: string;
  postId: string;
}

export type ActivityItem =
  | CommentActivityItem
  | WatchlistActivityItem
  | NewThreadActivityItem
  | NewPostActivityItem;

export interface FavoriteThreadItem {
  threadId: string;
  threadTitle: string;
  addedAt: string;
}
export interface DiscussionState {
  threads: DiscussionThread[];
  postsByThreadId: Record<string, DiscussionPost[] | undefined>;
}

export type UserAnimeStatus =
  | "WATCHING"
  | "PLANNING"
  | "ON_HOLD"
  | "COMPLETED"
  | "DROPPED";

export interface UserAnimeListEntry {
  animeId: number;
  status: UserAnimeStatus;
  anime: Pick<
    AnilistMedia,
    "id" | "idMal" | "title" | "coverImage" | "episodes" | "format"
  >;
  addedAt: string;
  updatedAt: string;
  score?: number;
  episodesWatched?: number;
}
