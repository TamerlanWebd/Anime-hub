// src/app/community/components/DiscussionPostItem.tsx
"use client";
import ReactDPI, {
  useState as useStateDPI,
  useEffect as useEffectDPI,
  useRef as useRefDPI,
} from "react";

import {
  UserCircle,
  MessageSquare as ReplyIcon,
  Edit2,
  Trash2,
  Send,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import DiscussionPostForm from "./DiscussionPostForm";

import LinkDPI from "next/link";
import { DiscussionPost } from "@/@types/types";
import { toast } from "@/components/shared/Toaster";
import { useDiscussionStore } from "@/stores/discussionStore";

interface DiscussionPostItemProps {
  post: DiscussionPost;
  threadId: string;
  onActionSuccess?: () => void;
  currentUsername: string | null;
  level?: number;
}

const getIndentationClasses = (level: number): string => {
  if (level === 0) return "my-2";
  const mlClasses = ["ml-0", "ml-4 sm:ml-6", "ml-8 sm:ml-12", "ml-12 sm:ml-18"];
  const paddingLeftClass = "pl-3 sm:pl-4";
  const borderClass = "border-l-2 border-slate-200 dark:border-slate-700";
  return `${
    mlClasses[Math.min(level, mlClasses.length - 1)]
  } ${paddingLeftClass} ${borderClass} my-2`;
};

const DiscussionPostItem: React.FC<DiscussionPostItemProps> = ({
  post,
  threadId,
  onActionSuccess,
  currentUsername,
  level = 0,
}) => {
  const [showReplyForm, setShowReplyForm] = useStateDPI(false);
  const [isEditing, setIsEditing] = useStateDPI(false);
  const [editText, setEditText] = useStateDPI(post.text);

  const { updatePost, deletePost } = useDiscussionStore();
  const textareaRef = useRefDPI<HTMLTextAreaElement>(null);

  useEffectDPI(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  let timeAgo = "just now";
  if (post.createdAt) {
    try {
      timeAgo = formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
      });
    } catch (e) {}
  }
  let updatedAtText = "";
  if (
    post.updatedAt &&
    new Date(post.updatedAt).getTime() !== new Date(post.createdAt).getTime() &&
    !post.isDeleted
  ) {
    try {
      updatedAtText = `(edited ${formatDistanceToNow(new Date(post.updatedAt), {
        addSuffix: true,
      })})`;
    } catch (e) {}
  }

  const handleReplyToggle = () => {
    if (!currentUsername) {
      toast.info("Please login to reply.");
      return;
    }
    setShowReplyForm(!showReplyForm);
    if (isEditing) setIsEditing(false);
  };

  const handleEditToggle = () => {
    if (post.username !== currentUsername) return;
    setIsEditing(!isEditing);
    if (!isEditing) setEditText(post.text);
    if (showReplyForm) setShowReplyForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUsername || !editText.trim()) {
      toast.error("Post content cannot be empty.");
      return;
    }
    if (updatePost(threadId, post.id, editText.trim(), currentUsername)) {
      setIsEditing(false);
      onActionSuccess?.();
    }
  };

  const handleDelete = () => {
    if (!currentUsername || post.username !== currentUsername) {
      toast.error("You can only delete your own posts.");
      return;
    }
    if (
      window.confirm(
        "Are you sure you want to delete this post and all its replies? This action cannot be undone."
      )
    ) {
      if (deletePost(threadId, post.id, currentUsername)) {
        onActionSuccess?.();
      }
    }
  };

  const indentationClasses = getIndentationClasses(level);

  if (post.isDeleted) {
    return (
      <div
        className={`py-3 ${indentationClasses} bg-slate-50 dark:bg-slate-800/30 rounded-md`}
        id={`post-${post.id}`}
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <AlertTriangle
            size={level > 0 ? 18 : 22}
            className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5"
          />
          <p className="text-sm italic text-slate-500 dark:text-slate-400">
            {post.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg p-3 sm:p-4 ${indentationClasses}`}
      id={`post-${post.id}`}
    >
      <div className="flex items-start space-x-3 sm:space-x-4">
        <LinkDPI
          href={`/profile/${encodeURIComponent(post.username)}`}
          className="flex-shrink-0 mt-0.5"
        >
          <UserCircle
            size={level > 0 ? 32 : 40}
            className="text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          />
        </LinkDPI>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline space-x-2 flex-wrap mb-1">
            <LinkDPI
              href={`/profile/${encodeURIComponent(post.username)}`}
              className="font-semibold text-sm text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
            >
              {post.username}
            </LinkDPI>
            <span
              className="text-xs text-slate-500 dark:text-slate-400 flex items-center"
              title={new Date(post.createdAt).toLocaleString()}
            >
              <Clock size={12} className="mr-1 opacity-70" />
              {timeAgo}
            </span>
            {updatedAtText && (
              <span className="text-xs text-slate-400 dark:text-slate-500 italic">
                {updatedAtText}
              </span>
            )}
          </div>
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="mt-1.5 space-y-2">
              <textarea
                ref={textareaRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={Math.max(2, Math.min(8, editText.split("\n").length + 1))}
                className="input-field w-full text-sm !py-2 !px-2.5 rounded-md border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter your post content..."
              />
              <div className="flex items-center space-x-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-xs flex items-center"
                  disabled={!editText.trim()}
                >
                  <Send size={14} className="mr-1.5" /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="btn btn-ghost btn-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 whitespace-pre-wrap py-1 break-words">
              {post.text}
            </div>
          )}
          {!isEditing && (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center space-x-4">
              <button
                onClick={handleReplyToggle}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center disabled:opacity-60 disabled:cursor-not-allowed group"
                disabled={!currentUsername}
                title={
                  !currentUsername ? "Login to reply" : "Reply to this post"
                }
              >
                <ReplyIcon
                  size={14}
                  className="mr-1 group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors"
                />{" "}
                Reply
              </button>
              {currentUsername === post.username && (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline flex items-center group"
                  >
                    <Edit2
                      size={14}
                      className="mr-1 group-hover:text-sky-500 dark:group-hover:text-sky-300 transition-colors"
                    />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline flex items-center group"
                  >
                    <Trash2
                      size={14}
                      className="mr-1 group-hover:text-red-500 dark:group-hover:text-red-300 transition-colors"
                    />
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {showReplyForm && currentUsername && !isEditing && (
        <div
          className={`mt-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-700 ${
            level > 0 ? "" : "ml-12 sm:ml-16"
          }`}
        >
          <DiscussionPostForm
            threadId={threadId}
            parentId={post.id}
            currentUsername={currentUsername}
            onPostSubmitted={() => {
              setShowReplyForm(false);
              onActionSuccess?.();
            }}
            placeholder={`Replying to ${post.username}...`}
            isReplyForm={true}
            draftIdSuffix={`_replyto_${post.id}`}
          />
        </div>
      )}

      {post.replies && post.replies.length > 0 && (
        <div className="mt-3 space-y-2">
          {post.replies.map((reply) => (
            <DiscussionPostItem
              key={reply.id}
              post={reply}
              threadId={threadId}
              onActionSuccess={onActionSuccess}
              currentUsername={currentUsername}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionPostItem;
