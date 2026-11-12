import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../../../components/AppHeader";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { DateField } from "../../../components/DateField";
import { SafeAreaView } from "react-native-safe-area-context";
import { DurationInput } from "../../../components/DurationInput";
import { EmptyState } from "../../../components/EmptyState";
import { FilterChips, type ChipOption } from "../../../components/FilterChips";
import { NumberInput } from "../../../components/NumberInput";
import { TextField } from "../../../components/TextField";
import type { ScreenProps } from "../../../navigation/types";
import { colors, size, space, typography } from "../../../theme";
import { MovementEntry } from "../components/MovementEntry";
import { MovementPicker } from "../components/MovementPicker";
import { today as getToday } from "../dates";
import { newId } from "../operations";
import { durationToText, parseDuration, parseNumber } from "../metrics";
import { RESULT_GOAL_LABELS, SUGGESTED_RESULT, WORKOUT_TYPE_LABELS } from "../rules";
import type { metricTypes, movement, workoutGoal, workout, workoutType } from "../types";
import {
  NOTES_MAX,
  readResult,
  readValues,
  validateWorkout,
  type MetricInputs,
  type WorkoutErrors,
  type WorkoutFields,
} from "../validation";

type DraftMovement = { id: string; movementId: string; inputs: MetricInputs };

const toText = (n: number | undefined) => (n === undefined ? "" : String(n).replace(".", ","));

const TYPE_OPTIONS = (Object.keys(WORKOUT_TYPE_LABELS) as workoutType[]).map((value) => ({
  value,
  label: WORKOUT_TYPE_LABELS[value],
}));
const RESULT_OPTIONS: ChipOption<workoutGoal>[] = (
  Object.keys(RESULT_GOAL_LABELS) as workoutGoal[]
).map((value) => ({
  value,
  label: RESULT_GOAL_LABELS[value],
}));
const RESULT_UNITS: Record<workoutGoal, string> = {
  time: "",
  rounds: "",
  reps: "reps",
  maxLoad: "kg",
  distance: "m",
  calories: "kcal",
};

type UnitFieldProps = {
  label: string;
  value: string;
  onChange: (text: string) => void;
  unit: string;
  decimals?: boolean;
  error?: string;
};

type TimeFieldProps = {
  label: string;
  value: string;
  onChange: (text: string) => void;
  error?: string;
};

