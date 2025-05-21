// src/hooks/useDraft.ts
"use client";
import { useState, useEffect, useCallback } from "react";
const DRAFT_DEBOUNCE_TIME = 1000;
export function useDraft(draftKey: string, initialValue: string = "") {
  const [text, setText] = useState(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        setText(savedDraft);
      }
      setIsLoaded(true);
    }
  }, [draftKey]);
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    const handler = setTimeout(() => {
      if (text.trim()) {
        localStorage.setItem(draftKey, text);
      } else {
        localStorage.removeItem(draftKey);
      }
    }, DRAFT_DEBOUNCE_TIME);

    return () => {
      clearTimeout(handler);
    };
  }, [text, draftKey, isLoaded]);
  const clearDraft = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(draftKey);
    }
    setText("");
  }, [draftKey]);
  return [text, setText, clearDraft, isLoaded] as const;
}
