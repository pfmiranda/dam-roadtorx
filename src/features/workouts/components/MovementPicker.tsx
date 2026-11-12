import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../components/Button";
import { EmptyState } from "../../../components/EmptyState";
import { IconButton } from "../../../components/IconButton";
import { TextField } from "../../../components/TextField";
import { ToggleChips } from "../../../components/ToggleChips";
import { colors, radius, space, stroke, typography } from "../../../theme";
import { METRIC_INFO, METRIC_ORDER } from "../metrics";
import { newId } from "../operations";
import { normalize, searchMovements } from "../rules";
import type { metricTypes, movement } from "../types";
import { validateNewMovement } from "../validation";

type MovementPickerProps = {
  movements: movement[];
  usedIds: string[];
  onPick: (movement: movement) => void;
  onCreate: (movement: movement) => void;
  onClose: () => void;
};

const METRIC_OPTIONS = METRIC_ORDER.map((key) => ({ value: key, label: METRIC_INFO[key].label }));

export function MovementPicker({
  movements,
  usedIds,
  onPick,
  onCreate,
  onClose,
}: MovementPickerProps) {
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMetrics, setNewMetrics] = useState<metricTypes[]>([]);
  const [errors, setErrors] = useState<{ name?: string; metrics?: string }>({});

  const results = searchMovements(movements, query);
  const exactMatch = movements.some((m) => normalize(m.name) === normalize(query));

  const startCreating = () => {
    setNewName(query.trim());
    setNewMetrics([]);
    setErrors({});
    setCreating(true);
  };

  const create = () => {
    const found = validateNewMovement(newName, newMetrics, movements);
    setErrors(found);
    if (found.name || found.metrics) return;
    onCreate({
      id: newId(),
      name: newName.trim(),
      metrics: METRIC_ORDER.filter((m) => newMetrics.includes(m)),
    });
  };

  return (
    <Modal visible animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Text style={styles.title}>{creating ? "Novo movimento" : "Adicionar movimento"}</Text>
          <IconButton icon="x" onPress={creating ? () => setCreating(false) : onClose} />
        </View>

        {creating ? (
          <View style={styles.content}>
            <TextField
              label="Nome do movimento"
              value={newName}
              onChangeText={setNewName}
              error={errors.name}
            />
            <View style={styles.field}>
              <Text style={styles.label}>Métricas possíveis</Text>
              <ToggleChips
                options={METRIC_OPTIONS}
                selected={newMetrics}
                onChange={setNewMetrics}
              />
              {errors.metrics ? (
                <Text style={styles.error}>{errors.metrics}</Text>
              ) : (
                <Text style={styles.help}>
                  Só estas métricas aparecem quando usares o movimento num treino.
                </Text>
              )}
            </View>
            <Button label="Criar e adicionar" icon="plus" onPress={create} />
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(m) => m.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
            ListHeaderComponent={
              <View style={styles.searchBlock}>
                <TextField
                  label="Pesquisar"
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Ex.: clean, run…"
                />
                {query.trim() !== "" && !exactMatch ? (
                  <Button
                    label={`Criar “${query.trim()}”`}
                    variant="secondary"
                    icon="plus"
                    onPress={startCreating}
                  />
                ) : null}
              </View>
            }
            ListEmptyComponent={
              <EmptyState message="Nenhum movimento com este nome. Cria-o com o botão acima." />
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onPick(item)}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              >
                <Text style={styles.rowName}>{item.name}</Text>
                <Text style={styles.rowMeta}>
                  {item.metrics.map((m) => METRIC_INFO[m].label).join(" · ")}
                  {usedIds.includes(item.id) ? " · já no treino" : ""}
                </Text>
              </Pressable>
            )}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
  },
  title: { ...typography.title, color: colors.text },
  content: { padding: space.xl, gap: space.md },
  searchBlock: { gap: space.md, marginBottom: space.sm },
  field: { gap: space.sm },
  label: { ...typography.label, color: colors.textMuted },
  help: { ...typography.bodySmall, color: colors.textMuted },
  error: { ...typography.bodySmall, color: colors.danger },
  row: {
    borderWidth: stroke.thin,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: space.md,
    gap: space.xs,
  },
  rowPressed: { backgroundColor: colors.surfaceRaised },
  rowName: { ...typography.bodySmallStrong, color: colors.text },
  rowMeta: { ...typography.bodySmall, color: colors.textMuted },
});
