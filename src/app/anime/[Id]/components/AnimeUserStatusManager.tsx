"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/stores/userStore";
import { AnilistMedia, UserAnimeStatus } from "@/@types/types";
import {
  Eye,
  Clock3,
  Archive,
  CheckCircle2,
  XCircle,
  Trash2,
  ChevronDown,
  PlusCircle,
  LucideIcon,
} from "lucide-react";

interface AnimeUserStatusManagerProps {
  anime: AnilistMedia;
  className?: string;
}

interface StatusOption {
  value: UserAnimeStatus | null;
  label: string;
  icon: LucideIcon;
  description?: string;
  baseColorClass?: string;
  hoverColorClass?: string;
  textColorClass?: string;
  darkBaseColorClass?: string;
  darkHoverColorClass?: string;
  darkTextColorClass?: string;
}

const statusOptionsList: StatusOption[] = [
  {
    value: "WATCHING",
    label: "Смотрю",
    icon: Eye,
    description: "Начал или продолжаю смотреть",
    baseColorClass: "bg-blue-500",
    hoverColorClass: "hover:bg-blue-600",
    textColorClass: "text-white",
    darkBaseColorClass: "dark:bg-blue-600",
    darkHoverColorClass: "dark:hover:bg-blue-700",
    darkTextColorClass: "dark:text-blue-100",
  },
  {
    value: "PLANNING",
    label: "Планирую",
    icon: Clock3,
    description: "Скоро буду смотреть",
    baseColorClass: "bg-sky-500",
    hoverColorClass: "hover:bg-sky-600",
    textColorClass: "text-white",
    darkBaseColorClass: "dark:bg-sky-600",
    darkHoverColorClass: "dark:hover:bg-sky-700",
    darkTextColorClass: "dark:text-sky-100",
  },
  {
    value: "ON_HOLD",
    label: "Отложено",
    icon: Archive,
    description: "Отложил на потом",
    baseColorClass: "bg-amber-500",
    hoverColorClass: "hover:bg-amber-600",
    textColorClass: "text-white",
    darkBaseColorClass: "dark:bg-amber-600",
    darkHoverColorClass: "dark:hover:bg-amber-700",
    darkTextColorClass: "dark:text-amber-100",
  },
  {
    value: "COMPLETED",
    label: "Просмотрено",
    icon: CheckCircle2,
    description: "Полностью посмотрел",
    baseColorClass: "bg-emerald-500",
    hoverColorClass: "hover:bg-emerald-600",
    textColorClass: "text-white",
    darkBaseColorClass: "dark:bg-emerald-600",
    darkHoverColorClass: "dark:hover:bg-emerald-700",
    darkTextColorClass: "dark:text-emerald-100",
  },
  {
    value: "DROPPED",
    label: "Брошено",
    icon: XCircle,
    description: "Перестал смотреть",
    baseColorClass: "bg-rose-500",
    hoverColorClass: "hover:bg-rose-600",
    textColorClass: "text-white",
    darkBaseColorClass: "dark:bg-rose-600",
    darkHoverColorClass: "dark:hover:bg-rose-700",
    darkTextColorClass: "dark:text-rose-100",
  },
  {
    value: null,
    label: "Удалить из списка",
    icon: Trash2,
    description: "Убрать статус и из списков",
    baseColorClass: "bg-slate-500",
    hoverColorClass: "hover:bg-slate-600",
    textColorClass: "text-white",
    darkBaseColorClass: "dark:bg-slate-600",
    darkHoverColorClass: "dark:hover:bg-slate-700",
    darkTextColorClass: "dark:text-slate-100",
  },
];

const defaultButtonOption: StatusOption = {
  value: null,
  label: "Добавить в список",
  icon: PlusCircle,
  baseColorClass: "bg-indigo-500",
  hoverColorClass: "hover:bg-indigo-600",
  textColorClass: "text-white",
  darkBaseColorClass: "dark:bg-indigo-600",
  darkHoverColorClass: "dark:hover:bg-indigo-700",
  darkTextColorClass: "dark:text-indigo-100",
};

