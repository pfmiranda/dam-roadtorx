import { Lucide, type LucideIconName } from "@react-native-vector-icons/lucide";
import { StyleSheet, Text, Pressable, View, type ViewStyle } from "react-native";
import { colors, radius, size, space, stroke, typography } from "../theme";

export type IconName = LucideIconName;

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
};

// Pressable para ter mais opções de estilos. Variant permite alterar estilo
export function Button({ label, onPress, variant = "primary", icon }: ButtonProps) {
  const v = variants[variant];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.base, v.container, pressed && v.pressed]}
    >
      <View style={styles.content}>
        {icon && variant !== "ghost" ? (
          <Lucide name={icon} size={size.iconMd - 2} color={v.textColor} />
        ) : null}
        <Text style={[v.text, { color: v.textColor }]}>{label}</Text>
        {icon && variant === "ghost" ? (
          <Lucide name={icon} size={size.iconSm} color={v.textColor} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: size.touchMin,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space.lg,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
});

const variants: Record<
  ButtonVariant,
  { container: ViewStyle; pressed: ViewStyle; text: object; textColor: string }
> = {
  primary: {
    container: {
      height: size.buttonPrimary,
      borderRadius: radius.md,
      backgroundColor: colors.accent,
    },
    pressed: { backgroundColor: colors.accentPressed },
    text: typography.button,
    textColor: colors.onAccent,
  },

  secondary: {
    container: {
      height: size.touchMin,
      borderRadius: radius.sm,
      borderWidth: stroke.thin,
      borderColor: colors.borderStrong,
    },
    pressed: { backgroundColor: colors.surfaceRaised },
    text: typography.bodySmallStrong,
    textColor: colors.text,
  },
  ghost: {
    container: { height: size.touchMin },
    pressed: { backgroundColor: colors.surfaceRaised, borderRadius: radius.sm },
    text: typography.bodySmallStrong,
    textColor: colors.textMuted,
  },
  danger: {
    container: {
      height: size.touchMin,
      borderRadius: radius.sm,
      borderWidth: stroke.thin,
      borderColor: colors.danger,
    },
    pressed: { backgroundColor: colors.surfaceRaised },
    text: typography.bodySmallStrong,
    textColor: colors.danger,
  },
};
