// Маппінг між API region IDs (alerts.com.ua) та проектними region IDs
// API повертає числові ID, проект використовує рядкові ідентифікатори

export const API_TO_PROJECT_REGION: Record<number, string> = {
  1: "vinnytsia",       // Вінницька область
  2: "volyn",           // Волинська область
  3: "dnipro",          // Дніпропетровська область
  4: "donetsk",         // Донецька область
  5: "zhytomyr",        // Житомирська область
  6: "zakarpattia",     // Закарпатська область
  7: "zaporizhzhia",    // Запорізька область
  8: "ivano-frankivsk", // Івано-Франківська область
  9: "kyiv-oblast",     // Київська область
  10: "kirovohrad",     // Кіровоградська область
  11: "luhansk",        // Луганська область
  12: "lviv",           // Львівська область
  13: "mykolaiv",       // Миколаївська область
  14: "odesa",          // Одеська область
  15: "poltava",        // Полтавська область
  16: "rivne",          // Рівненська область
  17: "sumy",           // Сумська область
  18: "ternopil",       // Тернопільська область
  19: "kharkiv",        // Харківська область
  20: "kherson",        // Херсонська область
  21: "khmelnytskyi",   // Хмельницька область
  22: "cherkasy",       // Черкаська область
  23: "chernivtsi",     // Чернівецька область
  24: "chernihiv",      // Чернігівська область
  25: "kyiv-city",      // м. Київ
};

// Зворотний маппінг: проектний ID → API ID
export const PROJECT_TO_API_REGION: Record<string, number> = Object.fromEntries(
  Object.entries(API_TO_PROJECT_REGION).map(([apiId, projectId]) => [projectId, Number(apiId)])
);

// Регіони, які є в проекті, але відсутні в API
export const REGIONS_WITHOUT_API: string[] = ["crimea", "sevastopol"];

// Конвертація API region ID в проектний ID
export function apiToProjectRegionId(apiId: number): string | null {
  return API_TO_PROJECT_REGION[apiId] ?? null;
}

// Конвертація проектного ID в API region ID
export function projectToApiRegionId(projectId: string): number | null {
  return PROJECT_TO_API_REGION[projectId] ?? null;
}
