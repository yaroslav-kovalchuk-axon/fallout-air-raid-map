import PipBoyFrame from "@/components/layout/PipBoyFrame";
import AlertStatus from "@/components/info/AlertStatus";
import BatteryStatus from "@/components/info/BatteryStatus";
import MessageLog from "@/components/info/MessageLog";
import TimelineBar from "@/components/info/TimelineBar";
import { MOCK_MESSAGES } from "@/data/mockMessages";
import { countActiveAlerts } from "@/data/mockAlerts";

export default function InfoPage() {
  const alertCount = countActiveAlerts();
  const isAlertActive = alertCount > 0;

  // Sort messages by timestamp (newest first for display)
  const sortedMessages = [...MOCK_MESSAGES].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <PipBoyFrame activeTab="info">
      <div className="flex flex-col h-full">
        <AlertStatus isActive={isAlertActive} alertCount={alertCount} />
        <BatteryStatus />
        <MessageLog messages={sortedMessages} />
        <TimelineBar />
      </div>
    </PipBoyFrame>
  );
}
