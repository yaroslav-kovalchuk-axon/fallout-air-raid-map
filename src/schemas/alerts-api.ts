import { z } from "zod";
import {
  API_ALERT_TYPES,
  LOCATION_TYPES,
  IOT_STATUSES,
  AlertIdSchema,
  LocationUidSchema,
  ISODateTimeSchema,
  NullableISODateTimeSchema,
} from "./common";

// === Типи alerts.in.ua API ===
export const ApiAlertTypeSchema = z.enum(API_ALERT_TYPES);
export type ApiAlertType = z.infer<typeof ApiAlertTypeSchema>;

export const LocationTypeSchema = z.enum(LOCATION_TYPES);
export type LocationType = z.infer<typeof LocationTypeSchema>;

// === Alert Schema (alerts.in.ua) ===
export const AlertsInUaAlertSchema = z.object({
  id: AlertIdSchema.describe("Унікальний ідентифікатор тривоги"),
  location_title: z.string().min(1).describe("Назва локації"),
  location_type: LocationTypeSchema.describe("Тип локації"),
  started_at: ISODateTimeSchema.describe("Час початку тривоги"),
  finished_at: NullableISODateTimeSchema.describe(
    "Час закінчення (null якщо активна)",
  ),
  updated_at: ISODateTimeSchema.optional().describe("Час оновлення в БД"),
  alert_type: ApiAlertTypeSchema.describe("Тип тривоги"),
  location_uid: LocationUidSchema.describe("UID локації"),
  location_oblast: z.string().min(1).optional().describe("Назва області"),
  location_oblast_uid: z.number().optional(),
  location_raion: z.string().nullable().optional().describe("Назва району"),
  notes: z.string().nullable().optional().describe("Додаткові примітки"),
  calculated: z
    .boolean()
    .nullable()
    .optional()
    .describe("Чи час закінчення розрахований"),
});

export type AlertsInUaAlert = z.infer<typeof AlertsInUaAlertSchema>;

// === Meta Schema ===
export const MetaSchema = z.object({
  last_updated_at: ISODateTimeSchema,
  type: z.string(),
});

export type Meta = z.infer<typeof MetaSchema>;

// === Active Alerts Response (/v1/alerts/active.json) ===
export const AlertsInUaActiveResponseSchema = z.object({
  alerts: z.array(AlertsInUaAlertSchema),
  meta: MetaSchema,
  disclaimer: z.string().optional(),
});

export type AlertsInUaActiveResponse = z.infer<
  typeof AlertsInUaActiveResponseSchema
>;

// === History Response (/v1/regions/{uid}/alerts/{period}.json) ===
export const AlertsInUaHistoryResponseSchema = z.object({
  alerts: z.array(AlertsInUaAlertSchema),
  meta: MetaSchema,
  disclaimer: z.string().optional(),
});

export type AlertsInUaHistoryResponse = z.infer<
  typeof AlertsInUaHistoryResponseSchema
>;

// === IoT Schemas ===
export const IoTAlertStatusSchema = z.enum(IOT_STATUSES);
export type IoTAlertStatus = z.infer<typeof IoTAlertStatusSchema>;

// /v1/iot/active_air_raid_alerts_by_oblast.json
export const IoTOblastAlertsSchema = z
  .string()
  .regex(/^[APN]+$/, "Invalid IoT format");

// /v1/iot/active_air_raid_alerts/{uid}.json
export const IoTRegionAlertSchema = IoTAlertStatusSchema;

// /v1/iot/active_air_raid_alerts.json
export const IoTFullMapSchema = z
  .string()
  .regex(/^[APN]+$/, "Invalid IoT format");

// === Error Schema ===
export const AlertsApiErrorSchema = z.object({
  message: z.string(),
});

export type AlertsApiError = z.infer<typeof AlertsApiErrorSchema>;
