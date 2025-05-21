// src/store/discussionStore.ts
import { DiscussionThread, DiscussionPost } from "@/@types/types";
import { toast } from "@/components/shared/Toaster";
import { create as createZustand } from "zustand";
import {
  persist as persistZustand,
  createJSONStorage as createJSONStorageZustand,
} from "zustand/middleware";

interface DiscussionState {
  threads: DiscussionThread[];
  postsByThreadId: Record<string, DiscussionPost[] | undefined>;

  createThread: (
    title: string,
    content: string | undefined,
    username: string
  ) => DiscussionThread | null;
  updateThread: (
    threadId: string,
    newTitle: string,
    newContent: string | undefined,
    username: string
  ) => boolean;
  deleteThread: (threadId: string, username: string) => boolean;
  getThreads: (sortBy?: "newest" | "activity") => DiscussionThread[];
  getThreadById: (threadId: string) => DiscussionThread | undefined;
  incrementPostCount: (threadId: string) => void;
  decrementPostCount: (threadId: string, count?: number) => void;
  updateLastActivity: (threadId: string) => void;
  addPostToThread: (
    threadId: string,
    text: string,
    username: string,
    parentId?: string | null
  ) => DiscussionPost | null;
  updatePost: (
    threadId: string,
    postId: string,
    newText: string,
    username: string
  ) => boolean;
  deletePost: (threadId: string, postId: string, username: string) => boolean;
  getPostsForThread: (threadId: string) => DiscussionPost[];
}

