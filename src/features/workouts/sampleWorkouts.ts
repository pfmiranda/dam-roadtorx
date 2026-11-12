//Código by Claude

import { addDays } from "./dates";
import type { movement, metricValues, workout, workoutMovement } from "./types";

//Dados para carregar na plataforma para não iniciar vazio

export const MOVEMENTS: movement[] = [
  { id: "mv-run", name: "Run", metrics: ["distance", "time"] },
  { id: "mv-row", name: "Row", metrics: ["distance", "time", "calories"] },
  { id: "mv-bike", name: "Bike", metrics: ["calories", "distance", "time"] },
  { id: "mv-clean", name: "Clean", metrics: ["reps", "weight"] },
  { id: "mv-power-clean", name: "Power Clean", metrics: ["reps", "weight"] },
  { id: "mv-deadlift", name: "Deadlift", metrics: ["reps", "weight"] },
  { id: "mv-pull-up", name: "Pull up", metrics: ["reps"] },
  { id: "mv-wall-ball", name: "Wall ball", metrics: ["reps", "weight"] },
  { id: "mv-burpee", name: "Burpee", metrics: ["reps"] },
  { id: "mv-box-jump", name: "Box Jump", metrics: ["reps"] },
  { id: "mv-double-under", name: "Double under", metrics: ["reps"] },
  { id: "mv-plank", name: "Plank", metrics: ["time"] },
];

let n = 0;
const mv = (movementId: string, movementMetrics: metricValues): workoutMovement => ({
  id: `wm-${++n}`,
  movementId,
  movementMetrics,
});

/** Dates relative to today: the last 3 / last 7 days views always have content. */
export function createSeedWorkouts(today: Date): workout[] {
  n = 0;
  const d = (offset: number) => addDays(today, offset);
  return [
    {
      id: "w-01",
      name: "Hyrox Sim",
      type: "FORTIME",
      date: d(0),
      timeCap: 1800,
      result: { goal: "time", value: 1665 },
      notes: "Wall balls partidas em séries de 10.",
      movements: [
        mv("mv-run", { distance: 1000 }),
        mv("mv-row", { distance: 1000 }),
        mv("mv-wall-ball", { reps: 50, weight: 6 }),
      ],
    },
    {
      id: "w-02",
      name: "Trabalha 4, descansa 3",
      type: "INTERVALS",
      date: d(-1),
      rounds: 3,
      workTime: 240,
      restTime: 180,
      result: { goal: "rounds", value: 4, reps: 2 },
      movements: [mv("mv-run", { distance: 400 }), mv("mv-power-clean", { reps: 10, weight: 60 })],
    },
    {
      id: "w-03",
      name: "Força A",
      type: "OTHER",
      date: d(-2),
      result: { goal: "maxLoad", value: 100 },
      movements: [mv("mv-deadlift", { reps: 5, weight: 100 }), mv("mv-pull-up", { reps: 8 })],
    },
    {
      id: "w-04",
      name: "Fran adaptado",
      type: "FORTIME",
      date: d(-4),
      timeCap: 600,
      result: { goal: "time", value: 540 },
      notes: "Pull ups em séries de 5 a partir da segunda ronda.",
      movements: [mv("mv-pull-up", { reps: 45 }), mv("mv-wall-ball", { reps: 45, weight: 9 })],
    },
    {
      id: "w-05",
      name: "Corrida 10K",
      type: "FORTIME",
      date: d(-5),
      result: { goal: "time", value: 3290 },
      movements: [mv("mv-run", { distance: 10000, time: 3290 })],
    },
    {
      id: "w-06",
      name: "EMOM 12",
      type: "EMOM",
      date: d(-6),
      timeCap: 720,
      rounds: 12,
      workTime: 60,
      movements: [mv("mv-burpee", { reps: 10 })],
    },
    {
      id: "w-07",
      name: "Bike intervalos",
      type: "INTERVALS",
      date: d(-9),
      rounds: 8,
      workTime: 30,
      restTime: 90,
      result: { goal: "calories", value: 118 },
      movements: [mv("mv-bike", { calories: 15 })],
    },
    {
      id: "w-08",
      name: "Força B",
      type: "OTHER",
      date: d(-12),
      result: { goal: "maxLoad", value: 70 },
      movements: [mv("mv-clean", { reps: 5, weight: 70 }), mv("mv-plank", { time: 60 })],
    },
    {
      id: "w-09",
      name: "Chipper",
      type: "FORTIME",
      date: d(-15),
      timeCap: 1500,
      result: { goal: "reps", value: 100 },
      notes: "Time cap: faltaram 10 double unders.",
      movements: [
        mv("mv-row", { distance: 500 }),
        mv("mv-box-jump", { reps: 30 }),
        mv("mv-burpee", { reps: 30 }),
        mv("mv-double-under", { reps: 50 }),
      ],
    },
    {
      id: "w-10",
      name: "Hyrox Sim",
      type: "FORTIME",
      date: d(-20),
      timeCap: 1800,
      result: { goal: "time", value: 1710 },
      movements: [
        mv("mv-run", { distance: 1000 }),
        mv("mv-row", { distance: 1000 }),
        mv("mv-wall-ball", { reps: 40, weight: 6 }),
      ],
    },
  ];
}
