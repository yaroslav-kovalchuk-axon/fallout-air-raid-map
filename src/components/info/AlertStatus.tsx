"use client";

interface AlertStatusProps {
  isActive: boolean;
  alertCount: number;
}

export default function AlertStatus({ isActive, alertCount }: AlertStatusProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`status-dot ${isActive ? "status-dot-alert" : ""}`} />
      <span
        className={`text-lg md:text-xl font-[family-name:var(--font-pipboy)] tracking-wide ${
          isActive ? "glow-text-red-bright" : "glow-text"
        }`}
      >
        {isActive ? "AIR RAID ALERT" : "ALL CLEAR"}
      </span>
      {isActive && (
        <span className="text-sm glow-text-red ml-2">
          ({alertCount} областей)
        </span>
      )}
    </div>
  );
}
