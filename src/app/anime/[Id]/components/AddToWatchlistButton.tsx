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
      className={`btn ${
        onWatchlist ? "btn-secondary text-black" : "btn-primary"
      } w-full flex items-center justify-center ${className}`}
      title={onWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
      disabled={!anime || typeof anime.id !== "number"}
    >
      {onWatchlist ? (
        <CheckCircle size={18} className="mr-2" />
      ) : (
        <PlusCircle size={18} className="mr-2" />
      )}
      {onWatchlist ? "In Watchlist" : "Add to Watchlist"}
    </button>
  );
};

export default AddToWatchlistButton;
