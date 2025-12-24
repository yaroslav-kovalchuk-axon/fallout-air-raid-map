"use client";

import { AlertMessage } from "@/types";
import { formatTimestamp } from "@/data/mockMessages";

interface MessageLogProps {
  messages: AlertMessage[];
}

export default function MessageLog({ messages }: MessageLogProps) {
  return (
    <div className="flex-1 overflow-auto message-log font-[family-name:var(--font-pipboy)]">
      <div className="space-y-1">
        {messages.map((msg) => (
          <div key={msg.id} className="message-log-entry">
            <span className="message-log-timestamp">
              [{formatTimestamp(msg.timestamp)}]
            </span>{" "}
            <span
              className={
                msg.type === "alert_start" || msg.type === "missile_detected"
                  ? "glow-text-red"
                  : msg.type === "alert_end"
                  ? "glow-text-bright"
                  : "glow-text"
              }
            >
              {msg.regionName}
            </span>{" "}
            <span className="glow-text">{msg.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
