"use client";

import Link from "next/link";
import { useState, useEffect, useSyncExternalStore } from "react";
import { formatTime, formatDate, getWarDay } from "@/utils/dateFormatting";

interface HeaderProps {
  activeTab: "info" | "map";
  alertCount?: number;
}

// Custom hook for client-side time with hydration safety
function useClientTime() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Trigger first update immediately via setTimeout (linter-compliant)
    const initialTimer = setTimeout(() => setTime(new Date()), 0);
    // Continue updating every second
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, []);

  return time;
}

// Hydration hook using useSyncExternalStore (linter-compliant)
const emptySubscribe = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function Header({ activeTab, alertCount = 0 }: HeaderProps) {
  const time = useClientTime();
  const isHydrated = useHydrated();
  const warDay = isHydrated ? getWarDay() : 0;

  return (
    <header className="border-b border-[var(--pipboy-green-dark)] px-4 py-3 md:px-6">
      {/* Top row: Logo and Navigation */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Animated radiation symbol */}
          <div className="radiation-symbol">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 fill-current md:h-8 md:w-8"
            >
              <path d="M12 2C12.5523 2 13 2.44772 13 3V6.26756C14.6304 6.61337 16.0486 7.52316 17.0208 8.79289L19.7942 6.73205C20.2431 6.38792 20.8713 6.47157 21.2154 6.92044C21.5595 7.36931 21.4759 7.99754 21.027 8.34167L18.2678 10.3915C18.7366 11.1855 19 12.1074 19 13.0833C19 13.5523 18.9485 14.0087 18.8516 14.4472L22.0981 15.5279C22.6195 15.7013 22.9032 16.2617 22.7298 16.7831C22.5564 17.3045 21.996 17.5882 21.4746 17.4148L18.2426 16.3394C17.2639 17.9446 15.5728 19.0833 13.6009 19.3894L14.2361 22.5279C14.3489 23.0663 14.0013 23.5898 13.4629 23.7026C12.9246 23.8154 12.4011 23.4678 12.2883 22.9295L11.6568 19.8083C11.4405 19.8193 11.2215 19.825 11 19.825C10.7785 19.825 10.5595 19.8193 10.3432 19.8083L9.71175 22.9295C9.59895 23.4678 9.07546 23.8154 8.53711 23.7026C7.99877 23.5898 7.65118 23.0663 7.76398 22.5279L8.39912 19.3894C6.42717 19.0833 4.73611 17.9446 3.75736 16.3394L0.525398 17.4148C0.00399399 17.5882 -0.556355 17.3045 -0.729767 16.7831C-0.903178 16.2617 -0.619476 15.7013 -0.0980759 15.5279L3.14838 14.4472C3.0515 14.0087 3 13.5523 3 13.0833C3 12.1074 3.26344 11.1855 3.73223 10.3915L0.97298 8.34167C0.524112 7.99754 0.440461 7.36931 0.784589 6.92044C1.12872 6.47157 1.75695 6.38792 2.20582 6.73205L4.97924 8.79289C5.95138 7.52316 7.36958 6.61337 9 6.26756V3C9 2.44772 9.44772 2 10 2H12ZM11 9C8.79086 9 7 10.7909 7 13C7 15.2091 8.79086 17 11 17C13.2091 17 15 15.2091 15 13C15 10.7909 13.2091 9 11 9Z" />
            </svg>
          </div>
          <h1 className="glow-text-bright font-[family-name:var(--font-pipboy)] text-xl tracking-wider md:text-2xl">
            VAULT-TEC UA
          </h1>
        </div>

        <nav className="flex gap-4 font-[family-name:var(--font-pipboy)] text-base md:gap-6 md:text-lg">
          <Link
            href="/info"
            className={`nav-tab ${activeTab === "info" ? "nav-tab-active" : ""}`}
          >
            INFO
          </Link>
          <Link
            href="/map"
            className={`nav-tab ${activeTab === "map" ? "nav-tab-active" : ""}`}
          >
            MAP
          </Link>
        </nav>
      </div>

      {/* Bottom row: Clock, Date, War Day, Alert Counter */}
      <div className="flex items-center justify-between font-[family-name:var(--font-pipboy)] text-xs md:text-sm">
        <div className="flex items-center gap-4 md:gap-6">
          {/* Live Clock */}
          <div className="flex items-center gap-2">
            <span className="glow-text opacity-70">TIME:</span>
            <span className="glow-text-bright min-w-[70px] font-mono tracking-widest">
              {time ? formatTime(time) : "--:--:--"}
            </span>
          </div>

          {/* Date */}
          <div className="hidden items-center gap-2 sm:flex">
            <span className="glow-text opacity-70">DATE:</span>
            <span className="glow-text">
              {time ? formatDate(time) : "--.--.----"}
            </span>
          </div>

          {/* War Day Counter */}
          <div className="hidden items-center gap-2 md:flex">
            <span className="glow-text-red opacity-70">WAR DAY:</span>
            <span className="glow-text-red-bright war-day-counter">
              {warDay || "---"}
            </span>
          </div>
        </div>

        {/* Alert Counter */}
        {alertCount > 0 && (
          <div className="alert-counter flex items-center gap-2">
            <div className="alert-indicator" />
            <span className="glow-text-red-bright">
              {alertCount} {alertCount === 1 ? "REGION" : "REGIONS"} UNDER ALERT
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
