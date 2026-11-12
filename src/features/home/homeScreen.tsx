import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../../components/AppHeader";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import type { ScreenProps } from "../../navigation/types";
import { colors, space, typography } from "../../theme";
import { WorkoutCard } from "../workouts/components/WorkoutCard";
import { isSameDay, today as getToday } from "../workouts/dates";
import { lastDays, sortRecent } from "../workouts/rules";
import { SafeAreaView } from "react-native-safe-area-context";

const COLLAPSED = 3;

export function HomeScreen({ navigation, api }: ScreenProps<"Home">) {
  const today = getToday();
  const [expanded, setExpanded] = useState(false);

  // x mais recentes (collapsed) ou últimos 7 quando não collapsed.
  const recent = sortRecent(api.workouts).slice(0, COLLAPSED);
  const week = lastDays(api.workouts, today, 7);
  const shown = expanded ? week : recent;

  const openWorkout = (workoutId: string) => navigation.navigate("Workout", { workoutId });

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <AppHeader
        eyebrow={today.toLocaleDateString("pt-PT", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
        title="Treinos"
        left={{
          icon: "history",
          label: "Histórico completo",
          onPress: () => navigation.navigate("History"),
        }}
        right={{
          icon: "plus",
          label: "Novo treino",
          onPress: () => navigation.navigate("Workout"),
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{expanded ? "Últimos 7 dias" : "Últimos treinos"}</Text>
          {shown.length === 0 ? (
            <EmptyState
              message={
                expanded
                  ? "Sem treinos nos últimos 7 dias."
                  : "Ainda sem treinos. Cria o primeiro com o +."
              }
            />
          ) : (
            shown.map((w) => (
              <WorkoutCard
                key={w.id}
                workout={w}
                movements={api.movements}
                isToday={isSameDay(w.date, today)}
                onPress={() => openWorkout(w.id)}
              />
            ))
          )}
          {week.length > COLLAPSED || expanded ? (
            <Button
              variant="ghost"
              icon={expanded ? "chevron-up" : "chevron-down"}
              label={expanded ? "Mostrar menos" : `Mostrar últimos 7 dias (${week.length})`}
              onPress={() => setExpanded(!expanded)}
            />
          ) : null}
        </View>
        <Button
          label="Ver histórico completo"
          icon="history"
          onPress={() => navigation.navigate("History")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: space.xl, paddingBottom: space.xxl, gap: space.xxl },
  section: { gap: space.md },
  sectionTitle: { ...typography.heading, color: colors.text },
});
