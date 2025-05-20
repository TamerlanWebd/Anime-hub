// src/app/page.tsx
"use client";

import React from "react";
import { TrendingUp, Zap, CalendarClock } from "lucide-react";
import PageTitle from "@/components/PageTitle";

function AnimeSectionStub({
  title,
  icon,
  emptyMessage = "No data available.",
}: {
  title: string;
  icon: React.ReactNode;
  emptyMessage?: string;
}) {
  return (
    <section className="mb-10 md:mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h2>
      </div>
      <p className="text-text-muted-light dark:text-text-muted-dark p-4 card-bg rounded-md">
        {emptyMessage}
      </p>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      <PageTitle
        title="Welcome to AnimeHub!"
        subtitle="Your universe of anime, right at your fingertips."
      />
      <AnimeSectionStub
        title="Trending Now"
        icon={<TrendingUp className="text-accent-pink" />}
        emptyMessage="Trending anime will appear here soon."
      />
      <AnimeSectionStub
        title="Currently Airing"
        icon={<Zap className="text-accent-yellow" />}
        emptyMessage="Currently airing anime will appear here soon."
      />
      <AnimeSectionStub
        title="Coming Soon"
        icon={<CalendarClock className="text-accent-purple" />}
        emptyMessage="Upcoming anime will appear here soon."
      />
    </div>
  );
}
