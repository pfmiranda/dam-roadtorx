import { useState } from "react";
import { StyleSheet, TextInput, type StyleProp, type ViewStyle } from "react-native";
import { colors, radius, size, space, stroke, typography } from "../theme";

type NumberInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  invalid?: boolean;
  //se aceita decimais
  decimals?: boolean;
  style?: StyleProp<ViewStyle>;
};

//limpeza de caracteres para versão web. mobile é assegurado pelo keyboardtype
function clean(text: string, decimals: boolean): string {
  if (!decimals) return text.replace(/[^0-9]/g, "");
  const [whole, ...rest] = text
    .replace(/\./g, ",")
    .replace(/[^0-9,]/g, "")
    .split(",");
  return rest.length > 0 ? `${whole},${rest.join("")}` : whole;
}

export function NumberInput({
  value,
  onChangeText,
  placeholder,
  invalid,
  decimals = false,
  style,
}: NumberInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      value={value}
      onChangeText={(text) => onChangeText(clean(text, decimals))}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      keyboardType={decimals ? "decimal-pad" : "number-pad"}
      inputMode={decimals ? "decimal" : "numeric"}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[styles.input, focused && styles.focused, invalid && styles.invalid, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    ...typography.numberSm,
    height: size.inputHeight,
    minWidth: 0,
    borderWidth: stroke.thin,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
    backgroundColor: colors.background,
    color: colors.text,
    textAlign: "right",
  },
  focused: { borderWidth: stroke.thick, borderColor: colors.focus },
  invalid: { borderWidth: stroke.thick, borderColor: colors.danger },
});
