import { Lucide } from "@react-native-vector-icons/lucide";
import { Pressable, StyleSheet } from "react-native";
import { colors, radius, size, stroke } from "../theme";
import type { IconName } from "./Button";

type IconButtonProps = {
  icon: IconName;
  onPress: () => void;
};

export function IconButton({ icon, onPress }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Lucide name={icon} size={size.iconMd} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: size.touchMin,
    height: size.touchMin,
    borderRadius: radius.sm,
    borderWidth: stroke.thin,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    backgroundColor: colors.surfaceRaised,
  },
});
