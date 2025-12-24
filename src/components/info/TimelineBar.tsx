"use client";

export default function TimelineBar() {
  // Generate time labels for the timeline (last 24 hours)
  const hours = [];
  for (let i = 0; i <= 24; i += 3) {
    hours.push(i.toString().padStart(2, "0") + ":00");
  }

  // Calculate current position (percentage of day passed)
  const now = new Date();
  const currentPosition = ((now.getHours() * 60 + now.getMinutes()) / (24 * 60)) * 100;

  return (
    <div className="mt-4 border-t border-[var(--pipboy-green-dark)] pt-3">
      <div className="relative">
        {/* Timeline bar */}
        <div className="timeline-bar rounded">
          {/* Current time marker */}
          <div
            className="timeline-marker"
            style={{ left: `${currentPosition}%` }}
          />
        </div>

        {/* Time labels */}
        <div className="flex justify-between mt-1 text-[10px] md:text-xs glow-text font-[family-name:var(--font-pipboy)]">
          {hours.map((hour) => (
            <span key={hour} className="opacity-70">
              {hour}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
