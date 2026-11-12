import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { workoutsAPI } from "../features/workouts/types";
export type RootStackParamList = {
  Home: undefined;
  History: undefined;
  Workout: { workoutId?: string } | undefined;
};

export type ScreenProps<Name extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Name
> & {
  api: workoutsAPI;
};
