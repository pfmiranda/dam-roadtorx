//métricas possíveis de associar a qualquer movimento
export type metricTypes = "distance" | "time" | "calories" | "weight" | "reps";

//garante que para qualquer métricas escolhida, uma ou várias, existe sempre um valor associado
export type metricValues = Partial<Record<metricTypes, number>>;

// tipo movimento
export type movement = {
  id: string;
  name: string;
  metrics: metricTypes[];
};

// tipo movimento do workout que tem um movimento e tem values para cada uma das suas métricas
export type workoutMovement = {
  id: string;
  movementId: string;
  movementMetrics: metricValues;
};

export type workoutType = "FORTIME" | "AMRAP" | "EMOM" | "INTERVALS" | "OTHER";

export type workoutGoal = "time" | "rounds" | "reps" | "maxLoad" | "distance" | "calories";

export type workoutResult = {
  goal: workoutGoal;
  value?: number;
  reps?: number;
};

export type workout = {
  id: string;
  name: string;
  type?: workoutType;
  date: Date;
  timeCap?: number;
  rounds?: number;
  workTime?: number;
  restTime?: number;
  movements: workoutMovement[];
  result?: workoutResult;
  notes?: string;
};

export type workoutsAPI = {
  workouts: workout[];
  movements: movement[];
  addWorkout: (workout: workout) => void;
  updateWorkout: (workout: workout) => void;
  deleteWorkout: (id: string) => void;
  addMovement: (movement: movement) => void;
};
