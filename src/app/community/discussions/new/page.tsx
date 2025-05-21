// src/app/community/discussions/new/page.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";
import { Send, FileText, AlertTriangle, LogIn, Loader2 } from "lucide-react";

import Link from "next/link";
import PageTitle from "@/components/shared/PageTitle";
import { toast } from "@/components/shared/Toaster";
import { useDiscussionStore } from "@/stores/discussionStore";
import { useUserStore } from "@/stores/userStore";

export default function NewDiscussionPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createThread = useDiscussionStore((state) => state.createThread);
  const { username } = useUserStore();
  const router = useRouter();

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!username) {
      router.push("/login?redirect=/community/discussions/new");
    } else {
      titleInputRef.current?.focus();
    }
  }, [username, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      toast.error("Login required to create a discussion.");
      return;
    }
    if (!title.trim()) {
      toast.error("Discussion title cannot be empty.");
      return;
    }
    const trimmedContent = content.trim();

    setIsSubmitting(true);
    const newThread = createThread(title.trim(), trimmedContent, username);
    setIsSubmitting(false);

    if (newThread) {
      toast.success("Discussion created successfully!");
      router.push(`/community/discussions/${newThread.id}`);
    } else {
    }
  };
  if (!username) {
    return (
      <div className="bg-slate-100 dark:bg-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-xl shadow-xl text-center max-w-md w-full">
          <AlertTriangle
            size={56}
            className="text-amber-500 dark:text-amber-400 mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
            Login Required
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8 text-base">
            To start a new discussion, you need to be logged in.
          </p>
          <Link
            href="/login?redirect=/community/discussions/new"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm text-base"
          >
            <LogIn size={20} className="mr-2" />
            Go to Login Page
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <PageTitle
        title="Start a New Discussion"
        subtitle="Share your thoughts, ask questions, or spark a new conversation with the community."
        icon={
          <FileText
            size={36}
            className="text-indigo-500 dark:text-indigo-400"
          />
        }
      />
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div>
            <label
              htmlFor="threadTitle"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Discussion Title <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              ref={titleInputRef}
              type="text"
              id="threadTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field w-full text-base py-2.5 px-3.5 rounded-lg border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., Best fight scenes in recent anime?"
              required
              maxLength={150}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              Choose a clear and engaging title (max 150 characters).
            </p>
          </div>

          <div>
            <label
              htmlFor="threadContent"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Your Message{" "}
              <span className="text-xs text-slate-400 dark:text-slate-500">
                (Optional)
              </span>
            </label>
            <textarea
              id="threadContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="input-field w-full text-sm py-2.5 px-3.5 rounded-lg border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Elaborate on your topic here. You can provide more context, ask specific questions, or share your initial thoughts..."
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              Provide details to help others understand and engage with your
              discussion.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm text-base disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? (
                <Loader2 size={20} className="animate-spin mr-2.5" />
              ) : (
                <Send size={18} className="mr-2.5" />
              )}
              {isSubmitting ? "Creating Discussion..." : "Create Discussion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
