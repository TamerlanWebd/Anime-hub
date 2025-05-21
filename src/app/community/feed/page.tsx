// src/app/community/feed/page.tsx
"use client";
import {
  ActivityItem,
  CommentActivityItem,
  WatchlistActivityItem,
  NewThreadActivityItem,
  NewPostActivityItem,
  Comment,
} from "@/@types/types";
import PageTitle from "@/components/shared/PageTitle";
import { getAnilistMediaById } from "@/services/api";
import { useUserStore } from "@/stores/userStore";
import { ActivityIcon, Loader2 } from "lucide-react";
import {
  useEffect as useEffectFeed,
  useState as useStateFeed,
  useCallback as useCallbackFeed,
} from "react";
import ActivityItemCard from "../components/ActivityItemCard";
import { useDiscussionStore } from "@/stores/discussionStore";
import { useCommentStore } from "@/stores/commentStore";

const MAX_ACTIVITY_ITEMS = 50;
const ITEMS_PER_LOAD = 10;

export default function CommunityFeedPage() {
  const [activityFeed, setActivityFeed] = useStateFeed<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useStateFeed(true);
  const [visibleItems, setVisibleItems] = useStateFeed(ITEMS_PER_LOAD);

  const commentsByAnimeId = useCommentStore.getState().commentsByAnimeId;
  const { watchlist: userWatchlist, username: currentUsername } =
    useUserStore.getState();
  const { threads, postsByThreadId } = useDiscussionStore.getState();

  const generateFeed = useCallbackFeed(async () => {
    setIsLoading(true);
    let rawActivity: Omit<ActivityItem, "id">[] = [];

    const animeTitleCache = new Map<number, string>();
    const fetchAnimeTitle = async (animeId: number): Promise<string> => {
      if (animeTitleCache.has(animeId)) {
        return animeTitleCache.get(animeId)!;
      }
      try {
        const animeData = await getAnilistMediaById(animeId);
        const title =
          animeData?.data?.Media?.title?.userPreferred ||
          `Anime ID: ${animeId}`;
        animeTitleCache.set(animeId, title);
        return title;
      } catch (e) {
        const title = `Anime ID: ${animeId}`;
        animeTitleCache.set(animeId, title);
        return title;
      }
    };
    const commentPromises = Object.entries(commentsByAnimeId).flatMap(
      ([animeIdStr, comments]) => {
        if (!comments) return [];
        const animeId = parseInt(animeIdStr, 10);
        return comments.map(async (comment: Comment) => {
          if (!comment.isDeleted) {
            const animeTitle = await fetchAnimeTitle(animeId);
            return {
              type: "new_comment",
              timestamp: comment.createdAt,
              username: comment.username,
              animeId,
              animeTitle,
              commentTextPreview:
                comment.text.substring(0, 100) +
                (comment.text.length > 100 ? "..." : ""),
              commentId: comment.id,
            } as Omit<CommentActivityItem, "id">;
          }
          return null;
        });
      }
    );
    const resolvedComments = (await Promise.all(commentPromises)).filter(
      (item): item is Omit<CommentActivityItem, "id"> => item !== null
    );
    rawActivity.push(...resolvedComments);
    if (currentUsername) {
      userWatchlist.forEach((item) => {
        rawActivity.push({
          type: "added_to_watchlist",
          timestamp: item.addedAt,
          username: currentUsername,
          animeId: item.anime.id,
          animeTitle:
            item.anime.title?.userPreferred || `Anime ID: ${item.anime.id}`,
          animeCoverImage: item.anime.coverImage?.medium,
        } as Omit<WatchlistActivityItem, "id">);
      });
    }
    threads.forEach((thread) => {
      if (!thread.isDeleted) {
        rawActivity.push({
          type: "new_discussion_thread",
          timestamp: thread.createdAt,
          username: thread.createdByUsername,
          threadId: thread.id,
          threadTitle: thread.title,
        } as Omit<NewThreadActivityItem, "id">);
      }
    });
    for (const threadId in postsByThreadId) {
      const posts = postsByThreadId[threadId];
      const parentThread = threads.find(
        (t) => t.id === threadId && !t.isDeleted
      );
      if (posts && parentThread) {
        posts.forEach((post) => {
          if (!post.isDeleted) {
            rawActivity.push({
              type: "new_discussion_post",
              timestamp: post.createdAt,
              username: post.username,
              threadId: post.threadId,
              threadTitle: parentThread.title,
              postTextPreview:
                post.text.substring(0, 100) +
                (post.text.length > 100 ? "..." : ""),
              postId: post.id,
            } as Omit<NewPostActivityItem, "id">);
          }
        });
      }
    }

    const sortedFeed = rawActivity
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, MAX_ACTIVITY_ITEMS)
      .map((item, index) => ({
        ...item,
        id: `${item.type}-${new Date(item.timestamp).getTime()}-${
          item.username
        }-${index}`,
      })) as ActivityItem[];

    setActivityFeed(sortedFeed);
    setIsLoading(false);
  }, [
    commentsByAnimeId,
    userWatchlist,
    currentUsername,
    threads,
    postsByThreadId,
  ]);

  useEffectFeed(() => {
    generateFeed();
  }, [generateFeed]);

  const loadMoreItems = () => {
    setVisibleItems((prev) =>
      Math.min(prev + ITEMS_PER_LOAD, activityFeed.length)
    );
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <PageTitle
        title="Community Activity Feed"
        subtitle="See what's happening in the AnimeHub community."
        icon={
          <ActivityIcon size={36} className="text-sky-500 dark:text-sky-400" />
        }
      />

      {isLoading ? (
        <div className="flex flex-col justify-center items-center min-h-[400px] bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
          <Loader2 size={60} className="animate-spin text-brand-primary" />
          <p className="mt-6 text-xl font-semibold text-slate-700 dark:text-slate-200">
            Building Activity Feed...
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Gathering the latest updates for you.
          </p>
        </div>
      ) : activityFeed.length === 0 ? (
        <div className="text-center py-12 md:py-16 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg min-h-[400px] flex flex-col justify-center items-center">
          <ActivityIcon
            size={64}
            className="mx-auto text-slate-400 dark:text-slate-500 mb-6"
          />
          <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
            The Feed is Eerily Quiet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
            No recent activity to display. Why not start a discussion or comment
            on an anime to liven things up?
          </p>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-5 max-w-3xl mx-auto">
          {activityFeed.slice(0, visibleItems).map((item) => (
            <ActivityItemCard key={item.id} item={item} />
          ))}
          {visibleItems < activityFeed.length && (
            <div className="text-center mt-8">
              <button
                onClick={loadMoreItems}
                className="btn btn-primary px-6 py-2.5 text-base font-medium"
              >
                Load More Activity
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
