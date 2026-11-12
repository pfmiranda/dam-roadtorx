import { useState, type CSSProperties } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius, size, space, stroke, typography } from "../theme";
import type { DateFieldProps } from "./DateField";

// The browser's <input type="date"> works with 'YYYY-MM-DD' text, so this file is the only
// place that converts between text and Date (local time — never toISOString(), which uses UTC).
const pad = (n: number) => String(n).padStart(2, "0");
const toInput = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
function fromInput(text: string): Date | null {
  const [y, m, d] = text.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
}

// Web version of DateField (the native picker has no web support).

export function DateField({ label, value, onChange, maximumDate }: DateFieldProps) {
  const [focused, setFocused] = useState(false);

  const inputStyle: CSSProperties = {
    boxSizing: "border-box",
    height: size.inputHeight,
    padding: `0 ${space.md}px`,
    borderRadius: radius.sm,
    border: `${focused ? stroke.thick : stroke.thin}px solid ${
      focused ? colors.focus : colors.borderStrong
    }`,
    backgroundColor: colors.background,
    color: colors.text,
    colorScheme: "dark",
    fontFamily: fonts.body.regular,
    fontSize: typography.body.fontSize,
    outline: "none",
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <input
        type="date"
        value={toInput(value)}
        max={maximumDate ? toInput(maximumDate) : undefined}
        onChange={(event) => {
          // Clearing the field gives '' — keep the previous date instead of an invalid one.
          // Typing can go past `max` (it only limits the calendar), so clamp it here.
          const next = fromInput(event.target.value);
          if (!next) return;
          onChange(maximumDate && next.getTime() > maximumDate.getTime() ? maximumDate : next);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: space.sm },
  label: { ...typography.label, color: colors.textMuted },
  error: { ...typography.bodySmall, color: colors.danger },
});
