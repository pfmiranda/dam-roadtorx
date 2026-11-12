import type { metricTypes } from "./types";

//definir as labels para cada métrica
export const METRIC_INFO = {
  distance: { label: "Distância", unit: "m", decimals: false },
  time: { label: "Tempo", unit: "min", decimals: false },
  calories: { label: "Calorias", unit: "kcal", decimals: false },
  weight: { label: "Carga", unit: "kg", decimals: true },
  reps: { label: "Repetições", unit: "reps", decimals: false },
} satisfies Record<metricTypes, { label: string; unit: string; decimals: boolean }>;

//definir ordem de métricas
export const METRIC_ORDER: metricTypes[] = ["distance", "time", "calories", "weight", "reps"];

//converter . em virgula para números decimais
export function formatNumber(value: number): string {
  return String(value).replace(".", ",");
}

//formatar tempo com 2 unidades para segundos e dividindo minutos de segundos
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

//fazer parse da duração em minutos e segundos se vierem definidos.
export function parseDuration(text: string | undefined): number | undefined {
  const [m = "", s = ""] = (text ?? "").split(":");
  const total = (Number(m) || 0) * 60 + (Number(s) || 0);
  return total > 0 ? total : undefined;
}

//converter segundos em texto com minutos/Segundos
export function durationToText(seconds: number | undefined): string {
  return seconds === undefined ? "" : formatDuration(seconds);
}

//parse dos numeros e volta a colocar o . para cálculos
export function parseNumber(text: string | undefined): number | undefined {
  const n = Number((text ?? "").replace(",", "."));
  return text && n > 0 ? n : undefined;
}
