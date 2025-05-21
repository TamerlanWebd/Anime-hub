// src/store/commentStore.ts
import { toast } from "@/components/shared/Toaster";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { persist, createJSONStorage } from "zustand/middleware";
import { Comment } from "@/@types/types";
export interface CommentState {
  commentsByAnimeId: Record<number, Comment[] | undefined>;
  addComment: (
    animeId: number,
    text: string,
    username: string,
    parentId?: string | null
  ) => Comment | null;
  updateComment: (
    animeId: number,
    commentId: string,
    newText: string,
    username: string
  ) => boolean;
  deleteComment: (
    animeId: number,
    commentId: string,
    username: string
  ) => boolean;
  getComments: (animeId: number) => Comment[];
}
type CommentStateCreator = (
  set: (
    partial:
      | Partial<CommentState>
      | ((state: CommentState) => Partial<CommentState>)
  ) => void,
  get: () => CommentState
) => CommentState;

export const useCommentStore = create<CommentState>()(
  persist(
    (set, get) =>
      ({
        commentsByAnimeId: {},

        getComments: (animeId: number): Comment[] => {
          const allCommentsForAnime = (
            get().commentsByAnimeId[animeId] || []
          ).filter((c: Comment) => !c.isDeleted);

          const commentMap: Record<string, Comment & { replies: Comment[] }> =
            {};
          allCommentsForAnime.forEach((comment: Comment) => {
            commentMap[comment.id] = { ...comment, replies: [] };
          });

          const topLevelComments: (Comment & { replies: Comment[] })[] = [];
          allCommentsForAnime.forEach((comment: Comment) => {
            if (comment.parentId && commentMap[comment.parentId]) {
              commentMap[comment.parentId].replies.push(commentMap[comment.id]);
              commentMap[comment.parentId].replies.sort(
                (a: Comment, b: Comment) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              );
            } else {
              topLevelComments.push(commentMap[comment.id]);
            }
          });

          return topLevelComments.sort(
            (a: Comment, b: Comment) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        },

        addComment: (
          animeId: number,
          text: string,
          username: string,
          parentId: string | null | undefined = null
        ): Comment | null => {
          if (!username) {
            toast.error("You must be logged in to comment.");
            return null;
          }
          if (!text.trim()) {
            toast.error("Comment cannot be empty.");
            return null;
          }
          const newComment: Comment = {
            id: uuidv4(),
            animeId,
            userId: username,
            username,
            text: text.trim(),
            createdAt: new Date().toISOString(),
            parentId,
          };

          set((state: CommentState) => {
            const existingComments = state.commentsByAnimeId[animeId] || [];
            return {
              commentsByAnimeId: {
                ...state.commentsByAnimeId,
                [animeId]: [...existingComments, newComment],
              },
            };
          });
          return newComment;
        },

        updateComment: (
          animeId: number,
          commentId: string,
          newText: string,
          username: string
        ): boolean => {
          const commentsForAnime = get().commentsByAnimeId[animeId];
          if (!commentsForAnime) return false;

          const commentIndex = commentsForAnime.findIndex(
            (c: Comment) => c.id === commentId && !c.isDeleted
          );
          if (commentIndex === -1) {
            toast.error("Comment not found or already deleted.");
            return false;
          }

          const commentToUpdate = commentsForAnime[commentIndex];
          if (commentToUpdate.username !== username) {
            toast.error("You can only edit your own comments.");
            return false;
          }
          if (!newText.trim()) {
            toast.error("Comment text cannot be empty.");
            return false;
          }

          const updatedComment: Comment = {
            ...commentToUpdate,
            text: newText.trim(),
            updatedAt: new Date().toISOString(),
          };

          set((state: CommentState) => {
            const currentComments = state.commentsByAnimeId[animeId] || [];
            const newComments = [...currentComments];
            newComments[commentIndex] = updatedComment;
            return {
              commentsByAnimeId: {
                ...state.commentsByAnimeId,
                [animeId]: newComments,
              },
            };
          });
          toast.success("Comment updated!");
          return true;
        },

        deleteComment: (
          animeId: number,
          commentId: string,
          username: string
        ): boolean => {
          const commentsForAnime = get().commentsByAnimeId[animeId];
          if (!commentsForAnime) return false;

          const commentIndex = commentsForAnime.findIndex(
            (c: Comment) => c.id === commentId && !c.isDeleted
          );
          if (commentIndex === -1) {
            toast.error("Comment not found or already deleted.");
            return false;
          }

          const commentToDelete = commentsForAnime[commentIndex];
          if (commentToDelete.username !== username) {
            toast.error("You can only delete your own comments.");
            return false;
          }

          const allComments = [...(get().commentsByAnimeId[animeId] || [])];
          let idsToDelete = new Set<string>([commentId]);
          let queue = [commentId];

          while (queue.length > 0) {
            const currentParentId = queue.shift()!;
            allComments.forEach((c: Comment) => {
              if (
                c.parentId === currentParentId &&
                !idsToDelete.has(c.id) &&
                !c.isDeleted
              ) {
                idsToDelete.add(c.id);
                queue.push(c.id);
              }
            });
          }

          const newCommentsList = allComments.map((c: Comment) => {
            if (idsToDelete.has(c.id) && !c.isDeleted) {
              return {
                ...c,
                isDeleted: true,
                text:
                  c.id === commentId
                    ? "[comment deleted by author]"
                    : "[reply deleted]",
                updatedAt: new Date().toISOString(),
              };
            }
            return c;
          });

          set((state: CommentState) => ({
            commentsByAnimeId: {
              ...state.commentsByAnimeId,
              [animeId]: newCommentsList,
            },
          }));
          toast.success("Comment and its replies deleted.");
          return true;
        },
      } as CommentState),
    {
      name: "anime-comments-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
