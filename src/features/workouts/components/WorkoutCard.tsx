import { Lucide } from "@react-native-vector-icons/lucide";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { IconButton } from "../../../components/IconButton";
import { colors, opacity, radius, size, space, stroke, typography } from "../../../theme";
import { formatMovementList, formatStructure } from "../rules";
import type { movement, workout } from "../types";

type Props = {
  workout: workout;
  movements: movement[];
  isToday: boolean;
  onPress: () => void;
  onDelete?: () => void;
};

export function WorkoutCard({ workout, movements, isToday, onPress, onDelete }: Props) {
  //estrutura de apresentação visual do workout
  const structure = formatStructure(workout);

  const weekday = workout.date.toLocaleDateString("pt-PT", { weekday: "short" });
  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
      >
        <View style={[styles.date, isToday && styles.today]}>
          <Text style={[styles.dow, isToday && styles.onAccent]}>{isToday ? "Hoje" : weekday}</Text>
          <Text style={[styles.day, isToday && styles.onAccent]}>{workout.date.getDate()}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={1}>
            {workout.name}
          </Text>
          {structure ? (
            <Text style={styles.structure} numberOfLines={1}>
              {structure}
            </Text>
          ) : null}
          <Text style={styles.meta} numberOfLines={1}>
            {formatMovementList(workout, movements)}
          </Text>
        </View>
        {onDelete ? null : (
          <Lucide name="chevron-right" size={size.iconMd} color={colors.textMuted} />
        )}
      </Pressable>
      {onDelete ? <IconButton icon="trash-2" onPress={onDelete} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    backgroundColor: colors.surface,
    borderWidth: stroke.thin,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: space.md,
  },
  main: { flex: 1, flexDirection: "row", alignItems: "center", gap: space.md },
  pressed: { opacity: opacity.pressed },
  date: {
    width: size.dateBlock,
    height: size.dateBlock,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  today: { backgroundColor: colors.accent },
  dow: { ...typography.label, color: colors.textMuted },
  day: { ...typography.numberLg, color: colors.text },
  onAccent: { color: colors.onAccent },
  body: { flex: 1, gap: space.xs },
  name: { ...typography.heading, color: colors.text },
  structure: { ...typography.bodySmallStrong, color: colors.text },
  meta: { ...typography.bodySmall, color: colors.textMuted },
});
