import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Lucide } from "@react-native-vector-icons/lucide";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { startOfDay } from "../features/workouts/dates";
import { colors, radius, size, space, stroke, typography } from "../theme";

export type DateFieldProps = {
  label: string;
  value: Date;
  onChange: (value: Date) => void;
  //limitar data máxima
  maximumDate?: Date;
};

/**
Para campos de datas para ios e android usando o nativo do datepicker
 */
export function DateField({ label, value, onChange, maximumDate }: DateFieldProps) {
  const [open, setOpen] = useState(false);

  // fecha e inicio do dia selecionado
  const handleSelect = (selected: Date) => {
    setOpen(false);
    onChange(startOfDay(selected));
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {Platform.OS === "ios" ? (
        <View style={styles.box}>
          <RNDateTimePicker
            value={value}
            mode="date"
            display="compact"
            themeVariant="dark"
            accentColor={colors.accent}
            maximumDate={maximumDate}
            onValueChange={(_, selected) => handleSelect(selected)}
          />
        </View>
      ) : (
        <>
          <Pressable onPress={() => setOpen(true)} style={[styles.box, styles.pressable]}>
            <Text style={styles.value}>
              {value.toLocaleDateString("pt-PT", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </Text>
            <Lucide name="calendar" size={size.iconMd} color={colors.textMuted} />
          </Pressable>
          {open ? (
            <RNDateTimePicker
              value={value}
              mode="date"
              maximumDate={maximumDate}
              onValueChange={(_, selected) => handleSelect(selected)}
              onDismiss={() => setOpen(false)}
            />
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: space.sm },
  label: { ...typography.label, color: colors.textMuted },
  box: {
    minHeight: size.inputHeight,
    borderWidth: stroke.thin,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: space.sm,
    alignItems: "flex-start",
  },
  pressable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.md,
  },
  value: { ...typography.body, color: colors.text },
  invalid: { borderWidth: stroke.thick, borderColor: colors.danger },
  error: { ...typography.bodySmall, color: colors.danger },
});
