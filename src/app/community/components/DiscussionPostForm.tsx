// src/app/community/components/DiscussionPostForm.tsx
"use client";
import ReactDPF, {
  useState as useStateDPF,
  useEffect as useEffectDPF,
  useRef as useRefDPF,
} from "react";
import { Send, UserCircle } from "lucide-react";
import LinkDPF from "next/link";
import { toast } from "@/components/shared/Toaster";
import { useDraft } from "@/hooks/useDraft";
import { useDiscussionStore } from "@/stores/discussionStore";

interface DiscussionPostFormProps {
  threadId: string;
  currentUsername: string | null;
  parentId?: string | null;
  onPostSubmitted?: () => void;
  placeholder?: string;
  isReplyForm?: boolean;
  draftIdSuffix?: string;
  autoFocusReply?: boolean;
}

const DiscussionPostForm: React.FC<DiscussionPostFormProps> = ({
  threadId,
  currentUsername,
  parentId = null,
  onPostSubmitted,
  placeholder = "Write a post...",
  isReplyForm = false,
  draftIdSuffix = "",
  autoFocusReply = false,
}) => {
  const draftKey = `discussion_post_draft_${threadId}${
    parentId ? `_reply_${parentId}` : ""
  }${draftIdSuffix}`;
  const [text, setText, clearDraft, isDraftLoaded] = useDraft(draftKey);
  const [isSubmitting, setIsSubmitting] = useStateDPF(false);
  const addPostToThread = useDiscussionStore((state) => state.addPostToThread);
  const textareaRef = useRefDPF<HTMLTextAreaElement>(null);

  useEffectDPF(() => {
    if (autoFocusReply && isReplyForm && textareaRef.current && isDraftLoaded) {
      textareaRef.current.focus();
    }
  }, [autoFocusReply, isReplyForm, isDraftLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUsername) {
      toast.error("You must be logged in to post.");
      return;
    }
    if (!text.trim()) {
      toast.error("Post cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newPost = addPostToThread(
        threadId,
        text.trim(),
        currentUsername,
        parentId
      );
      if (newPost) {
        clearDraft();
        toast.success(
          parentId ? "Reply posted in thread!" : "Post added to thread!"
        );
        onPostSubmitted?.();
      }
    } catch (error) {
      console.error("Failed to submit post:", error);
      toast.error("Failed to submit post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`mt-1 ${
        isReplyForm ? "p-0" : "p-3 card-bg rounded-lg shadow"
      }`}
    >
      <div className="flex items-start space-x-3">
        {!isReplyForm && currentUsername && (
          <LinkDPF
            href={`/profile/${encodeURIComponent(currentUsername)}`}
            className="flex-shrink-0"
          >
            <UserCircle
              size={36}
              className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-1"
            />
          </LinkDPF>
        )}
        {!isReplyForm && !currentUsername && (
          <UserCircle
            size={36}
            className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-1"
          />
        )}

        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={isDraftLoaded ? text : ""}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            rows={isReplyForm ? 2 : 3}
            className="input-field w-full text-sm"
            disabled={isSubmitting || !currentUsername || !isDraftLoaded}
          />
          {currentUsername && isDraftLoaded && (
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                className="btn btn-primary btn-sm flex items-center"
                disabled={isSubmitting || !text.trim()}
              >
                <Send size={16} className="mr-1.5" />
                {isSubmitting
                  ? parentId
                    ? "Replying..."
                    : "Posting..."
                  : parentId
                  ? "Post Reply"
                  : "Post"}
              </button>
            </div>
          )}
        </div>
      </div>
      {!currentUsername && !isReplyForm && (
        <p className="text-xs text-center text-text-muted-light dark:text-text-muted-dark mt-3">
          Please{" "}
          <LinkDPF
            href="/login"
            className="text-brand-primary hover:underline font-semibold"
          >
            login
          </LinkDPF>{" "}
          to post in discussions.
        </p>
      )}
    </form>
  );
};

export default DiscussionPostForm;