export const useDiscussionStore = createZustand<DiscussionState>()(
  persistZustand(
    (set, get) => ({
      threads: [],
      postsByThreadId: {},
      createThread: (title, content, username) => {
        if (!username) {
          toast.error("You must be logged in to create a thread.");
          return null;
        }
        if (!title.trim()) {
          toast.error("Thread title cannot be empty.");
          return null;
        }
        const now = new Date().toISOString();
        const newThread: DiscussionThread = {
          id: uuidv4(),
          title: title.trim(),
          content: content?.trim() || undefined,
          createdByUserId: username,
          createdByUsername: username,
          createdAt: now,
          lastActivityAt: now,
          postCount: 0,
        };
        set((state) => ({
          threads: [newThread, ...state.threads],
        }));
        toast.success("Discussion thread created!");
        return newThread;
      },
      updateThread: (threadId, newTitle, newContent, username) => {
        const threadIndex = get().threads.findIndex(
          (t) => t.id === threadId && !t.isDeleted
        );
        if (threadIndex === -1) {
          toast.error("Thread not found or already deleted.");
          return false;
        }
        const threadToUpdate = get().threads[threadIndex];
        if (threadToUpdate.createdByUsername !== username) {
          toast.error("You can only edit your own threads.");
          return false;
        }
        if (!newTitle.trim()) {
          toast.error("Thread title cannot be empty.");
          return false;
        }

        const updatedThread: DiscussionThread = {
          ...threadToUpdate,
          title: newTitle.trim(),
          content: newContent?.trim() || undefined,
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          threads: state.threads.map((t) =>
            t.id === threadId ? updatedThread : t
          ),
        }));
        toast.success("Thread updated!");
        return true;
      },
      deleteThread: (threadId, username) => {
        const threadIndex = get().threads.findIndex(
          (t) => t.id === threadId && !t.isDeleted
        );
        if (threadIndex === -1) {
          toast.error("Thread not found or already (soft) deleted.");
          return false;
        }
        const threadToDelete = get().threads[threadIndex];
        if (threadToDelete.createdByUsername !== username) {
          toast.error("You can only delete your own threads.");
          return false;
        }
        const updatedThread: DiscussionThread = {
          ...threadToDelete,
          isDeleted: true,
          title: "[thread deleted by author]",
          content: undefined,
          updatedAt: new Date().toISOString(),
        };

        set((state) => {
          const newThreads = state.threads.map((t) =>
            t.id === threadId ? updatedThread : t
          );
          const postsForThread = state.postsByThreadId[threadId] || [];
          const updatedPostsForThread = postsForThread.map((p) => ({
            ...p,
            isDeleted: true,
            text: "[post in a deleted thread]",
            updatedAt: new Date().toISOString(),
          }));

          return {
            threads: newThreads,
            postsByThreadId: {
              ...state.postsByThreadId,
              [threadId]: updatedPostsForThread,
            },
          };
        });
        toast.success("Thread and all its posts deleted.");
        return true;
      },
      getThreads: (sortBy = "activity") => {
        const threads = [...get().threads].filter((t) => !t.isDeleted);
        if (sortBy === "activity") {
          return threads.sort(
            (a, b) =>
              new Date(b.lastActivityAt).getTime() -
              new Date(a.lastActivityAt).getTime()
          );
        }
        return threads.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      getThreadById: (threadId) => {
        const thread = get().threads.find((t) => t.id === threadId);
        return thread && !thread.isDeleted ? thread : undefined;
      },
      incrementPostCount: (threadId) => {
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? { ...thread, postCount: thread.postCount + 1 }
              : thread
          ),
        }));
      },
      decrementPostCount: (threadId, count = 1) => {
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? { ...thread, postCount: Math.max(0, thread.postCount - count) }
              : thread
          ),
        }));
      },
      updateLastActivity: (threadId) => {
        const now = new Date().toISOString();
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId ? { ...thread, lastActivityAt: now } : thread
          ),
        }));
      },
      addPostToThread: (threadId, text, username, parentId = null) => {
        if (!username) {
          toast.error("You must be logged in to post.");
          return null;
        }
        const threadExists = get().getThreadById(threadId);
        if (!threadExists) {
          toast.error("Discussion thread not found or has been deleted.");
          return null;
        }
        if (!text.trim()) {
          toast.error("Post cannot be empty.");
          return null;
        }

        const newPost: DiscussionPost = {
          id: uuidv4(),
          threadId,
          userId: username,
          username,
          text: text.trim(),
          createdAt: new Date().toISOString(),
          parentId,
        };

        set((state) => {
          const existingPosts = state.postsByThreadId[threadId] || [];
          return {
            postsByThreadId: {
              ...state.postsByThreadId,
              [threadId]: [...existingPosts, newPost],
            },
          };
        });
        get().incrementPostCount(threadId);
        get().updateLastActivity(threadId);
        return newPost;
      },
      updatePost: (threadId, postId, newText, username) => {
        const postsForThread = get().postsByThreadId[threadId];
        if (!postsForThread) return false;
        const postIndex = postsForThread.findIndex(
          (p) => p.id === postId && !p.isDeleted
        );
        if (postIndex === -1) {
          toast.error("Post not found or already deleted.");
          return false;
        }
        const postToUpdate = postsForThread[postIndex];
        if (postToUpdate.username !== username) {
          toast.error("You can only edit your own posts.");
          return false;
        }
        if (!newText.trim()) {
          toast.error("Post text cannot be empty.");
          return false;
        }
        const updatedPost: DiscussionPost = {
          ...postToUpdate,
          text: newText.trim(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => {
          const currentPosts = state.postsByThreadId[threadId] || [];
          const newPosts = [...currentPosts];
          newPosts[postIndex] = updatedPost;
          return {
            postsByThreadId: {
              ...state.postsByThreadId,
              [threadId]: newPosts,
            },
          };
        });
        get().updateLastActivity(threadId);
        toast.success("Post updated!");
        return true;
      },
      deletePost: (threadId, postId, username) => {
        const postsForThread = get().postsByThreadId[threadId];
        if (!postsForThread) return false;

        const postIndex = postsForThread.findIndex(
          (p) => p.id === postId && !p.isDeleted
        );
        if (postIndex === -1) {
          toast.error("Post not found or already deleted.");
          return false;
        }
        const postToDelete = postsForThread[postIndex];
        if (postToDelete.username !== username) {
          toast.error("You can only delete your own posts.");
          return false;
        }
        const allPostsFlat = [...(get().postsByThreadId[threadId] || [])];
        let idsToDeleteSet = new Set<string>([postId]);
        let queue = [postId];
        let postsToMarkDeletedCount = 0;
        while (queue.length > 0) {
          const currentParentId = queue.shift()!;
          allPostsFlat.forEach((p) => {
            if (
              p.parentId === currentParentId &&
              !idsToDeleteSet.has(p.id) &&
              !p.isDeleted
            ) {
              idsToDeleteSet.add(p.id);
              queue.push(p.id);
            }
          });
        }

        const newPostsList = allPostsFlat.map((p) => {
          if (idsToDeleteSet.has(p.id) && !p.isDeleted) {
            postsToMarkDeletedCount++;
            return {
              ...p,
              isDeleted: true,
              text:
                p.id === postId
                  ? "[post deleted by author]"
                  : "[reply deleted]",
              updatedAt: new Date().toISOString(),
            };
          }
          return p;
        });

        set((state) => ({
          postsByThreadId: {
            ...state.postsByThreadId,
            [threadId]: newPostsList,
          },
        }));

        if (postsToMarkDeletedCount > 0) {
          get().decrementPostCount(threadId, postsToMarkDeletedCount);
        }
        get().updateLastActivity(threadId);
        toast.success("Post and its replies deleted.");
        return true;
      },
      getPostsForThread: (threadId) => {
        const allPostsForThread = (
          get().postsByThreadId[threadId] || []
        ).filter((p) => !p.isDeleted);
        const postMap: Record<
          string,
          DiscussionPost & { replies: DiscussionPost[] }
        > = {};
        allPostsForThread.forEach((post) => {
          postMap[post.id] = { ...post, replies: [] };
        });

        const topLevelPosts: (DiscussionPost & {
          replies: DiscussionPost[];
        })[] = [];
        allPostsForThread.forEach((post) => {
          if (post.parentId && postMap[post.parentId]) {
            postMap[post.parentId].replies.push(postMap[post.id]);
            postMap[post.parentId].replies.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );
          } else {
            topLevelPosts.push(postMap[post.id]);
          }
        });
        return topLevelPosts.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      },
    }),
    {
      name: "discussions-storage",
      storage: createJSONStorageZustand(() => localStorage),
    }
  )
);

function uuidv4(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  console.warn(
    "crypto.randomUUID() is not available. Using a less secure fallback for UUID generation."
  );
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
