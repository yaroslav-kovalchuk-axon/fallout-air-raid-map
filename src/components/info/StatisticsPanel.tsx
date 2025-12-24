"use client";

import { useMemo } from "react";
import {
  calculateTodayAlertPeriods,
  calculateAlertStats,
  formatAlertDuration,
  type AlertMessage,
} from "@/utils/alertPeriods";

interface StatisticsPanelProps {
  messages: AlertMessage[];
  alertCount: number;
}

interface Stats {
  totalAlertsToday: number;
  totalAlertTime: string;
  longestAlert: string;
  mostAlertedRegion: string | null;
  currentAlertDuration: string | null;
}

export default function StatisticsPanel({
  messages,
  alertCount,
}: StatisticsPanelProps) {
  const stats = useMemo<Stats>(() => {
    const periods = calculateTodayAlertPeriods(messages);
    const alertStats = calculateAlertStats(periods);

    return {
      totalAlertsToday: alertStats.totalAlerts,
      totalAlertTime: formatAlertDuration(alertStats.totalDurationMs),
      longestAlert: formatAlertDuration(alertStats.longestDurationMs),
      mostAlertedRegion: alertStats.mostAlertedRegion,
      currentAlertDuration: alertStats.currentAlertDurationMs
        ? formatAlertDuration(alertStats.currentAlertDurationMs)
        : null,
    };
  }, [messages]);

  return (
    <div className="stats-panel mb-4">
      <div className="stats-header mb-3">
        <span className="glow-text-bright font-[family-name:var(--font-pipboy)] text-sm tracking-wider opacity-70">
          ▸ STATISTICS
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {/* Alerts Today */}
        <div className="stat-card">
          <div className="stat-value">{stats.totalAlertsToday}</div>
          <div className="stat-label glow-text opacity-70">Тривог сьогодні</div>
        </div>

        {/* Total Alert Time */}
        <div className="stat-card">
          <div className="stat-value">{stats.totalAlertTime}</div>
          <div className="stat-label glow-text opacity-70">Загальний час</div>
        </div>

        {/* Longest Alert */}
        <div className="stat-card">
          <div className="stat-value">{stats.longestAlert}</div>
          <div className="stat-label glow-text opacity-70">
            Найдовша тривога
          </div>
        </div>

        {/* Current Duration or Most Alerted */}
        {stats.currentAlertDuration ? (
          <div className="stat-card stat-card-alert">
            <div className="stat-value">{stats.currentAlertDuration}</div>
            <div className="stat-label glow-text-red opacity-70">
              Поточна тривога
            </div>
          </div>
        ) : (
          <div className="stat-card">
            <div className="stat-value text-sm leading-tight">
              {stats.mostAlertedRegion || "—"}
            </div>
            <div className="stat-label glow-text opacity-70">Найчастіше</div>
          </div>
        )}
      </div>

      {/* Mini progress bars showing alert intensity */}
      <div className="mt-3 flex items-center gap-2">
        <span className="glow-text font-[family-name:var(--font-pipboy)] text-xs opacity-50">
          THREAT LEVEL:
        </span>
        <div className="h-2 flex-1 overflow-hidden rounded-sm border border-[var(--pipboy-green-dark)] bg-[var(--pipboy-dark)]">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${Math.min(alertCount * 4, 100)}%`,
              background:
                alertCount > 15
                  ? "var(--pipboy-alert-red)"
                  : alertCount > 8
                    ? "var(--pipboy-amber)"
                    : "var(--pipboy-green)",
            }}
          />
        </div>
        <span className="glow-text w-8 text-right font-[family-name:var(--font-pipboy)] text-xs opacity-50">
          {alertCount}/25
        </span>
      </div>
    </div>
  );
}
