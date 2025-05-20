// src/app/anime/[id]/components/ScrollToTopButton.tsx
"use client";

import { ArrowUpCircle } from "lucide-react";
import {
  useEffect as useEffectScrollTop,
  useState as useStateScrollTop,
} from "react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useStateScrollTop(false);
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffectScrollTop(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-opacity duration-300
        ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
        bg-brand-primary text-white hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50
      `}
      aria-label="Scroll to top"
    >
      <ArrowUpCircle size={24} />
    </button>
  );
}
