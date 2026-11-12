import { StyleSheet, Text, View } from "react-native";
import { Card } from "../../../components/Card";
import { DurationInput } from "../../../components/DurationInput";
import { IconButton } from "../../../components/IconButton";
import { NumberInput } from "../../../components/NumberInput";
import { colors, size, space, typography } from "../../../theme";
import { METRIC_INFO, METRIC_ORDER } from "../metrics";
import type { metricTypes, movement } from "../types";
import type { MetricInputs } from "../validation";

type MovementEntryProps = {
  movement: movement;
  inputs: MetricInputs;
  onChange: (key: metricTypes, text: string) => void;
  onRemove: () => void;
  error?: string;
};

// Entrada de novo movimento
export function MovementEntry({ movement, inputs, onChange, onRemove, error }: MovementEntryProps) {
  const metrics = METRIC_ORDER.filter((m) => movement.metrics.includes(m));
  return (
    <Card>
      <View style={styles.head}>
        <Text style={styles.name}>{movement.name}</Text>
        <IconButton icon="trash-2" onPress={onRemove} />
      </View>
      {metrics.map((key) => (
        <View key={key} style={styles.inline}>
          <Text style={styles.label}>{METRIC_INFO[key].label}</Text>
          {key === "time" ? (
            <DurationInput
              value={inputs.time ?? ""}
              onChange={(t) => onChange("time", t)}
              invalid={Boolean(error)}
            />
          ) : (
            <>
              <NumberInput
                value={inputs[key] ?? ""}
                onChangeText={(t) => onChange(key, t)}
                decimals={METRIC_INFO[key].decimals}
                invalid={Boolean(error)}
                style={styles.input}
              />
              <Text style={styles.unit}>{METRIC_INFO[key].unit}</Text>
            </>
          )}
        </View>
      ))}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.md,
  },
  name: { ...typography.heading, color: colors.text, flex: 1 },
  inline: { flexDirection: "row", alignItems: "center", gap: space.sm },
  label: { ...typography.bodySmall, color: colors.textMuted, flex: 1 },
  input: { width: size.numberInput },
  unit: { ...typography.bodySmall, color: colors.textMuted, width: size.unitLabel },
  error: { ...typography.bodySmall, color: colors.danger },
});
