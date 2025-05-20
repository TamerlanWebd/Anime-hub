//components\shared\header.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  Search,
  CalendarDays,
  Users,
  UserCircle,
  Sun,
  Moon,
  Menu,
  X,
  Tv,
  LogIn,
  UserPlus,
  ListVideo,
  History,
  Settings,
  LogOut,
} from "lucide-react";

import { useTheme } from "next-themes";
import {
  useEffect as useEffectNavbar,
  useState as useStateNavbar,
} from "react";
import ReactNav from "react";
import { useUserStore } from "@/stores/userStore";

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
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useStateNavbar(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useStateNavbar(false);
  const pathname = usePathname();
  const { username, setUsername } = useUserStore();

  useEffectNavbar(() => setMounted(true), []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setUsername(null);
    closeMobileMenu();
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="h-7 w-32 animate-pulse rounded-md bg-muted"></div>
          </div>
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted"></div>
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted"></div>
            <div className="h-8 w-28 animate-pulse rounded-md bg-muted"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted"></div>
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted hidden md:block"></div>
            <div className="h-9 w-9 animate-pulse rounded-md bg-muted md:hidden"></div>
          </div>
        </div>
      </header>
    );
  }

  const currentThemeIcon =
    resolvedTheme === "dark" ? (
      <Sun size={20} className="transition-all" />
    ) : (
      <Moon size={20} className="transition-all" />
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xl md:text-2xl font-bold text-primary transition-opacity hover:opacity-80"
          onClick={closeMobileMenu}
        >
          <Flame size={28} className="text-primary" />
          <span>AnimeHub</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                ${
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
            >
              {ReactNav.cloneElement(item.icon, {
                className: "mr-1.5 h-4 w-4",
              })}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2 md:space-x-3">
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Toggle theme"
            type="button"
          >
            {currentThemeIcon}
            <span className="sr-only">Toggle theme</span>
          </button>

          {username ? (
            <div className="relative group">
              <button
                className="hidden md:flex items-center space-x-2 rounded-full p-1.5 pr-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="User menu"
              >
                <UserCircle size={24} />
                <span className="hidden lg:inline">{username}</span>
              </button>

              <div
                className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-popover text-popover-foreground shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
                              hidden group-hover:block group-focus-within:block py-1 transition-all duration-75 ease-out" // Show on hover/focus
              >
                <Link
                  href="/profile"
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-muted"
                  onClick={closeMobileMenu}
                >
                  <UserCircle
                    size={16}
                    className="mr-2 text-muted-foreground"
                  />
                  Profile
                </Link>
                <Link
                  href="/profile/watchlist"
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-muted"
                  onClick={closeMobileMenu}
                >
                  <ListVideo size={16} className="mr-2 text-muted-foreground" />
                  Watchlist
                </Link>
                <Link
                  href="/profile/history"
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-muted"
                  onClick={closeMobileMenu}
                >
                  <History size={16} className="mr-2 text-muted-foreground" />
                  History
                </Link>
                <div className="my-1 h-px bg-border" />
                <Link
                  href="/profile/settings"
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-muted"
                  onClick={closeMobileMenu}
                >
                  <Settings size={16} className="mr-2 text-muted-foreground" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:flex items-center space-x-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          )}
          <button
            onClick={toggleMobileMenu}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-border/60 bg-background md:hidden"
        >
          <nav className="flex flex-col space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={`mobile-${item.href}`}
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors
                  ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                onClick={closeMobileMenu}
              >
                {ReactNav.cloneElement(item.icon, {
                  className: "mr-3 h-5 w-5",
                })}
                <span>{item.label}</span>
              </Link>
            ))}
            <hr className="my-2 border-border/60" />
            {username ? (
              <>
                <div className="px-3 py-2 text-sm font-medium text-foreground">
                  Welcome, {username}!
                </div>
                <Link
                  href="/profile"
                  className="flex items-center rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  onClick={closeMobileMenu}
                >
                  <UserCircle size={20} className="mr-3" />
                  Profile
                </Link>
                <Link
                  href="/profile/watchlist"
                  className="flex items-center rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  onClick={closeMobileMenu}
                >
                  <ListVideo size={20} className="mr-3" />
                  Watchlist
                </Link>
                <Link
                  href="/profile/history"
                  className="flex items-center rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  onClick={closeMobileMenu}
                >
                  <History size={20} className="mr-3" />
                  History
                </Link>
                <Link
                  href="/profile/settings"
                  className="flex items-center rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  onClick={closeMobileMenu}
                >
                  <Settings size={20} className="mr-3" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center rounded-md px-3 py-2 text-left text-base font-medium text-destructive hover:bg-destructive/10"
                >
                  <LogOut size={20} className="mr-3" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  onClick={closeMobileMenu}
                >
                  <LogIn size={20} className="mr-3" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  onClick={closeMobileMenu}
                >
                  <UserPlus size={20} className="mr-3" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
