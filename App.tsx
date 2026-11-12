import { DarkTheme, NavigationContainer, type Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { HomeScreen } from "./src/features/home/homeScreen";
import { today } from "./src/features/workouts/dates";
import { HistoryScreen } from "./src/features/workouts/screens/historyScreen";
import { WorkoutScreen } from "./src/features/workouts/screens/workoutScreen";
import { MOVEMENTS, createSeedWorkouts } from "./src/features/workouts/sampleWorkouts";
import type { movement, workout, workoutsAPI } from "./src/features/workouts/types";
import type { RootStackParamList } from "./src/navigation/types";
import { colors } from "./src/theme";
import { fontAssets } from "./src/theme/fonts";

// The Stack is created in App.tsx (course requirement); param types live in src/navigation.
const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
  },
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  // Shared state: Home, History and the form all read and change the same lists.
  const [workouts, setWorkouts] = useState<workout[]>(() => createSeedWorkouts(today()));
  const [movements, setMovements] = useState<movement[]>(MOVEMENTS);

  const addWorkout = (w: workout) => setWorkouts((prev) => [...prev, w]);
  const updateWorkout = (w: workout) =>
    setWorkouts((prev) => prev.map((x) => (x.id === w.id ? w : x)));
  const deleteWorkout = (id: string) => setWorkouts((prev) => prev.filter((x) => x.id !== id));
  const addMovement = (m: movement) => setMovements((prev) => [...prev, m]);

  const api: workoutsAPI = {
    workouts,
    movements,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addMovement,
  };

  if (fontError) console.warn("Fontes não carregadas; a usar a fonte do sistema.", fontError);
  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home">{(props) => <HomeScreen {...props} api={api} />}</Stack.Screen>
        <Stack.Screen name="History">
          {(props) => <HistoryScreen {...props} api={api} />}
        </Stack.Screen>
        <Stack.Screen name="Workout">
          {(props) => <WorkoutScreen {...props} api={api} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
