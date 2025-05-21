//src/app/community/discussions/[threadId]/page.tsx
"use client";
import ReactThreadPage, {
  useEffect as useEffectThreadPage,
  useState as useStateThreadPage,
  useCallback as useCallbackThreadPage,
} from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  Loader2,
  MessageSquare,
  ArrowLeft,
  User,
  Clock,
  Edit3,
  Trash2,
  Inbox,
  XCircle,
  Star as StarIconThread,
  StarOff,
  Send,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import LinkThreadPage from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import {
  DiscussionThread,
  DiscussionPost,
  DiscussionState,
} from "@/@types/types";
import { toast } from "@/components/shared/Toaster";
import { useDiscussionStore } from "@/stores/discussionStore";
import { useUserStore, UserState } from "@/stores/userStore";
import DiscussionPostForm from "../../components/DiscussionPostForm";
import DiscussionPostItem from "../../components/DiscussionPostItem";

export default function DiscussionThreadPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const threadId = typeof params.threadId === "string" ? params.threadId : "";

  const [thread, setThread] = useStateThreadPage<
    DiscussionThread | null | undefined
  >(undefined);
  const [posts, setPosts] = useStateThreadPage<DiscussionPost[]>([]);
  const [isLoading, setIsLoading] = useStateThreadPage(true);

  const [isEditingThread, setIsEditingThread] = useStateThreadPage(false);
  const [editThreadTitle, setEditThreadTitle] = useStateThreadPage("");
  const [editThreadContent, setEditThreadContent] = useStateThreadPage<
    string | undefined
  >("");

  const getThreadById = useDiscussionStore((state) => state.getThreadById);
  const getPostsForThread = useDiscussionStore(
    (state) => state.getPostsForThread
  );
  const updateThreadAction = useDiscussionStore((state) => state.updateThread);
  const deleteThreadAction = useDiscussionStore((state) => state.deleteThread);

  const currentUsername = useUserStore((state) => state.username);
  const addFavoriteThreadAction = useUserStore(
    (state) => state.addFavoriteThread
  );
  const isThreadFavoritedSelector = useUserStore(
    (state) => state.isFavoriteThread
  );

  const fetchThreadData = useCallbackThreadPage(() => {
    if (!threadId) {
      setIsLoading(false);
      setThread(null);
      return;
    }
    setIsLoading(true);
    const fetchedThread = getThreadById(threadId);
    setThread(fetchedThread);
    if (fetchedThread) {
      const fetchedPosts = getPostsForThread(threadId);
      setPosts(fetchedPosts);
      if (!isEditingThread) {
        setEditThreadTitle(fetchedThread.title);
        setEditThreadContent(fetchedThread.content);
      }
    } else {
      setPosts([]);
    }
    setIsLoading(false);
  }, [threadId, getThreadById, getPostsForThread, isEditingThread]);

  useEffectThreadPage(() => {
    fetchThreadData();
    const editQueryParam = searchParams.get("edit");
    if (editQueryParam === "true") {
      const currentFetchedThread = getThreadById(threadId);
      if (
        currentFetchedThread &&
        currentFetchedThread.createdByUsername === currentUsername
      ) {
        setIsEditingThread(true);
        setEditThreadTitle(currentFetchedThread.title);
        setEditThreadContent(currentFetchedThread.content);
      } else if (currentFetchedThread) {
        toast.info("You don't have permission to edit this thread.");
        router.replace(`/community/discussions/${threadId}`);
      }
    }
  }, [
    threadId,
    searchParams,
    router,
    fetchThreadData,
    currentUsername,
    getThreadById,
  ]);

  useEffectThreadPage(() => {
    const unsubscribeDiscussion = useDiscussionStore.subscribe(
      (newState: DiscussionState, prevState: DiscussionState) => {
        const newThreadData = newState.threads.find((t) => t.id === threadId);
        const oldThreadData = prevState.threads.find((t) => t.id === threadId);
        const newPostsData = newState.postsByThreadId[threadId];
        const oldPostsData = prevState.postsByThreadId[threadId];

        if (
          JSON.stringify(newThreadData) !== JSON.stringify(oldThreadData) ||
          JSON.stringify(newPostsData) !== JSON.stringify(oldPostsData)
        ) {
          fetchThreadData();
        }
      }
    );

    const unsubscribeUser = useUserStore.subscribe(
      (newUserState: UserState, prevUserState: UserState) => {
        if (
          thread &&
          JSON.stringify(newUserState.favoriteThreads) !==
            JSON.stringify(prevUserState.favoriteThreads)
        ) {
          setThread((prev) => (prev ? { ...prev } : null));
        }
      }
    );

    return () => {
      unsubscribeDiscussion();
      unsubscribeUser();
    };
  }, [fetchThreadData, threadId, thread]);

  const handleActionSuccess = useCallbackThreadPage(() => {}, []);

  const handleEditThreadToggle = () => {
    if (thread && thread.createdByUsername === currentUsername) {
      const nextIsEditing = !isEditingThread;
      setIsEditingThread(nextIsEditing);
      if (nextIsEditing) {
        setEditThreadTitle(thread.title);
        setEditThreadContent(thread.content);
      }
    } else {
      toast.error("You do not have permission to edit this thread.");
    }
  };

  const handleEditThreadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thread || !currentUsername || !editThreadTitle.trim()) {
      toast.error("Title cannot be empty.");
      return;
    }
    if (
      updateThreadAction(
        thread.id,
        editThreadTitle.trim(),
        editThreadContent?.trim() || "",
        currentUsername
      )
    ) {
      setIsEditingThread(false);
    }
  };

  const handleDeleteThread = () => {
    if (!thread || !currentUsername) return;
    if (thread.createdByUsername !== currentUsername) {
      toast.error("You do not have permission to delete this thread.");
      return;
    }
    if (
      window.confirm(
        "🛑 Are you absolutely sure? Deleting this thread will also remove all its posts. This action cannot be undone."
      )
    ) {
      if (deleteThreadAction(thread.id, currentUsername)) {
        router.push("/community/discussions");
      }
    }
  };

  const handleToggleFavoriteOnPage = () => {
    if (!thread) return;
    if (!currentUsername) {
      toast.info("Please login to manage favorites.");
      return;
    }
    addFavoriteThreadAction(thread.id, thread.title);
  };

  if (isLoading || thread === undefined) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] p-6 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-800 rounded-lg transition-colors duration-300">
        <Loader2
          size={60}
          className="animate-spin text-brand-500 dark:text-brand-400"
        />
        <p className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-200">
          Loading Discussion...
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Hold tight, fetching the details.
        </p>
      </div>
    );
  }

  const errorCardBaseClasses =
    "text-center bg-white dark:bg-slate-800/80 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/50 transition-all duration-300";

  if (thread === null) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className={errorCardBaseClasses}>
          <Inbox
            size={72}
            strokeWidth={1.5}
            className="mx-auto text-red-500 dark:text-red-400 mb-6 transform group-hover:scale-110 transition-transform"
          />
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">
            Discussion Not Found
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            It seems the discussion you're looking for has vanished into the
            digital ether or has been deleted.
          </p>
          <LinkThreadPage
            href="/community/discussions"
            className="btn btn-primary btn-lg group"
          >
            <ArrowLeft
              size={20}
              className="mr-2 transition-transform group-hover:-translate-x-1 duration-200"
            />
            Explore Other Discussions
          </LinkThreadPage>
        </div>
      </div>
    );
  }

  let threadUpdatedAtText = "";
  if (thread.updatedAt && thread.updatedAt !== thread.createdAt) {
    try {
      threadUpdatedAtText = `(edited ${formatDistanceToNow(
        new Date(thread.updatedAt),
        { addSuffix: true }
      )})`;
    } catch (e) {
      console.error("Error formatting updated date:", e);
    }
  }
  const isFavorited = currentUsername
    ? isThreadFavoritedSelector(thread.id)
    : false;

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 md:py-8 space-y-6 md:space-y-8">
      <div className="mb-0">
        <LinkThreadPage
          href="/community/discussions"
          className="inline-flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors group"
        >
          <ArrowLeft
            size={18}
            className="mr-1.5 transition-transform group-hover:-translate-x-0.5 duration-150"
          />
          All Discussions
        </LinkThreadPage>
      </div>

      <header className="bg-white dark:bg-slate-800/60 backdrop-blur-2xl shadow-xl rounded-xl p-4 py-5 sm:p-6 border border-slate-200 dark:border-slate-700/60 transition-all duration-300">
        {isEditingThread && currentUsername === thread.createdByUsername ? (
          <form
            onSubmit={handleEditThreadSubmit}
            className="space-y-5 animate-fadeIn"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                <Edit3
                  size={22}
                  className="inline mr-2.5 align-middle text-brand-500 dark:text-brand-400"
                />
                Editing Thread
              </h2>
              <button
                type="button"
                onClick={handleEditThreadToggle}
                className="btn btn-ghost btn-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                title="Cancel Editing"
              >
                <XCircle size={20} />
              </button>
            </div>
            <div>
              <label
                htmlFor="editThreadTitle"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="editThreadTitle"
                value={editThreadTitle}
                onChange={(e) => setEditThreadTitle(e.target.value)}
                className="input-field w-full text-lg py-2.5 shadow-sm focus:shadow-md"
                required
                autoFocus
                placeholder="A clear and compelling title"
              />
            </div>
            <div>
              <label
                htmlFor="editThreadContent"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Content{" "}
                <span className="text-xs font-normal text-slate-500">
                  (Optional, Markdown supported)
                </span>
              </label>
              <textarea
                id="editThreadContent"
                value={editThreadContent || ""}
                onChange={(e) => setEditThreadContent(e.target.value)}
                rows={8}
                className="input-field w-full shadow-sm focus:shadow-md"
                placeholder="Elaborate on your discussion topic..."
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto flex items-center justify-center group text-base px-6 py-2.5"
                disabled={!editThreadTitle.trim()}
              >
                <Send
                  size={18}
                  className="mr-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
              <h1
                className="text-3xl lg:text-4xl font-extrabold leading-tight
                            bg-clip-text text-transparent bg-gradient-to-r
                            from-brand-600 via-purple-600 to-pink-600
                            dark:from-brand-400 dark:via-purple-400 dark:to-pink-400
                            pb-1 select-text selection:bg-brand-500/20"
              >
                {thread.title}
              </h1>
              {currentUsername && (
                <button
                  onClick={handleToggleFavoriteOnPage}
                  className={`btn btn-sm flex items-center shrink-0 transition-all duration-200 ease-out group relative overflow-hidden
                             ${
                               isFavorited
                                 ? "bg-amber-400 hover:bg-amber-500 text-amber-900 border-amber-500 shadow-md hover:shadow-lg"
                                 : "btn-outline border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/70 text-slate-600 dark:text-slate-300"
                             }`}
                  title={
                    isFavorited ? "Remove from Favorites" : "Add to Favorites"
                  }
                >
                  <span
                    className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out ${
                      isFavorited
                        ? "translate-y-0"
                        : "-translate-y-full group-hover:translate-y-0"
                    }`}
                  >
                    <StarIconThread
                      size={18}
                      className="text-amber-900 fill-current"
                    />
                  </span>
                  <span
                    className={`flex items-center transition-transform duration-300 ease-out ${
                      isFavorited
                        ? "translate-y-full group-hover:translate-y-0"
                        : "translate-y-0"
                    }`}
                  >
                    {isFavorited ? (
                      <>
                        <StarIconThread
                          size={18}
                          className="mr-1.5 fill-current"
                        />
                        <span>Favorited</span>
                      </>
                    ) : (
                      <>
                        <StarOff size={18} className="mr-1.5" />
                        <span>Favorite</span>
                      </>
                    )}
                  </span>
                </button>
              )}
            </div>

            <div
              className="mt-2 pt-3 border-t border-slate-200/80 dark:border-slate-700/50
                           flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-400"
            >
              <span className="flex items-center group">
                <User
                  size={15}
                  className="mr-1.5 text-slate-500 dark:text-slate-500 group-hover:text-brand-500 transition-colors"
                />
                <span className="mr-1">By:</span>
                <LinkThreadPage
                  href={`/profile/${encodeURIComponent(
                    thread.createdByUsername
                  )}`}
                  className="font-semibold text-brand-600 dark:text-brand-400 hover:underline hover:text-brand-700 dark:hover:text-brand-300"
                >
                  {thread.createdByUsername}
                </LinkThreadPage>
              </span>
              <span
                className="flex items-center group"
                title={`Created: ${new Date(
                  thread.createdAt
                ).toLocaleString()}`}
              >
                <Clock
                  size={15}
                  className="mr-1.5 text-slate-500 dark:text-slate-500 group-hover:text-brand-500 transition-colors"
                />
                {format(new Date(thread.createdAt), "MMM d, yyyy, h:mm a")}
              </span>
              {threadUpdatedAtText && (
                <span className="flex items-center italic text-xs text-slate-500 dark:text-slate-500">
                  {threadUpdatedAtText}
                </span>
              )}
            </div>
            {currentUsername === thread.createdByUsername && (
              <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-700/50 flex flex-wrap gap-3">
                <button
                  onClick={handleEditThreadToggle}
                  className="btn btn-outline btn-sm text-blue-600 border-blue-500 hover:bg-blue-500 hover:text-white dark:text-blue-400 dark:border-blue-500 dark:hover:bg-blue-500 dark:hover:text-white flex items-center group"
                >
                  <Edit3
                    size={15}
                    className="mr-1.5 transition-transform group-hover:rotate-[-12deg]"
                  />{" "}
                  Edit
                </button>
                <button
                  onClick={handleDeleteThread}
                  className="btn btn-outline btn-sm text-red-600 border-red-500 hover:bg-red-500 hover:text-white dark:text-red-400 dark:border-red-500 dark:hover:bg-red-500 dark:hover:text-white flex items-center group"
                >
                  <Trash2
                    size={15}
                    className="mr-1.5 transition-transform group-hover:scale-110 group-hover:animate-shake"
                  />{" "}
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </header>

      {thread.content && !isEditingThread && (
        <section
          aria-labelledby="thread-content-heading"
          className="animate-fadeInUp"
        >
          <h2 id="thread-content-heading" className="sr-only">
            Thread Content
          </h2>
          <div
            className="bg-white dark:bg-slate-800/40 backdrop-blur-lg shadow-lg rounded-lg
                         p-5 sm:p-6 border border-slate-200 dark:border-slate-700/40
                         prose prose-slate dark:prose-invert max-w-none
                         prose-headings:font-semibold prose-headings:text-slate-800 dark:prose-headings:text-slate-100
                         prose-a:text-brand-600 dark:prose-a:text-brand-400 hover:prose-a:underline
                         prose-code:before:content-[''] prose-code:after:content-[''] prose-code:bg-slate-100 prose-code:dark:bg-slate-700 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal
                         prose-blockquote:border-brand-500 prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400"
          >
            <p className="whitespace-pre-wrap text-base leading-relaxed">
              {thread.content}
            </p>
          </div>
        </section>
      )}

      <section
        aria-labelledby="posts-heading"
        className="bg-white dark:bg-slate-800/60 backdrop-blur-2xl shadow-xl rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700/60 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
          <h2
            id="posts-heading"
            className="text-2xl font-semibold text-slate-800 dark:text-slate-100 flex items-center"
          >
            <MessageCircle
              size={24}
              strokeWidth={2}
              className="mr-2.5 text-brand-500 dark:text-brand-400"
            />
            <span>
              Replies{" "}
              <span className="text-base font-normal text-slate-500 dark:text-slate-400">
                ({thread.postCount})
              </span>
            </span>
          </h2>
        </div>

        <div className="mb-8">
          <DiscussionPostForm
            threadId={thread.id}
            currentUsername={currentUsername}
            onPostSubmitted={handleActionSuccess}
            placeholder="Join the conversation, share your insights..."
            draftIdSuffix={`_threadmain_${thread.id}`}
          />
        </div>

        <div className="space-y-5">
          {posts.length > 0 ? (
            posts.map((post) => (
              <DiscussionPostItem
                key={post.id}
                post={post}
                threadId={thread.id}
                onActionSuccess={handleActionSuccess}
                currentUsername={currentUsername}
              />
            ))
          ) : (
            <div className="text-center py-10 px-6 bg-slate-50 dark:bg-slate-800/30 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 animate-fadeIn">
              <MessageSquare
                size={48}
                strokeWidth={1.5}
                className="mx-auto text-slate-400 dark:text-slate-500 mb-4"
              />
              <p className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No Replies Yet
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Be the first to share your thoughts on this discussion!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
