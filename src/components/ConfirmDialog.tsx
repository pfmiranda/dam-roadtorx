import { Modal, StyleSheet, Text, View } from "react-native";
import { colors, radius, space, stroke, typography } from "../theme";
import { Button } from "./Button";

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.scrim}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <View style={styles.action}>
              <Button label="Cancelar" variant="secondary" onPress={onCancel} />
            </View>
            <View style={styles.action}>
              <Button label={confirmLabel} variant="danger" onPress={onConfirm} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: colors.scrim,
    justifyContent: "center",
    padding: space.xl,
  },
  dialog: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: stroke.thin,
    borderColor: colors.border,
    padding: space.xl,
    gap: space.md,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: "row",
    gap: space.md,
    marginTop: space.sm,
  },
  action: {
    flex: 1,
  },
});
