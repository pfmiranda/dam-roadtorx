import { StyleSheet, Text, View } from "react-native";
import { colors, space, typography } from "../theme";
import type { IconName } from "./Button";
import { IconButton } from "./IconButton";
import { SafeAreaView } from "react-native-safe-area-context";

type HeaderAction = {
  icon: IconName;
  label: string;
  onPress: () => void;
};

type HeaderProps = {
  title: string;
  //Info por cima de titulo
  eyebrow?: string;
  left?: HeaderAction;
  right?: HeaderAction;
};

export function AppHeader({ title, eyebrow, left, right }: HeaderProps) {
  return (
    <SafeAreaView edges={["top"]} style={[styles.header]}>
      {left ? <IconButton icon={left.icon} onPress={left.onPress} /> : null}
      <View style={styles.text}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.display} numberOfLines={1}>
          {title}
        </Text>
      </View>
      {right ? <IconButton icon={right.icon} onPress={right.onPress} /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: space.xl,
    paddingBottom: space.lg,
    backgroundColor: colors.background,
  },
  text: { flex: 1 },
  eyebrow: { ...typography.eyebrow, color: colors.textMuted },
  display: { ...typography.display, color: colors.text },
});
