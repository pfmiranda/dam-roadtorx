import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, space, stroke, typography } from "../theme";

type CardProps = {
  title?: string;
  //itens do card
  children?: ReactNode;
};

export function Card({ title, children }: CardProps) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: space.lg,
    gap: space.md,
  },
  title: { ...typography.heading, color: colors.text },
});
