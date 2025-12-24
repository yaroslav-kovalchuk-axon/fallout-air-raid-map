// Centralized alert period calculation utilities

export interface AlertMessage {
  id: string;
  timestamp: Date;
  regionId: string;
  regionName: string;
  type:
    | "alert_start"
    | "alert_end"
    | "uav_detected"
    | "missile_detected"
    | "info";
  message: string;
}

export interface AlertPeriod {
  startTime: Date;
  endTime: Date | null; // null means ongoing
  regionId: string;
  regionName: string;
  durationMs: number;
  isActive: boolean;
}

export interface TimelinePeriod {
  start: number; // percentage (0-100)
  end: number; // percentage (0-100)
  regionName: string;
  isActive: boolean;
}

/**
 * Calculate alert periods from messages
 * Matches alert_start with corresponding alert_end for the same region
 */
function calculateAlertPeriods(messages: AlertMessage[]): AlertPeriod[] {
  const now = new Date();
  const alertStarts = messages.filter((m) => m.type === "alert_start");
  const alertEnds = messages.filter((m) => m.type === "alert_end");

  return alertStarts.map((start) => {
    const startTime = new Date(start.timestamp);
    const matchingEnd = alertEnds.find(
      (end) =>
        end.regionName === start.regionName &&
        new Date(end.timestamp) > startTime,
    );

    const endTime = matchingEnd ? new Date(matchingEnd.timestamp) : null;
    const effectiveEndTime = endTime || now;
    const durationMs = effectiveEndTime.getTime() - startTime.getTime();

    return {
      startTime,
      endTime,
      regionId: start.regionId,
      regionName: start.regionName,
      durationMs,
      isActive: !matchingEnd,
    };
  });
}

/**
 * Filter messages to only include today's messages
 */
function filterTodayMessages(messages: AlertMessage[]): AlertMessage[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return messages.filter((m) => new Date(m.timestamp) >= todayStart);
}

/**
 * Calculate today's alert periods
 */
export function calculateTodayAlertPeriods(
  messages: AlertMessage[],
): AlertPeriod[] {
  const todayMessages = filterTodayMessages(messages);
  return calculateAlertPeriods(todayMessages);
}

/**
 * Convert alert periods to timeline format (percentages for 24h display)
 */
export function convertToTimelinePeriods(
  periods: AlertPeriod[],
): TimelinePeriod[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayMs = 24 * 60 * 60 * 1000;

  return periods.map((period) => {
    const startMs = period.startTime.getTime() - todayStart.getTime();
    const endMs = period.endTime
      ? period.endTime.getTime() - todayStart.getTime()
      : now.getTime() - todayStart.getTime();

    return {
      start: Math.max((startMs / dayMs) * 100, 0),
      end: Math.min((endMs / dayMs) * 100, 100),
      regionName: period.regionName,
      isActive: period.isActive,
    };
  });
}

/**
 * Calculate statistics from alert periods
 */
export interface AlertStats {
  totalAlerts: number;
  totalDurationMs: number;
  longestDurationMs: number;
  mostAlertedRegion: string | null;
  mostAlertedCount: number;
  activeAlerts: AlertPeriod[];
  currentAlertDurationMs: number | null;
}

export function calculateAlertStats(periods: AlertPeriod[]): AlertStats {
  let totalDurationMs = 0;
  let longestDurationMs = 0;
  const regionCounts: Record<string, number> = {};

  periods.forEach((period) => {
    totalDurationMs += period.durationMs;
    if (period.durationMs > longestDurationMs) {
      longestDurationMs = period.durationMs;
    }
    regionCounts[period.regionName] =
      (regionCounts[period.regionName] || 0) + 1;
  });

  // Find most alerted region
  let mostAlertedRegion: string | null = null;
  let mostAlertedCount = 0;
  Object.entries(regionCounts).forEach(([region, count]) => {
    if (count > mostAlertedCount) {
      mostAlertedCount = count;
      mostAlertedRegion = region;
    }
  });

  // Active alerts
  const activeAlerts = periods.filter((p) => p.isActive);

  // Current alert duration (earliest active alert)
  let currentAlertDurationMs: number | null = null;
  if (activeAlerts.length > 0) {
    const earliest = activeAlerts.reduce((min, alert) =>
      alert.startTime < min.startTime ? alert : min,
    );
    currentAlertDurationMs =
      new Date().getTime() - earliest.startTime.getTime();
  }

  return {
    totalAlerts: periods.length,
    totalDurationMs,
    longestDurationMs,
    mostAlertedRegion,
    mostAlertedCount,
    activeAlerts,
    currentAlertDurationMs,
  };
}

/**
 * Format duration in milliseconds to human-readable string
 */
export function formatAlertDuration(ms: number): string {
  const minutes = Math.round(ms / (1000 * 60));
  if (minutes < 60) {
    return `${minutes}хв`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}год ${remainingMinutes}хв`;
}
