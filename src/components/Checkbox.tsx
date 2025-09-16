import React from "react";
import { Pressable, View, StyleSheet, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/src/constants";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled,
}) => {
  return (
    <Pressable
      style={styles.container}
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      <View
        style={[
          styles.box,
          checked && styles.checkedBox,
          disabled && styles.disabledBox,
        ]}
      >
        {checked && <MaterialIcons name="check" size={20} color="#fff" />}
      </View>
      {label ? (
        <Text style={[styles.label, disabled && styles.disabledLabel]}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 6,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  disabledBox: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    color: "#222",
  },
  disabledLabel: {
    color: "#aaa",
  },
});
