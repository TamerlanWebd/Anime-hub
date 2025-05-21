//src/app/community/components/DiscussionThreadCard.tsx
"use client";
import LinkDTC from "next/link";
import {
  MessageSquare,
  User,
  Clock,
  Star as StarIconDTC,
  StarOff,
  Trash2,
  ArrowRightCircle,
} from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter as useRouterDTC } from "next/navigation";
import { DiscussionThread } from "@/@types/types";
import { toast } from "@/components/shared/Toaster";
import { useDiscussionStore } from "@/stores/discussionStore";
import { useUserStore } from "@/stores/userStore";

interface DiscussionThreadCardProps {
  thread: DiscussionThread;
  onThreadAction?: () => void;
}

const DiscussionThreadCard: React.FC<DiscussionThreadCardProps> = ({
  thread,
  onThreadAction,
}) => {
  const createdAtAgo = formatDistanceToNowStrict(new Date(thread.createdAt), {
    addSuffix: true,
  });
  const lastActivityAgo = formatDistanceToNowStrict(
    new Date(thread.lastActivityAt),
    { addSuffix: true }
  );
  const router = useRouterDTC();

  const { addFavoriteThread, isFavoriteThread, username } = useUserStore();
  const { deleteThread } = useDiscussionStore();
  const isFavorited = username ? isFavoriteThread(thread.id) : false;

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!username) {
      toast.info("Please log in to add to favorites.");
      return;
    }
    addFavoriteThread(thread.id, thread.title);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (thread.createdByUsername !== username) {
      toast.error("You can only delete your own threads.");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete the thread "${thread.title}" and all its posts? This action cannot be undone.`
      )
    ) {
      const success = deleteThread(thread.id, username);
      if (success) {
        onThreadAction?.();
      }
    }
  };
  const contentPreview =
    thread.contentPreview ||
    (thread.content
      ? thread.content.substring(0, 150) +
        (thread.content.length > 150 ? "..." : "")
      : "No content preview.");

  return (
    <div className="group bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border border-slate-200 dark:border-slate-700 relative flex flex-col">
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center space-x-1.5 z-10">
        {username && (
          <button
            onClick={handleFavoriteToggle}
            title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
            className={`p-2 rounded-full transition-colors duration-200 
                        ${
                          isFavorited
                            ? "bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-500 dark:text-yellow-400"
                            : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400"
                        }`}
          >
            {isFavorited ? (
              <StarIconDTC size={18} className="fill-current" />
            ) : (
              <StarOff size={18} />
            )}
          </button>
        )}
        {username === thread.createdByUsername && (
          <button
            onClick={handleDelete}
            title="Delete Thread"
            className="p-2 rounded-full bg-slate-100 hover:bg-red-500/20 dark:bg-slate-700 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors duration-200"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
      <div className="flex-grow">
        <LinkDTC
          href={`/community/discussions/${thread.id}`}
          className="block group/title"
        >
          <h3
            className="text-lg sm:text-xl font-semibold text-indigo-600 dark:text-indigo-400 group-hover/title:text-indigo-700 dark:group-hover/title:text-indigo-300 group-hover/title:underline mb-2 pr-16 sm:pr-20 transition-colors duration-200 line-clamp-2"
            title={thread.title}
          >
            {thread.title}
          </h3>
        </LinkDTC>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
          {contentPreview}
        </p>
      </div>
      <div className="mt-auto pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 items-center">
            <span
              className="flex items-center"
              title={`Created by ${thread.createdByUsername}`}
            >
              <User size={14} className="mr-1.5 flex-shrink-0" />
              <LinkDTC
                href={`/profile/${encodeURIComponent(
                  thread.createdByUsername
                )}`}
                onClick={(e) => e.stopPropagation()}
                className="font-medium hover:text-indigo-500 dark:hover:text-indigo-400 hover:underline truncate max-w-[100px] sm:max-w-[120px]"
              >
                {thread.createdByUsername}
              </LinkDTC>
            </span>
            <span
              className="flex items-center"
              title={`Created ${createdAtAgo}`}
            >
              <Clock size={14} className="mr-1.5 flex-shrink-0" />
              {createdAtAgo}
            </span>
            <span
              className="flex items-center"
              title={`${thread.postCount} posts`}
            >
              <MessageSquare size={14} className="mr-1.5 flex-shrink-0" />
              {thread.postCount} post{thread.postCount !== 1 ? "s" : ""}
            </span>
            <span
              className="flex items-center"
              title={`Last activity ${lastActivityAgo}`}
            >
              <Clock size={14} className="mr-1.5 flex-shrink-0 opacity-70" />
              <span className="italic">Active: {lastActivityAgo}</span>
            </span>
          </div>
          <LinkDTC
            href={`/community/discussions/${thread.id}`}
            className="hidden sm:inline-flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group-hover:underline"
          >
            View Discussion
            <ArrowRightCircle
              size={16}
              className="ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </LinkDTC>
        </div>
      </div>
    </div>
  );
};

export default DiscussionThreadCard;
