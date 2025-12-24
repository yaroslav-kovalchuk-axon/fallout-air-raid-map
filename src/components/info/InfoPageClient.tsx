"use client";

import AlertStatus from "@/components/info/AlertStatus";
import StatisticsPanel from "@/components/info/StatisticsPanel";
import MessageLog from "@/components/info/MessageLog";
import TimelineBar from "@/components/info/TimelineBar";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { DataSourceIndicator } from "@/components/common/DataSourceIndicator";
import { useAlerts } from "@/hooks/useAlerts";
import { useAlertHistory } from "@/hooks/useAlertHistory";

export default function InfoPageClient() {
  const {
    alertCount,
    isLoading: alertsLoading,
    source: alertsSource,
  } = useAlerts();
  const {
    messages,
    isLoading: historyLoading,
    source: historySource,
  } = useAlertHistory();
  const isAlertActive = alertCount > 0;

  // Use history source when available, fallback to alerts
  const source = historySource || alertsSource;

  if (alertsLoading || historyLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="loading-container">
          <div className="loading-spinner" />
          <span className="glow-text mt-4 font-[family-name:var(--font-pipboy)] text-lg">
            ЗАВАНТАЖЕННЯ ДАНИХ...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in relative flex h-full flex-col">
      {/* Data source indicator - absolute position */}
      <div className="absolute top-0 right-0 z-10">
        <div className="flex items-center gap-2 font-[family-name:var(--font-pipboy)] text-xs">
          <DataSourceIndicator source={source} />
        </div>
      </div>

      <ErrorBoundary>
        {/* Alert status */}
        <AlertStatus isActive={isAlertActive} alertCount={alertCount} />

        <StatisticsPanel messages={messages} alertCount={alertCount} />
        <MessageLog messages={messages} />
        <TimelineBar messages={messages} />
      </ErrorBoundary>
    </div>
  );
}
