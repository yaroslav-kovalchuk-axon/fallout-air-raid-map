import { apiToProjectRegionId } from "@/data/regionMapping";

const API_BASE_URL = process.env.ALERTS_API_URL || "https://alerts.com.ua";
const API_KEY = process.env.ALERTS_API_KEY || "";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Якщо немає API ключа, повертаємо помилку
  if (!API_KEY) {
    return new Response(
      JSON.stringify({ error: "API key not configured" }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Підключаємося до SSE ендпоінту API
        const response = await fetch(`${API_BASE_URL}/api/states/live`, {
          headers: {
            "X-API-Key": API_KEY,
            Accept: "text/event-stream",
          },
        });

        if (!response.ok) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "Failed to connect to API" })}\n\n`)
          );
          controller.close();
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        // Читаємо SSE потік
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Парсимо SSE події
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const eventData = JSON.parse(line.slice(6));

                // Трансформуємо дані
                const projectRegionId = apiToProjectRegionId(eventData.id);
                if (projectRegionId) {
                  const transformedEvent = {
                    regionId: projectRegionId,
                    isActive: eventData.alert,
                    alertType: "air_raid",
                    startTime: eventData.changed || new Date().toISOString(),
                  };

                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(transformedEvent)}\n\n`)
                  );
                }
              } catch {
                // Пропускаємо невалідні дані
              }
            } else if (line.startsWith(":")) {
              // Heartbeat/comment - пересилаємо як є
              controller.enqueue(encoder.encode(`${line}\n`));
            }
          }
        }

        controller.close();
      } catch (error) {
        console.error("SSE stream error:", error);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
