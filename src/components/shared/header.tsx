// src/components/shared/header.tsx
"use client";
import Link from "next/link";
import { Flame, Search, CalendarDays, Users, Tv } from "lucide-react";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: <Tv size={18} />,
  },
  {
    href: "/anime/search",
    label: "Discover",
    icon: <Search size={18} />,
  },
  {
    href: "/calendar",
    label: "Schedule",
    icon: <CalendarDays size={18} />,
  },
  {
    href: "/community",
    label: "Community",
    icon: <Users size={18} />,
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xl md:text-2xl font-bold text-primary transition-opacity hover:opacity-80"
        >
          <Flame size={28} className="text-primary" />
          <span>AnimeHub</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              <div className="mr-1.5 h-4 w-4">{item.icon}</div>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="h-9 w-9 rounded-full bg-muted" />
          <div className="h-9 w-24 rounded-md bg-muted hidden md:block" />
          <div className="h-9 w-9 rounded-md bg-muted md:hidden" />
        </div>
      </div>
    </header>
  );
}
