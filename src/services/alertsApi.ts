import { AlertState, AlertType } from "@/types";
import { apiToProjectRegionId } from "@/data/regionMapping";
import { MOCK_ALERTS } from "@/data/mockAlerts";

// API Response types
interface ApiRegionState {
  id: number;
  name: string;
  name_en: string;
  alert: boolean;
  changed: string; // ISO date string
}

interface ApiStatesResponse {
  states: ApiRegionState[];
  last_update: string;
}

// SSE Event types
interface ApiAlertEvent {
  id: number;
  name: string;
  alert: boolean;
  changed: string;
}

// Конфігурація API
const API_BASE_URL = process.env.ALERTS_API_URL || "https://alerts.com.ua";
const API_KEY = process.env.ALERTS_API_KEY || "";

// Визначення типу тривоги на основі API даних
// API alerts.com.ua не надає тип тривоги, тому за замовчуванням "air_raid"
function determineAlertType(): AlertType {
  return "air_raid";
}

// Трансформація API response в AlertState[]
export function transformApiResponse(apiStates: ApiRegionState[]): AlertState[] {
  const alerts: AlertState[] = [];

  for (const state of apiStates) {
    const projectRegionId = apiToProjectRegionId(state.id);
    if (!projectRegionId) continue;

    if (state.alert) {
      alerts.push({
        regionId: projectRegionId,
        isActive: true,
        alertType: determineAlertType(),
        startTime: state.changed ? new Date(state.changed) : new Date(),
      });
    }
  }

  return alerts;
}

// Отримання активних тривог через API
export async function fetchActiveAlerts(): Promise<AlertState[]> {
  if (!API_KEY) {
    console.warn("ALERTS_API_KEY not set, using mock data");
    return MOCK_ALERTS;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/states`, {
      headers: {
        "X-API-Key": API_KEY,
      },
      next: { revalidate: 30 }, // Кешування на 30 секунд
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: ApiStatesResponse = await response.json();
    return transformApiResponse(data.states);
  } catch (error) {
    console.error("Failed to fetch alerts from API:", error);
    return MOCK_ALERTS; // Fallback на mock дані
  }
}

// Отримання списку ID регіонів з активними тривогами
export async function fetchAlertedRegionIds(): Promise<string[]> {
  const alerts = await fetchActiveAlerts();
  return alerts.filter((a) => a.isActive).map((a) => a.regionId);
}

// Підрахунок активних тривог
export async function fetchActiveAlertCount(): Promise<number> {
  const alerts = await fetchActiveAlerts();
  return alerts.filter((a) => a.isActive).length;
}

// SSE Stream URL для клієнта
export function getSSEStreamUrl(): string {
  return "/api/alerts/stream";
}

// Парсинг SSE події
export function parseSSEEvent(eventData: string): AlertState | null {
  try {
    const event: ApiAlertEvent = JSON.parse(eventData);
    const projectRegionId = apiToProjectRegionId(event.id);

    if (!projectRegionId) return null;

    return {
      regionId: projectRegionId,
      isActive: event.alert,
      alertType: determineAlertType(),
      startTime: event.changed ? new Date(event.changed) : new Date(),
    };
  } catch {
    console.error("Failed to parse SSE event:", eventData);
    return null;
  }
}

// Перевірка доступності API
export async function checkApiHealth(): Promise<boolean> {
  if (!API_KEY) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/api/states`, {
      method: "HEAD",
      headers: {
        "X-API-Key": API_KEY,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}
