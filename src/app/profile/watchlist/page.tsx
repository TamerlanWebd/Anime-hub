// src/app/profile/watchlist/page.tsx
"use client";
import AnimeCard from "@/components/shared/AnimeCard";
import { useUserStore } from "@/stores/userStore";
import { ListVideo, Search } from "lucide-react";
import LinkWL from "next/link";

export default function WatchlistPage() {
  const { watchlist, username } = useUserStore();
  if (!username) {
    return (
      <div className="text-center py-10">
        <ListVideo
          size={48}
          className="mx-auto text-text-muted-light dark:text-text-muted-dark mb-3"
        />
        <h3 className="text-lg font-medium mb-1">Login Required</h3>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          Please{" "}
          <LinkWL
            href="/login?redirect=/profile/watchlist"
            className="text-brand-primary hover:underline"
          >
            login
          </LinkWL>{" "}
          to view your watchlist.
        </p>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-1 flex items-center">
          <ListVideo size={24} className="mr-2 text-accent-purple" /> My
          Watchlist
        </h2>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
          Your personal list of anime to watch.
        </p>
        <div className="text-center py-10 border border-dashed border-border-light dark:border-border-dark rounded-lg">
          <ListVideo
            size={48}
            className="mx-auto text-text-muted-light dark:text-text-muted-dark mb-3"
          />
          <h3 className="text-lg font-medium mb-1">Your Watchlist is Empty</h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-3">
            Add some anime to keep track of what you want to watch.
          </p>
          <LinkWL href="/anime/search" className="btn btn-primary">
            <Search size={18} className="mr-1.5" /> Discover Anime
          </LinkWL>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1 flex items-center">
        <ListVideo size={24} className="mr-2 text-accent-purple" /> My Watchlist
        ({watchlist.length})
      </h2>
      <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
        Your personal list of anime you plan to watch. Items are sorted by
        recently added first.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {watchlist.map((watchlistItem, index) => (
          <div key={watchlistItem.anime.id} className="relative">
            <AnimeCard anime={watchlistItem.anime} priorityImage={index < 4} />
          </div>
        ))}
      </div>
    </div>
  );
}