function TimeField({ label, value, onChange, error }: TimeFieldProps) {
  return (
    <View>
      <View style={styles.inline}>
        <Text style={styles.inlineLabel}>{label}</Text>
        <DurationInput value={value} onChange={onChange} invalid={Boolean(error)} />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function UnitField({ label, value, onChange, unit, decimals, error }: UnitFieldProps) {
  return (
    <View>
      <View style={styles.inline}>
        <Text style={styles.inlineLabel}>{label}</Text>
        <NumberInput
          value={value}
          onChangeText={onChange}
          decimals={decimals}
          invalid={Boolean(error)}
          style={styles.number}
        />
        <Text style={styles.unit}>{unit}</Text>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export function WorkoutScreen({ navigation, route, api }: ScreenProps<"Workout">) {
  const today = getToday();
  const workoutId = route.params?.workoutId;
  const existing = workoutId ? api.workouts.find((w) => w.id === workoutId) : undefined;

  const [fields, setFields] = useState<WorkoutFields>({
    name: existing?.name ?? "",
    timeCap: durationToText(existing?.timeCap),
    rounds: toText(existing?.rounds),
    work: durationToText(existing?.workTime),
    rest: durationToText(existing?.restTime),
    resultValue:
      existing?.result?.goal === "time"
        ? durationToText(existing.result.value)
        : toText(existing?.result?.value),
    resultReps: toText(existing?.result?.reps),
    notes: existing?.notes ?? "",
  });
  const [date, setDate] = useState<Date>(existing?.date ?? today);
  const [type, setType] = useState<workoutType | null>(existing?.type ?? null);
  const [resultKind, setResultKind] = useState<workoutGoal | null>(existing?.result?.goal ?? null);
  const [drafts, setDrafts] = useState<DraftMovement[]>(
    () =>
      existing?.movements.map((m) => ({
        id: m.id,
        movementId: m.movementId,
        inputs: Object.fromEntries(
          Object.entries(m.movementMetrics).map(([k, v]) => [
            k,
            k === "time" ? durationToText(v) : toText(v),
          ]),
        ) as MetricInputs,
      })) ?? [],
  );
  const [errors, setErrors] = useState<WorkoutErrors>({});
  const [entryErrors, setEntryErrors] = useState<Record<string, string>>({});
  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const title = existing ? "Editar treino" : "Novo treino";

  useEffect(() => {
    if (workoutId && !existing) {
      navigation.goBack();
      return;
    }
    navigation.setOptions({ title });
  }, [navigation, workoutId, existing, title]);

  const setField = (key: keyof WorkoutFields, value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const chooseType = (value: workoutType) => {
    const next = type === value ? null : value;
    setType(next);

    if (next && !resultKind && SUGGESTED_RESULT[next])
      chooseResultKind(SUGGESTED_RESULT[next] as workoutGoal);
  };

  const chooseResultKind = (value: workoutGoal) => {
    setResultKind((current) => (current === value ? null : value));

    setFields((prev) => ({ ...prev, resultValue: "", resultReps: "" }));
  };

  const addMovement = (movement: movement) => {
    setDrafts((prev) => [...prev, { id: newId(), movementId: movement.id, inputs: {} }]);
    setErrors((prev) => ({ ...prev, movements: undefined }));
    setPickerOpen(false);
  };

  const createMovement = (movement: movement) => {
    api.addMovement(movement);
    addMovement(movement);
  };

  const setInput = (draftId: string, key: metricTypes, text: string) =>
    setDrafts((prev) =>
      prev.map((d) => (d.id === draftId ? { ...d, inputs: { ...d.inputs, [key]: text } } : d)),
    );

  const removeDraft = (draftId: string) =>
    setDrafts((prev) => prev.filter((d) => d.id !== draftId));

  const save = () => {
    const formErrors = validateWorkout(fields, resultKind, drafts.length);
    const nextEntryErrors: Record<string, string> = {};
    const movements = drafts.map((d) => {
      const metrics = api.movements.find((m) => m.id === d.movementId)?.metrics ?? [];
      const { values, error } = readValues(metrics, d.inputs);
      if (error) nextEntryErrors[d.id] = error;
      return { id: d.id, movementId: d.movementId, movementMetrics: values };
    });
    setErrors(formErrors);
    setEntryErrors(nextEntryErrors);
    if (Object.values(formErrors).some(Boolean) || Object.values(nextEntryErrors).some(Boolean))
      return;

    const workout: workout = {
      id: existing?.id ?? newId(),
      name: fields.name.trim(),
      type: type ?? undefined,
      date,
      timeCap: parseDuration(fields.timeCap),
      rounds: parseNumber(fields.rounds),
      workTime: parseDuration(fields.work),
      restTime: parseDuration(fields.rest),
      movements,
      result: readResult(resultKind, fields),
      notes: fields.notes.trim() === "" ? undefined : fields.notes.trim(),
    };
    if (existing) api.updateWorkout(workout);
    else api.addWorkout(workout);
    navigation.goBack();
  };

  const remove = () => {
    setConfirmDelete(false);
    if (existing) api.deleteWorkout(existing.id);
  };

  const hasErrors = Object.values(errors).some(Boolean) || Object.values(entryErrors).some(Boolean);

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <AppHeader
        title={title}
        left={{ icon: "x", label: "Cancelar", onPress: () => navigation.goBack() }}
        right={{ icon: "check", label: "Guardar treino", onPress: save }}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TextField
            label="Nome do treino"
            value={fields.name}
            onChangeText={(t) => setField("name", t)}
            placeholder="Ex.: Murph"
            error={errors.name}
          />
          <DateField label="Data" value={date} onChange={setDate} maximumDate={today} />

          <View style={styles.field}>
            <Text style={styles.label}>Tipo de workout</Text>
            <FilterChips options={TYPE_OPTIONS} selected={type} onChange={chooseType} />
          </View>

          <Card title="Estrutura">
            <Text style={styles.help}>Tudo opcional.</Text>
            <TimeField
              label="Time cap"
              value={fields.timeCap}
              onChange={(t) => setField("timeCap", t)}
              error={errors.timeCap}
            />
            <UnitField
              label="Rondas / sets"
              value={fields.rounds}
              onChange={(t) => setField("rounds", t)}
              unit=""
              error={errors.rounds}
            />
            <TimeField
              label="Trabalho por ronda"
              value={fields.work}
              onChange={(t) => setField("work", t)}
              error={errors.work}
            />
            <TimeField
              label="Descanso por ronda"
              value={fields.rest}
              onChange={(t) => setField("rest", t)}
              error={errors.rest}
            />
          </Card>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Movimentos</Text>
            {drafts.length === 0 ? (
              <EmptyState message="Ainda sem movimentos. Acrescenta o primeiro." />
            ) : null}
            {drafts.map((d) => {
              const movement = api.movements.find((m) => m.id === d.movementId);
              if (!movement) return null;
              return (
                <MovementEntry
                  key={d.id}
                  movement={movement}
                  inputs={d.inputs}
                  onChange={(key, text) => setInput(d.id, key, text)}
                  onRemove={() => removeDraft(d.id)}
                  error={entryErrors[d.id]}
                />
              );
            })}
            {errors.movements ? <Text style={styles.error}>{errors.movements}</Text> : null}
            <Button
              label="Adicionar movimento"
              icon="plus"
              variant="secondary"
              onPress={() => setPickerOpen(true)}
            />
          </View>

          <Card title="Resultado">
            <Text style={styles.help}>
              Opcional. Escolhe o que mede o resultado deste treino e regista o teu.
            </Text>
            <FilterChips
              options={RESULT_OPTIONS}
              selected={resultKind}
              onChange={chooseResultKind}
            />
            {resultKind === "time" ? (
              <TimeField
                label="O meu tempo"
                value={fields.resultValue}
                onChange={(t) => setField("resultValue", t)}
                error={errors.resultValue}
              />
            ) : resultKind ? (
              <UnitField
                label={
                  resultKind === "rounds" ? "Rondas completas" : RESULT_GOAL_LABELS[resultKind]
                }
                value={fields.resultValue}
                onChange={(t) => setField("resultValue", t)}
                unit={RESULT_UNITS[resultKind]}
                decimals={resultKind === "maxLoad"}
                error={errors.resultValue}
              />
            ) : null}
            {resultKind === "rounds" ? (
              <UnitField
                label="Reps extra"
                value={fields.resultReps}
                onChange={(t) => setField("resultReps", t)}
                unit="reps"
                error={errors.resultReps}
              />
            ) : null}
          </Card>

          <TextField
            label="Notas / observações"
            value={fields.notes}
            onChangeText={(t) => setField("notes", t)}
            placeholder="Como correu, adaptações, sensações"
            multiline
            maxLength={NOTES_MAX}
            hint={`${fields.notes.length}/${NOTES_MAX}`}
          />

          {hasErrors ? (
            <Text style={styles.error}>Corrige os campos assinalados antes de guardar.</Text>
          ) : null}
          <Button label="Guardar treino" onPress={save} />
          {existing ? (
            <Button
              label="Eliminar treino"
              variant="danger"
              onPress={() => setConfirmDelete(true)}
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      {pickerOpen ? (
        <MovementPicker
          movements={api.movements}
          usedIds={drafts.map((d) => d.movementId)}
          onPick={addMovement}
          onCreate={createMovement}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}

      <ConfirmDialog
        visible={confirmDelete}
        title="Eliminar treino?"
        message="Este registo vai ser eliminado."
        confirmLabel="Eliminar"
        onConfirm={remove}
        onCancel={() => setConfirmDelete(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { paddingHorizontal: space.xl, paddingBottom: space.xxl, gap: space.xl },
  field: { gap: space.sm },
  label: { ...typography.label, color: colors.textMuted },
  help: { ...typography.bodySmall, color: colors.textMuted },
  inline: { flexDirection: "row", alignItems: "center", gap: space.sm },
  inlineLabel: { ...typography.bodySmall, color: colors.textMuted, flex: 1 },
  number: { width: size.numberInput },
  unit: { ...typography.bodySmall, color: colors.textMuted, width: size.unitLabel },
  section: { gap: space.md },
  sectionTitle: { ...typography.heading, color: colors.text },
  error: { ...typography.bodySmall, color: colors.danger },
});
