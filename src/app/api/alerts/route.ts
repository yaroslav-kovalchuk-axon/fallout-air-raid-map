import { NextResponse } from "next/server";
import { apiToProjectRegionId } from "@/data/regionMapping";
import { MOCK_ALERTS } from "@/data/mockAlerts";

const API_BASE_URL = process.env.ALERTS_API_URL || "https://alerts.com.ua";
const API_KEY = process.env.ALERTS_API_KEY || "";

// Кешування відповіді
let cachedData: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 30 * 1000; // 30 секунд

export async function GET() {
  // Якщо немає API ключа, повертаємо mock дані
  if (!API_KEY) {
    return NextResponse.json({
      alerts: MOCK_ALERTS.map((alert) => ({
        regionId: alert.regionId,
        isActive: alert.isActive,
        alertType: alert.alertType,
        startTime: alert.startTime?.toISOString() || null,
      })),
      source: "mock",
      lastUpdate: new Date().toISOString(),
    });
  }

  // Перевірка кешу
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    return NextResponse.json(cachedData.data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/states`, {
      headers: {
        "X-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const apiData = await response.json();

    // Трансформація даних
    const alerts = apiData.states
      .filter((state: { alert: boolean }) => state.alert)
      .map((state: { id: number; changed: string }) => {
        const projectRegionId = apiToProjectRegionId(state.id);
        return {
          regionId: projectRegionId,
          isActive: true,
          alertType: "air_raid",
          startTime: state.changed || null,
        };
      })
      .filter((alert: { regionId: string | null }) => alert.regionId !== null);

    const responseData = {
      alerts,
      source: "api",
      lastUpdate: apiData.last_update || new Date().toISOString(),
    };

    // Оновлення кешу
    cachedData = {
      data: responseData,
      timestamp: Date.now(),
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Failed to fetch from alerts API:", error);

    // Fallback на mock дані
    return NextResponse.json({
      alerts: MOCK_ALERTS.map((alert) => ({
        regionId: alert.regionId,
        isActive: alert.isActive,
        alertType: alert.alertType,
        startTime: alert.startTime?.toISOString() || null,
      })),
      source: "mock",
      error: "API unavailable, using cached data",
      lastUpdate: new Date().toISOString(),
    });
  }
}
