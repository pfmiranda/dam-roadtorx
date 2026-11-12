import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { colors, radius, size, space, stroke, typography } from "../theme";

export type ChipOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: ChipOption<T>[];
  selected: T | null;
  onChange: (value: T) => void;
};

export function FilterChips<T extends string>({ options, selected, onChange }: Props<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.chip, isSelected && styles.selected]}
          >
            <Text style={[styles.text, { color: isSelected ? colors.onAccent : colors.text }]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: space.sm,
  },
  chip: {
    minHeight: size.touchMin,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: stroke.thin,
    borderColor: colors.borderStrong,
    justifyContent: "center",
  },
  selected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  text: {
    ...typography.bodySmallStrong,
  },
});