export default function AnimeUserStatusManager({
  anime,
  className,
}: AnimeUserStatusManagerProps) {
  const {
    username,
    getAnimeListStatus: storeGetAnimeListStatus,
    updateAnimeListStatus: storeUpdateAnimeListStatus,
  } = useUserStore();

  const [currentStatus, setCurrentStatus] = useState<UserAnimeStatus | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (username && anime?.id) {
      const status = storeGetAnimeListStatus(anime.id);
      setCurrentStatus(status);
    } else {
      setCurrentStatus(null);
    }
  }, [anime?.id, storeGetAnimeListStatus, username, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectStatus = (status: UserAnimeStatus | null) => {
    if (!username) {
      alert("Пожалуйста, войдите в систему, чтобы изменить статус просмотра.");
      setIsOpen(false);
      return;
    }
    if (!anime || !anime.id) {
      setIsOpen(false);
      return;
    }

    storeUpdateAnimeListStatus(status, anime);
    setCurrentStatus(status);
    setIsOpen(false);
  };

  if (!anime || !anime.id) return null;

  const activeOptionDetails =
    statusOptionsList.find((opt) => opt.value === currentStatus) ||
    defaultButtonOption;

  const ButtonIcon = activeOptionDetails.icon;
  const buttonLabel = activeOptionDetails.label;

  const buttonClasses = `
    w-full inline-flex justify-center items-center px-4 py-2 border border-transparent
    text-sm font-medium rounded-md shadow-sm focus:outline-none
    focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800
    transition-colors duration-150 ease-in-out
    ${activeOptionDetails.baseColorClass}
    ${activeOptionDetails.hoverColorClass}
    ${activeOptionDetails.textColorClass}
    ${activeOptionDetails.darkBaseColorClass}
    ${activeOptionDetails.darkHoverColorClass}
    ${activeOptionDetails.darkTextColorClass}
    focus:ring-current
  `;

  const dropdownItemBaseClasses =
    "group flex items-center w-full px-4 py-2.5 text-sm transition-colors duration-150";
  const dropdownItemTextClasses =
    "text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white";
  const dropdownItemBgClasses = "hover:bg-gray-100 dark:hover:bg-gray-700";
  const dropdownItemSelectedTextClasses =
    "font-semibold text-indigo-600 dark:text-indigo-400";
  const dropdownItemSelectedBgClasses = "bg-gray-100 dark:bg-gray-700";

  return (
    <div
      className={`relative inline-block text-left ${className || ""}`}
      ref={dropdownRef}
    >
      <div>
        <button
          type="button"
          className={buttonClasses}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <ButtonIcon size={18} className="mr-2 flex-shrink-0" />
          <span className="truncate">{buttonLabel}</span>
          <ChevronDown
            size={18}
            className={`ml-2 -mr-1 flex-shrink-0 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none z-20"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {statusOptionsList.map((option) => (
              <button
                key={option.label}
                onClick={() => handleSelectStatus(option.value)}
                className={`
                  ${dropdownItemBaseClasses}
                  ${
                    option.value === currentStatus
                      ? `${dropdownItemSelectedBgClasses} ${dropdownItemSelectedTextClasses}`
                      : `${dropdownItemBgClasses} ${dropdownItemTextClasses}`
                  }
                `}
                role="menuitem"
                title={option.description}
              >
                <option.icon
                  size={16}
                  className={`mr-3 flex-shrink-0 ${
                    option.value === currentStatus
                      ? "text-indigo-500 dark:text-indigo-400"
                      : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                  }`}
                />
                <span className="flex-grow text-left">{option.label}</span>
                {option.value === currentStatus && option.value !== null && (
                  <CheckCircle2
                    size={16}
                    className="ml-auto text-indigo-500 dark:text-indigo-400 flex-shrink-0"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
