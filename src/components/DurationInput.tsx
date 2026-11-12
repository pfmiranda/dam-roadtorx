import { StyleSheet, Text, View } from "react-native";
import { colors, size, space, typography } from "../theme";
import { NumberInput } from "./NumberInput";

type DurationInputProps = {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
};

// recebe valor e parte em minutos e segundos
export function DurationInput({ value, onChange, invalid }: DurationInputProps) {
  const [minutes = "", seconds = ""] = value.split(":");

  const update = (m: string, s: string) => onChange(m === "" && s === "" ? "" : `${m}:${s}`);

  return (
    <View style={styles.row}>
      <NumberInput
        value={minutes}
        onChangeText={(m) => update(m, seconds)}
        placeholder="min"
        invalid={invalid}
        style={styles.part}
      />
      <Text style={styles.colon}>:</Text>
      <NumberInput
        value={seconds}
        onChangeText={(s) => update(minutes, s)}
        placeholder="sec"
        invalid={invalid}
        style={styles.part}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.xs },
  part: { width: size.durationPart },
  colon: { ...typography.numberSm, color: colors.textMuted },
});
