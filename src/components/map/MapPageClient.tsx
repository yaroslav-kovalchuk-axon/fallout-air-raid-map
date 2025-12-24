"use client";

import UkraineMap from "@/components/map/UkraineMap";
import { useAlerts } from "@/hooks/useAlerts";

export default function MapPageClient() {
  const { alertedRegionIds, isLoading, source } = useAlerts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-lg font-[family-name:var(--font-pipboy)] glow-text animate-pulse">
          ЗАВАНТАЖЕННЯ ДАНИХ...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Data source indicator */}
      <div className="text-xs font-[family-name:var(--font-pipboy)] opacity-50 text-right mb-1">
        {source === "api" ? (
          <span className="glow-text">● LIVE</span>
        ) : (
          <span className="glow-text-red">● DEMO</span>
        )}
      </div>

      <UkraineMap alertedRegions={alertedRegionIds} />
    </div>
  );
}
