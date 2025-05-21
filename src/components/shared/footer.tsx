// src/components/shared/footer.tsx
import LinkFooter from "next/link";
import { Github, Twitter, Copyright, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 py-10 text-sm text-muted-foreground sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-16">
          <div>
            <h3 className="mb-4 text-base font-semibold text-foreground">
              AnimeHub
            </h3>
            <p className="leading-relaxed">
              Your ultimate destination for discovering and watching anime.
              Built with{" "}
              <Heart size={14} className="inline-block text-red-500 mx-0.5" />
              and Next.js.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <LinkFooter
                  href="/anime/discover"  
                  className="transition-colors hover:text-primary hover:underline"
                >
                  Discover Anime
                </LinkFooter>
              </li>
              <li>
                <LinkFooter
                  href="/calendar"
                  className="transition-colors hover:text-primary hover:underline"
                >
                  Airing Calendar
                </LinkFooter>
              </li>
              <li>
                <LinkFooter
                  href="/about"
                  className="transition-colors hover:text-primary hover:underline"
                >
                  About Us
                </LinkFooter>
              </li>
              <li>
                <LinkFooter
                  href="/privacy"
                  className="transition-colors hover:text-primary hover:underline"
                >
                  Privacy Policy
                </LinkFooter>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold text-foreground">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/your-repo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Github size={22} />
              </a>
              <a
                href="https://twitter.com/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Twitter size={22} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright and Disclaimer */}
        <div className="mt-10 border-t border-border/70 pt-8 text-center text-xs text-muted-foreground/80">
          <div className="flex flex-col items-center justify-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-1.5">
            <span className="flex items-center">
              <Copyright size={14} className="mr-1" />{" "}
              {new Date().getFullYear()} AnimeHub. All rights reserved.
            </span>
            <span className="hidden sm:inline">·</span>
            <span>This site is for educational purposes only.</span>
          </div>
          <p className="mt-3">
            Anime data sourced from various public APIs. We do not host any
            files.
          </p>
        </div>
      </div>
    </footer>
  );
}
