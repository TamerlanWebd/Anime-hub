// src/app/profile/settings/page.tsx
"use client";

import { toast } from "@/components/shared/Toaster";
import { useUserStore } from "@/stores/userStore";
import { Settings, User, Palette, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { username, setUsername: setStoreUsername } = useUserStore();
  const [currentUsername, setCurrentUsername] = useState(() => username || "");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (username !== currentUsername) {
      setCurrentUsername(username || "");
    }
  }, [username]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUsername(e.target.value);
  };

  const saveUsername = () => {
    if (currentUsername.trim()) {
      setStoreUsername(currentUsername.trim());
      toast.success("Username updated successfully!");
    } else {
      toast.error("Username cannot be empty.");
    }
  };

  if (!mounted) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-1 flex items-center">
          <Settings size={24} className="mr-2 text-brand-secondary" /> Account
          Settings
        </h2>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1 flex items-center">
        <Settings size={24} className="mr-2 text-brand-secondary" /> Account
        Settings
      </h2>
      <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
        Manage your account preferences and site settings.
      </p>

      <div className="space-y-8">
        <section>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <User size={20} className="mr-2" /> Profile Information
          </h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={currentUsername}
                onChange={handleUsernameChange}
                className="input-field mt-1"
                placeholder="Enter your username"
              />
            </div>
            <button
              onClick={saveUsername}
              className={`
    inline-flex items-center justify-center px-4 py-2 border border-transparent
    text-sm font-medium rounded-md shadow-sm text-white
    bg-indigo-600 hover:bg-indigo-700
    dark:bg-indigo-500 dark:hover:bg-indigo-600
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
    dark:focus:ring-offset-gray-800
    transition-colors duration-150 ease-in-out
  `}
            >
              Save Username
            </button>
          </div>
        </section>
        <section>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Palette size={20} className="mr-2" /> Appearance
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Theme Preference
            </p>
            <div className="flex space-x-3">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`btn btn-outline text-sm px-3 py-1.5 capitalize
                    ${
                      theme === t ||
                      (theme === "system" && t === "system") ||
                      (!theme && t === "system" && resolvedTheme)
                        ? "border-brand-primary text-brand-primary ring-2 ring-brand-primary"
                        : ""
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>
        <section>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Bell size={20} className="mr-2" /> Notifications
          </h3>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Notification settings are not yet available.
          </p>
        </section>
      </div>
    </div>
  );
}
