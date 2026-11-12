import { addDays } from "./dates";
import { formatDuration, formatNumber } from "./metrics";
import type { movement, workoutGoal, workout, workoutResult, workoutType } from "./types";

// ajuda para sorting
const byDateDesc = (a: workout, b: workout) => b.date.getTime() - a.date.getTime();

//faz sort
export function sortRecent(workouts: workout[]): workout[] {
  return [...workouts].sort(byDateDesc);
}

// últimos x dias
export function lastDays(workouts: workout[], today: Date, days: number): workout[] {
  const from = addDays(today, -(days - 1)).getTime();
  const to = today.getTime();
  return sortRecent(workouts.filter((w) => w.date.getTime() >= from && w.date.getTime() <= to));
}

// filtros de
export type periodFilter = "all" | "week" | "month";

//filtro por períodos
export function filterHistory(
  workouts: workout[],
  period: periodFilter,
  query: string,
  today: Date,
): workout[] {
  const q = query.trim().toLocaleLowerCase("pt-PT");
  const inPeriod =
    period === "all" ? sortRecent(workouts) : lastDays(workouts, today, period === "week" ? 7 : 30);
  return inPeriod.filter((w) => q === "" || w.name.toLocaleLowerCase("pt-PT").includes(q));
}

//Labels para o tipo de workout
export const WORKOUT_TYPE_LABELS: Record<workoutType, string> = {
  FORTIME: "For Time",
  AMRAP: "AMRAP",
  EMOM: "EMOM",
  INTERVALS: "Intervalos",
  OTHER: "Outro",
};

//labels para objetivo de treino
export const RESULT_GOAL_LABELS: Record<workoutGoal, string> = {
  time: "Tempo",
  reps: "Repetições",
  maxLoad: "Carga",
  distance: "Distância",
  calories: "Calorias",
  rounds: "Rondas + Reps",
};

export const SUGGESTED_RESULT: Partial<Record<workoutType, workoutGoal>> = {
  FORTIME: "time",
  AMRAP: "rounds",
};

//formatar visualmente os resultados com unidade
function formatResult(result: workoutResult | undefined): string {
  if (!result || result.value === undefined) return "";
  const v = formatNumber(result.value);
  switch (result.goal) {
    case "time":
      return formatDuration(result.value);
    case "rounds":
      return `${v} ${result.value === 1 ? "ronda" : "rondas"}${result.reps ? ` + ${result.reps} reps` : ""}`;
    case "reps":
      return `${v} reps`;
    case "maxLoad":
      return `${v} kg`;
    case "distance":
      return `${v} m`;
    case "calories":
      return `${v} kcal`;
  }
}

//formata visualmente a estrutura do workout
export function formatStructure(workout: workout): string {
  const parts: string[] = [];
  if (workout.type) parts.push(WORKOUT_TYPE_LABELS[workout.type]);
  if (workout.rounds) parts.push(`${workout.rounds} ${workout.rounds === 1 ? "ronda" : "rondas"}`);
  if (workout.workTime && workout.restTime)
    parts.push(`${formatDuration(workout.workTime)} / ${formatDuration(workout.restTime)}`);
  else if (workout.workTime) parts.push(`${formatDuration(workout.workTime)} trabalho`);
  else if (workout.restTime) parts.push(`${formatDuration(workout.restTime)} descanso`);
  if (workout.timeCap) parts.push(`cap ${formatDuration(workout.timeCap)}`);
  const result = formatResult(workout.result);
  if (result) parts.push(`resultado ${result}`);
  return parts.join(" · ");
}

//pesquisa de movimento
function movementName(movements: movement[], id: string): string {
  return movements.find((m) => m.id === id)?.name ?? "Movimento";
}

//formata lista de movimentos com separador
export function formatMovementList(workout: workout, movements: movement[]): string {
  return workout.movements.map((m) => movementName(movements, m.movementId)).join(" · ");
}

//remove espaços, normaliza letra pequena, sem caracteres especiais
export function normalize(text: string): string {
  return text
    .trim()
    .toLocaleLowerCase("pt-PT")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

//função de pesquisa de movimentos. normalizado na entrada e no valor pesquisado
export function searchMovements(movements: movement[], query: string): movement[] {
  const q = normalize(query);
  return [...movements]
    .filter((m) => q === "" || normalize(m.name).includes(q))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-PT"));
}
