import { normalize } from "./rules";
import { parseDuration, parseNumber } from "./metrics";
import type { metricTypes, movement, workoutGoal, metricValues, workoutResult } from "./types";

// Number fields only accept digits (see NumberInput), so values need no checking here:
// only the rules of the workout itself are validated.

/** Text typed per metric. */
export type MetricInputs = Partial<Record<metricTypes, string>>;

/** Inputs -> Values for the metrics of a movement. Empty fields are skipped. */
export function readValues(
  metrics: metricTypes[],
  inputs: MetricInputs,
): { values: metricValues; error?: string } {
  const values: metricValues = {};
  for (const key of metrics) {
    const value = key === "time" ? parseDuration(inputs[key]) : parseNumber(inputs[key]);
    if (value !== undefined) values[key] = value;
  }
  return Object.keys(values).length > 0
    ? { values }
    : { values, error: "Indica pelo menos um valor." };
}

// ---------- Workout form ----------

export type WorkoutFields = {
  name: string;
  /** Times as "m:s" text (see DurationInput). */
  timeCap: string;
  rounds: string;
  work: string;
  rest: string;
  /** Result in the unit of its kind ("m:s" for 'time'). */
  resultValue: string;
  /** Extra reps, only for 'rounds'. */
  resultReps: string;
  notes: string;
};

export type WorkoutErrors = Partial<Record<keyof WorkoutFields | "movements", string>>;

const NAME_MIN = 3;
const NAME_MAX = 40;
export const NOTES_MAX = 500;
const MINUTES_MAX = 180;
const ROUNDS_MAX = 100;
const EXTRA_REPS_MAX = 999;

/** "m:s" text from DurationInput: seconds must be 0–59 and minutes at most MINUTES_MAX. */
function durationError(text: string): string | undefined {
  const [m = "", s = ""] = text.split(":");
  if ((Number(s) || 0) > 59) return "Os segundos vão de 0 a 59.";
  if ((Number(m) || 0) > MINUTES_MAX) return `Máximo ${MINUTES_MAX} minutos.`;
  return undefined;
}

export function validateWorkout(
  fields: WorkoutFields,
  resultKind: workoutGoal | null,
  movementCount: number,
): WorkoutErrors {
  const errors: WorkoutErrors = {};
  const name = fields.name.trim();
  if (name.length < NAME_MIN) errors.name = `O nome precisa de pelo menos ${NAME_MIN} caracteres.`;
  else if (name.length > NAME_MAX) errors.name = `O nome tem no máximo ${NAME_MAX} caracteres.`;

  if (movementCount === 0) errors.movements = "Acrescenta pelo menos um movimento.";

  errors.timeCap = durationError(fields.timeCap);
  errors.work = durationError(fields.work);
  errors.rest = durationError(fields.rest);

  const rounds = parseNumber(fields.rounds);
  if (rounds !== undefined && rounds > ROUNDS_MAX) errors.rounds = `Entre 1 e ${ROUNDS_MAX} rondas.`;

  if (resultKind) {
    const isTime = resultKind === "time";
    const value = isTime ? parseDuration(fields.resultValue) : parseNumber(fields.resultValue);
    const cap = parseDuration(fields.timeCap);
    if (value === undefined) errors.resultValue = "Indica o resultado ou retira o objetivo.";
    else if (isTime) errors.resultValue = durationError(fields.resultValue);
    // A time above the time cap means the workout was capped: log the reps instead.
    if (!errors.resultValue && isTime && value !== undefined && cap !== undefined && value > cap) {
      errors.resultValue = "Acima do time cap: regista antes as reps feitas (resultado em Reps).";
    }

    const extraReps = parseNumber(fields.resultReps);
    if (resultKind === "rounds" && extraReps !== undefined && extraReps > EXTRA_REPS_MAX) {
      errors.resultReps = `Máximo ${EXTRA_REPS_MAX} reps.`;
    }
  }

  return errors;
}

/** Builds the result from the form, or undefined if no kind was chosen. */
export function readResult(
  kind: workoutGoal | null,
  fields: WorkoutFields,
): workoutResult | undefined {
  if (!kind) return undefined;
  const value =
    kind === "time" ? parseDuration(fields.resultValue) : parseNumber(fields.resultValue);
  const reps = kind === "rounds" ? parseNumber(fields.resultReps) : undefined;
  return {
    goal: kind,
    ...(value !== undefined ? { value } : {}),
    ...(reps !== undefined ? { reps } : {}),
  };
}

// Novo movimento

export function validateNewMovement(
  name: string,
  metrics: metricTypes[],
  existing: movement[],
): { name?: string; metrics?: string } {
  const errors: { name?: string; metrics?: string } = {};
  const trimmed = name.trim();
  if (trimmed.length < 2) errors.name = "O nome precisa de pelo menos 2 caracteres.";
  else if (trimmed.length > 30) errors.name = "O nome tem no máximo 30 caracteres.";
  else if (existing.some((m) => normalize(m.name) === normalize(trimmed)))
    errors.name = "Já existe um movimento com este nome.";
  if (metrics.length === 0) errors.metrics = "Escolhe pelo menos uma métrica.";
  return errors;
}
