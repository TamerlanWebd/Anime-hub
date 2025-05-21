// src/app/community/page.tsx
import PageTitle from "@/components/shared/PageTitle";
import {
  Users,
  MessageSquare,
  Activity,
  LayoutList,
  PlusCircle,
  Users2,
} from "lucide-react";
import LinkCommunity from "next/link";

export default function CommunityPage() {
  const iconColorActivity = "text-sky-500 dark:text-sky-400";
  const iconColorDiscussions = "text-purple-500 dark:text-purple-400";
  const iconColorStartDiscussion = "text-green-500 dark:text-green-400";

  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <PageTitle
        title="AnimeHub Community"
        subtitle="Connect, discuss, and share with fellow anime fans."
        icon={<Users2 size={36} className="text-blue-500 dark:text-blue-400" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
        <LinkCommunity
          href="/community/feed"
          className="group block bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 hover:scale-[1.02] border border-slate-200 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-400"
        >
          <div className="flex items-center mb-4">
            <Activity
              size={32}
              className={`mr-4 ${iconColorActivity} transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-110`}
            />
            <h2
              className={`text-xl sm:text-2xl font-semibold ${iconColorActivity}`}
            >
              Activity Feed
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            See the latest comments, watchlist additions, and new discussions
            from the community.
          </p>
        </LinkCommunity>
        <LinkCommunity
          href="/community/discussions"
          className="group block bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 hover:scale-[1.02] border border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-400"
        >
          <div className="flex items-center mb-4">
            <MessageSquare
              size={32}
              className={`mr-4 ${iconColorDiscussions} transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-110`}
            />
            <h2
              className={`text-xl sm:text-2xl font-semibold ${iconColorDiscussions}`}
            >
              Discussions
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Browse and participate in topics about anime, genres, and more.
          </p>
        </LinkCommunity>
        <LinkCommunity
          href="/community/discussions/new"
          className="group block bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 hover:scale-[1.02] border border-slate-200 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-400"
        >
          <div className="flex items-center mb-4">
            <PlusCircle
              size={32}
              className={`mr-4 ${iconColorStartDiscussion} transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-110`}
            />
            <h2
              className={`text-xl sm:text-2xl font-semibold ${iconColorStartDiscussion}`}
            >
              Start a Discussion
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Have something to share or ask? Create your own discussion thread.
          </p>
        </LinkCommunity>
      </div>
      <div className="bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-800 dark:to-slate-800/80 p-8 md:p-10 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
        <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-100 text-center sm:text-left">
          More Features Coming Soon!
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg text-center sm:text-left">
          We're actively working on expanding our community features. Here's a
          sneak peek of what's planned:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white/70 dark:bg-slate-700/50 backdrop-blur-sm p-6 rounded-xl border border-slate-300 dark:border-slate-600 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2 flex items-center text-slate-700 dark:text-slate-200">
              <Users
                className="mr-3 text-pink-500 dark:text-pink-400"
                size={26}
              />{" "}
              User Reviews & Ratings
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Share your detailed opinions and scores for anime series.
            </p>
          </div>

          <div className="bg-white/70 dark:bg-slate-700/50 backdrop-blur-sm p-6 rounded-xl border border-slate-300 dark:border-slate-600 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2 flex items-center text-slate-700 dark:text-slate-200">
              <LayoutList
                className="mr-3 text-indigo-500 dark:text-indigo-400"
                size={26}
              />{" "}
              Customizable User Lists
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Create and share custom lists like "Top 10 Action Anime" or
              "Must-Watch Movies".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
