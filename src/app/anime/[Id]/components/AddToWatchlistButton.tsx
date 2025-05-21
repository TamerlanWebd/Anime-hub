// src\app\anime\[Id]\components\AddToWatchlistButton.tsx
"use client";

import React, {
  useEffect as useEffectWatchlistBtn,
  useState as useStateWatchlistBtn,
} from "react";
import { PlusCircle, CheckCircle, Loader2 } from "lucide-react";
import { AnilistMedia } from "@/@types/types";
import { useUserStore } from "@/stores/userStore";
interface AddToWatchlistButtonProps {
  anime: AnilistMedia;
  className?: string;
}

const AddToWatchlistButton: React.FC<AddToWatchlistButtonProps> = ({
  anime,
  className,
}) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, username } =
    useUserStore();
  const [isClient, setIsClient] = useStateWatchlistBtn(false);

  useEffectWatchlistBtn(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <button
        className={`btn btn-outline w-full flex items-center justify-center ${className}`}
        disabled
      >
        <Loader2 size={18} className="mr-2 animate-spin" /> Loading...
      </button>
    );
  }
  const onWatchlist =
    username && typeof anime.id === "number" ? isInWatchlist(anime.id) : false;
  const handleToggleWatchlist = () => {
    if (!username) {
      addToWatchlist(anime);
      return;
    }
    addToWatchlist(anime);
  };

  return (
    <button
      onClick={handleToggleWatchlist}
      className={`btn w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-150 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-background-dark
    ${
      onWatchlist
        ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-700 dark:text-green-100 dark:hover:bg-green-600 border border-green-300 dark:border-green-600 focus:ring-green-500"
        : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-blue-500"
    }
    ${className || ""}`}
      title={onWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
      disabled={!anime || typeof anime.id !== "number"}
    >
      {onWatchlist ? (
        <CheckCircle size={18} className="mr-2 flex-shrink-0" />
      ) : (
        <PlusCircle size={18} className="mr-2 flex-shrink-0" />
      )}
      <span className="truncate">
        {onWatchlist ? "In Watchlist" : "Add to Watchlist"}
      </span>
    </button>
  );
};

export default AddToWatchlistButton;
