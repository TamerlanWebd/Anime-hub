// src/app/community/discussions/page.tsx
"use client";

import {
  useEffect as useEffectDiscList,
  useState as useStateDiscList,
  useCallback as useCallbackDiscList,
} from "react";

import LinkDiscList from "next/link";

import {
  PlusCircle,
  Loader2,
  Inbox,
  MessageSquareText,
  ListFilter,
  ChevronDown,
} from "lucide-react";
import { DiscussionThread, DiscussionState } from "@/@types/types";
import PageTitle from "@/components/shared/PageTitle";
import { useDiscussionStore } from "@/stores/discussionStore";
import DiscussionThreadCard from "../components/DiscussionThreadCard";

export default function DiscussionsPage() {
  const [threads, setThreads] = useStateDiscList<DiscussionThread[]>([]);
  const [isLoading, setIsLoading] = useStateDiscList(true);
  const [sortBy, setSortBy] = useStateDiscList<"activity" | "newest">(
    "activity"
  );
  const getThreadsFromStore = useDiscussionStore((state) => state.getThreads);

  const fetchAndSetThreads = useCallbackDiscList(() => {
    setIsLoading(true);
    const fetchedThreads = getThreadsFromStore(sortBy);
    setThreads(fetchedThreads);
    setIsLoading(false);
  }, [getThreadsFromStore, sortBy]);

  useEffectDiscList(() => {
    fetchAndSetThreads();
    const unsubscribe = useDiscussionStore.subscribe(
      (newState: DiscussionState, prevState: DiscussionState) => {
        if (
          newState.threads !== prevState.threads ||
          newState.postsByThreadId !== prevState.postsByThreadId
        ) {
          fetchAndSetThreads();
        }
      }
    );
    return () => unsubscribe();
  }, [fetchAndSetThreads]);

  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <PageTitle
        title="Community Discussions"
        subtitle="Browse topics or start your own engaging conversation."
        icon={
          <MessageSquareText
            size={36}
            className="text-indigo-500 dark:text-indigo-400"
          />
        }
      />

      <div className="my-6 md:my-8 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
        <div className="relative w-full sm:w-auto">
          <label htmlFor="sortThreads" className="sr-only">
            Sort by:
          </label>
          <div className="flex items-center">
            <ListFilter
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
            />
            <select
              id="sortThreads"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "activity" | "newest")
              }
              className="appearance-none w-full sm:w-auto pl-10 pr-8 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
            >
              <option value="activity">Last Activity</option>
              <option value="newest">Newest Created</option>
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
            />
          </div>
        </div>
        <LinkDiscList
          href="/community/discussions/new"
          className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm text-sm"
        >
          <PlusCircle size={20} className="mr-2" /> Start New Discussion
        </LinkDiscList>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center min-h-[400px] bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
          <Loader2
            size={60}
            className="animate-spin text-indigo-500 dark:text-indigo-400"
          />
          <p className="mt-6 text-xl font-semibold text-slate-700 dark:text-slate-200">
            Loading discussions...
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Fetching the latest topics for you.
          </p>
        </div>
      ) : threads.length === 0 ? (
        <div className="text-center py-12 md:py-16 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg min-h-[400px] flex flex-col justify-center items-center">
          <Inbox
            size={64}
            className="mx-auto text-slate-400 dark:text-slate-500 mb-6"
          />
          <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
            No Discussions Here Yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
            It looks like the discussion board is empty. Why not be the pioneer
            and start the first one?
          </p>
          <LinkDiscList
            href="/community/discussions/new"
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm text-base"
          >
            <PlusCircle size={20} className="mr-2" /> Start the First Discussion
          </LinkDiscList>
        </div>
      ) : (
        <div className="space-y-5 md:space-y-6 max-w-4xl mx-auto">
          {threads.map((thread) => (
            <DiscussionThreadCard
              key={thread.id}
              thread={thread}
              onThreadAction={fetchAndSetThreads}
            />
          ))}
        </div>
      )}
    </div>
  );
}
