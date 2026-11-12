import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, size, space, stroke, typography } from "../theme";
import type { ChipOption } from "./FilterChips";

type ToggleChipsProps<T extends string> = {
  options: ChipOption<T>[];
  selected: T[];
  onChange: (selected: T[]) => void;
};

export function ToggleChips<T extends string>({
  options,
  selected,
  onChange,
}: ToggleChipsProps<T>) {
  const toggle = (value: T) =>
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const on = selected.includes(option.value);
        return (
          <Pressable
            style={[styles.chip, on && styles.on]}
            key={option.value}
            onPress={() => toggle(option.value)}
          >
            <Text style={[styles.text, { color: on ? colors.onAccent : colors.text }]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  chip: {
    minHeight: size.touchMin,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: stroke.thin,
    borderColor: colors.borderStrong,
    justifyContent: "center",
  },
  on: { backgroundColor: colors.accent, borderColor: colors.accent },
  text: { ...typography.bodySmallStrong },
});
