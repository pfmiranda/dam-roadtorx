import { StyleSheet, Text, View } from "react-native";
import { colors, radius, space, stroke, typography } from "../theme";

type Props = {
  message: string;
};

// lista vazia com mensagem
export function EmptyState({ message }: Props) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: radius.md,
    padding: space.lg,
  },
  text: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: "center",
  },
});
