import { AlertMessage } from "@/types";

// Generate realistic timestamps for the last hour
function getRecentTime(minutesAgo: number): Date {
  const now = new Date();
  return new Date(now.getTime() - minutesAgo * 60 * 1000);
}

export const MOCK_MESSAGES: AlertMessage[] = [
  {
    id: "1",
    timestamp: getRecentTime(58),
    regionId: "odesa",
    regionName: "Одеса",
    type: "uav_detected",
    message: "2х БПЛА в акваторії чорного моря без чіткого курсу. По інших областях чисто.",
  },
  {
    id: "2",
    timestamp: getRecentTime(52),
    regionId: "odesa",
    regionName: "Одеса",
    type: "uav_detected",
    message: "2х БПЛА в акваторії чорного моря без чіткого курсу. По інших областях чисто.",
  },
  {
    id: "3",
    timestamp: getRecentTime(45),
    regionId: "odesa",
    regionName: "Одеса",
    type: "info",
    message: "5х БПЛА продовжують рухатись в акваторії ЧМ, поки без наближення до узбережжя.",
  },
  {
    id: "4",
    timestamp: getRecentTime(38),
    regionId: "poltava",
    regionName: "Павлоград",
    type: "uav_detected",
    message: "3х БПЛА у напрямку міста зі сходу.",
  },
  {
    id: "5",
    timestamp: getRecentTime(35),
    regionId: "odesa",
    regionName: "Одещина",
    type: "alert_start",
    message: "Півдeнне. Одещина 1х БПЛА.",
  },
  {
    id: "6",
    timestamp: getRecentTime(28),
    regionId: "odesa",
    regionName: "Одеса",
    type: "uav_detected",
    message: "1х БПЛА на місто",
  },
  {
    id: "7",
    timestamp: getRecentTime(22),
    regionId: "odesa",
    regionName: "Одеса",
    type: "alert_end",
    message: "Одеса чисто тимчасово.",
  },
  {
    id: "8",
    timestamp: getRecentTime(15),
    regionId: "chernihiv",
    regionName: "Чернігівщина",
    type: "uav_detected",
    message: "2х БПЛА через Чернігівський район у напрямку Київщини. 1х через Корюківський район.",
  },
  {
    id: "9",
    timestamp: getRecentTime(10),
    regionId: "odesa",
    regionName: "Одеса",
    type: "uav_detected",
    message: "1х БПЛА у напрямку порт/Лузанівка.",
  },
  {
    id: "10",
    timestamp: getRecentTime(5),
    regionId: "odesa",
    regionName: "Одеса",
    type: "info",
    message: "Два наступних БПЛА також у напрямку Одеса порт.",
  },
  {
    id: "11",
    timestamp: getRecentTime(2),
    regionId: "kyiv-city",
    regionName: "Київ",
    type: "missile_detected",
    message: "Загроза балістики! Всім в укриття!",
  },
  {
    id: "12",
    timestamp: getRecentTime(1),
    regionId: "kharkiv",
    regionName: "Харків",
    type: "alert_start",
    message: "ПОВІТРЯНА ТРИВОГА! Загроза удару КАБами.",
  },
];

export function getRecentMessages(count: number = 10): AlertMessage[] {
  return [...MOCK_MESSAGES]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, count);
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
