// src/app/login/page.tsx
"use client";

import { useState as useStateLogin, useEffect as useEffectLogin } from "react";
import { useRouter } from "next/navigation";
import { LogIn, User, Lock, Loader2 } from "lucide-react";
import LinkLogin from "next/link";
import PageTitle from "@/components/shared/PageTitle";
import { toast } from "@/components/shared/Toaster";
import { useUserStore } from "@/stores/userStore";

export default function LoginPage() {
  const router = useRouter();
  const { username, setUsername } = useUserStore();
  const [inputUsername, setInputUsername] = useStateLogin("");
  const [password, setPassword] = useStateLogin("");
  const [isLoading, setIsLoading] = useStateLogin(false);
  const [isClient, setIsClient] = useStateLogin(false);

  useEffectLogin(() => {
    setIsClient(true);
  }, []);

  useEffectLogin(() => {
    if (isClient && username) {
      router.push("/profile");
    }
  }, [username, router, isClient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUsername.trim()) {
      toast.error("Please enter a username.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setUsername(inputUsername.trim());
      toast.success(`Welcome back, ${inputUsername.trim()}!`);
      router.push("/profile");
    }, 700);
  };
  if (!isClient) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
        <p className="mt-3 text-text-muted-light dark:text-text-muted-dark">
          Loading login page...
        </p>
      </div>
    );
  }
  if (username) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
        <p className="mt-3 text-text-muted-light dark:text-text-muted-dark">
          Already logged in. Redirecting to profile...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <PageTitle
        title="Login to Your Account"
        subtitle="Access your watchlist, history, and comments."
      />
      <div className="card-bg p-6 md:p-8 rounded-lg shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-text-primary-light dark:text-text-primary-dark"
            >
              Username
            </label>
            <div className="mt-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                className="input-field pl-10"
                placeholder="your_awesome_username"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-text-primary-light dark:text-text-primary-dark"
              >
                Password
              </label>
              <div className="text-xs">
                <LinkLogin
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info(
                      "Password recovery is not implemented in this demo."
                    );
                  }}
                  className="font-medium text-brand-primary hover:text-brand-primary/80"
                >
                  Forgot password?
                </LinkLogin>
              </div>
            </div>
            <div className="mt-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="•••••••• (any password for demo)"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary py-2.5 text-base flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : (
                <LogIn className="h-5 w-5 mr-2" />
              )}
              {isLoading ? "Logging in..." : "Sign in"}
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
          Don't have an account?{" "}
          <LinkLogin
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toast.info(
                "Account registration is not implemented in this demo."
              );
            }}
            className="font-semibold leading-6 text-brand-primary hover:text-brand-primary/80"
          >
            Create an account (Demo)
          </LinkLogin>
        </p>
      </div>
    </div>
  );
}
