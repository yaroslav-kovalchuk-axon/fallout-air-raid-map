export interface Region {
  id: string;
  nameUa: string;
  nameEn: string;
  position: "left" | "right";
}

export type AlertType = "air_raid" | "uav" | "missile" | "artillery" | "chemical";

export interface AlertState {
  regionId: string;
  isActive: boolean;
  alertType: AlertType;
  startTime: Date | null;
}

export type MessageType = "alert_start" | "alert_end" | "uav_detected" | "missile_detected" | "info";

export interface AlertMessage {
  id: string;
  timestamp: Date;
  regionId: string;
  regionName: string;
  type: MessageType;
  message: string;
}

export interface AppState {
  alerts: Map<string, AlertState>;
  messages: AlertMessage[];
  globalAlertActive: boolean;
}
