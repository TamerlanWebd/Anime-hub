// src/app/community/page.
"use client";

import ReactAIC from "react";
import LinkAIC from "next/link";
import ImageAIC from "next/image";

import {
  MessageSquareText,
  ListPlus,
  FilePlus2,
  MessagesSquare,
  UserCircle,
  Clock,
} from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import {
  ActivityItem,
  CommentActivityItem,
  WatchlistActivityItem,
  NewThreadActivityItem,
  NewPostActivityItem,
} from "@/@types/types";

interface ActivityItemCardProps {
  item: ActivityItem;
}

const ActivityItemCard: React.FC<ActivityItemCardProps> = ({ item }) => {
  const timeAgo = formatDistanceToNowStrict(new Date(item.timestamp), {
    addSuffix: true,
  });

  const iconColors = {
    new_comment: "text-sky-500 dark:text-sky-400",
    added_to_watchlist: "text-purple-500 dark:text-purple-400",
    new_discussion_thread: "text-emerald-500 dark:text-emerald-400",
    new_discussion_post: "text-teal-500 dark:text-teal-400",
  };

  const renderIcon = () => {
    const commonClass = "mr-3 sm:mr-4 flex-shrink-0 mt-0.5";
    const iconSize = 22;
    switch (item.type) {
      case "new_comment":
        return (
          <MessageSquareText
            size={iconSize}
            className={`${commonClass} ${iconColors.new_comment}`}
          />
        );
      case "added_to_watchlist":
        return (
          <ListPlus
            size={iconSize}
            className={`${commonClass} ${iconColors.added_to_watchlist}`}
          />
        );
      case "new_discussion_thread":
        return (
          <FilePlus2
            size={iconSize}
            className={`${commonClass} ${iconColors.new_discussion_thread}`}
          />
        );
      case "new_discussion_post":
        return (
          <MessagesSquare
            size={iconSize}
            className={`${commonClass} ${iconColors.new_discussion_post}`}
          />
        );
      default:
        return (
          <UserCircle
            size={iconSize}
            className={`${commonClass} text-slate-400 dark:text-slate-500`}
          />
        );
    }
  };

  const renderContent = () => {
    const usernameLink = (username: string) => (
      <LinkAIC
        href={`/profile/${encodeURIComponent(username)}`}
        className="font-semibold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
      >
        {username}
      </LinkAIC>
    );

    const targetLink = (href: string, text: string, title?: string) => (
      <LinkAIC
        href={href}
        className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-700 dark:hover:text-indigo-300"
        title={title || text}
      >
        {text}
      </LinkAIC>
    );

    switch (item.type) {
      case "new_comment":
        const commentItem = item as CommentActivityItem;
        return (
          <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {usernameLink(commentItem.username)}
            <span className="text-slate-600 dark:text-slate-300">
              {" "}
              commented on{" "}
            </span>
            {targetLink(
              `/anime/${commentItem.animeId}#comment-${commentItem.commentId}`,
              commentItem.animeTitle
            )}
            {commentItem.commentTextPreview && (
              <blockquote className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 italic bg-slate-100 dark:bg-slate-700/50 p-2 rounded-md line-clamp-2 border-l-2 border-slate-300 dark:border-slate-600">
                "{commentItem.commentTextPreview}"
              </blockquote>
            )}
          </div>
        );
      case "added_to_watchlist":
        const watchlistItem = item as WatchlistActivityItem;
        return (
          <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed flex items-start gap-3">
            <div className="flex-grow">
              {usernameLink(watchlistItem.username)}
              <span className="text-slate-600 dark:text-slate-300">
                {" "}
                added{" "}
              </span>
              {targetLink(
                `/anime/${watchlistItem.animeId}`,
                watchlistItem.animeTitle
              )}
              <span className="text-slate-600 dark:text-slate-300">
                {" "}
                to their watchlist.
              </span>
            </div>
            {watchlistItem.animeCoverImage && (
              <LinkAIC
                href={`/anime/${watchlistItem.animeId}`}
                className="block w-12 h-18 sm:w-14 sm:h-20 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow flex-shrink-0"
                title={`View ${watchlistItem.animeTitle}`}
              >
                <ImageAIC
                  src={watchlistItem.animeCoverImage}
                  alt={watchlistItem.animeTitle}
                  width={56}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </LinkAIC>
            )}
          </div>
        );
      case "new_discussion_thread":
        const threadItem = item as NewThreadActivityItem;
        return (
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {usernameLink(threadItem.username)}
            <span className="text-slate-600 dark:text-slate-300">
              {" "}
              created a new discussion:{" "}
            </span>
            {targetLink(
              `/community/discussions/${threadItem.threadId}`,
              threadItem.threadTitle
            )}
          </p>
        );
      case "new_discussion_post":
        const postItem = item as NewPostActivityItem;
        return (
          <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {usernameLink(postItem.username)}
            <span className="text-slate-600 dark:text-slate-300">
              {" "}
              replied in discussion{" "}
            </span>
            {targetLink(
              `/community/discussions/${postItem.threadId}#post-${postItem.postId}`,
              postItem.threadTitle
            )}
            {postItem.postTextPreview && (
              <blockquote className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 italic bg-slate-100 dark:bg-slate-700/50 p-2 rounded-md line-clamp-2 border-l-2 border-slate-300 dark:border-slate-600">
                "{postItem.postTextPreview}"
              </blockquote>
            )}
          </div>
        );
      default:
        return (
          <span className="text-sm text-slate-600 dark:text-slate-300">
            {item.username ? usernameLink(item.username) : "Someone"} performed
            an action.
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border border-slate-200 dark:border-slate-700">
      <div className="flex items-start">
        <LinkAIC
          href={`/profile/${encodeURIComponent(item.username)}`}
          className="mr-3 sm:mr-4 flex-shrink-0 mt-0.5"
          title={`View ${item.username}'s profile`}
        >
          <UserCircle
            size={36}
            className="text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          />
        </LinkAIC>

        <div className="flex-1 min-w-0">
          <div className="flex items-start">
            {renderIcon()}
            <div className="flex-1 min-w-0">{renderContent()}</div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center ml-9 sm:ml-10 md:ml-[calc(1.25rem+22px)]">
            <Clock size={12} className="mr-1.5 opacity-70" />
            {timeAgo}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityItemCard;
