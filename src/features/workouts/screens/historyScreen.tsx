import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { AppHeader } from "../../../components/AppHeader";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { EmptyState } from "../../../components/EmptyState";
import { FilterChips, type ChipOption } from "../../../components/FilterChips";
import { TextField } from "../../../components/TextField";
import type { ScreenProps } from "../../../navigation/types";
import { colors, space } from "../../../theme";
import { WorkoutCard } from "../components/WorkoutCard";
import { isSameDay, today as getToday } from "../dates";
import { filterHistory, type periodFilter } from "../rules";
import type { workout } from "../types";
import { SafeAreaView } from "react-native-safe-area-context";

const PERIODS: ChipOption<periodFilter>[] = [
  { value: "all", label: "Todos" },
  { value: "week", label: "7 dias" },
  { value: "month", label: "30 dias" },
];

export function HistoryScreen({ navigation, api }: ScreenProps<"History">) {
  const today = getToday();
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState<periodFilter>("all");
  const [toDelete, setToDelete] = useState<workout | null>(null);

  const visible = filterHistory(api.workouts, period, query, today);

  useEffect(() => {
    navigation.setOptions({ title: `Histórico (${visible.length})` });
  }, [navigation, visible.length]);

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <AppHeader
        title="Histórico"
        left={{ icon: "arrow-left", label: "Voltar", onPress: () => navigation.goBack() }}
        right={{
          icon: "plus-circle",
          label: "Novo treino",
          onPress: () => navigation.navigate("Workout"),
        }}
      />
      <FlatList
        data={visible}
        keyExtractor={(w) => w.id}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.controls}>
            <TextField
              label="Pesquisar por nome"
              value={query}
              onChangeText={setQuery}
              placeholder="Ex.: Hyrox"
            />
            <FilterChips options={PERIODS} selected={period} onChange={setPeriod} />
          </View>
        }
        ListEmptyComponent={<EmptyState message="Nenhum treino corresponde à pesquisa." />}
        renderItem={({ item }) => (
          <WorkoutCard
            workout={item}
            movements={api.movements}
            isToday={isSameDay(item.date, today)}
            onPress={() => navigation.navigate("Workout", { workoutId: item.id })}
            onDelete={() => setToDelete(item)}
          />
        )}
      />
      <ConfirmDialog
        visible={toDelete !== null}
        title="Eliminar treino?"
        message={
          toDelete
            ? `“${toDelete.name}” de ${toDelete.date.toLocaleDateString("pt-PT", { weekday: "short", day: "numeric", month: "short" })} vai ser eliminado.`
            : ""
        }
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (toDelete) api.deleteWorkout(toDelete.id);
          setToDelete(null);
        }}
        onCancel={() => setToDelete(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: space.xl, paddingBottom: space.xxl, gap: space.md },
  controls: { gap: space.lg, marginBottom: space.sm },
});
