import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, size, space, stroke, typography } from "../theme";

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  hint?: string;
};

export function TextField({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  multiline,
  maxLength,
  hint,
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          multiline && styles.multiline,
          focused && styles.focused,
          error ? styles.invalid : null,
        ]}
      />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: space.sm,
  },
  label: {
    ...typography.label,
    color: colors.textMuted,
  },
  input: {
    ...typography.body,
    minHeight: size.inputHeight,
    borderWidth: stroke.thin,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
    backgroundColor: colors.background,
    color: colors.text,
  },
  multiline: {
    minHeight: size.inputHeight * 2,
    paddingTop: space.md,
    textAlignVertical: "top",
  },
  focused: {
    borderWidth: stroke.thick,
    borderColor: colors.focus,
  },
  invalid: {
    borderWidth: stroke.thick,
    borderColor: colors.danger,
  },
  error: {
    ...typography.bodySmall,
    color: colors.danger,
  },
  hint: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
});
