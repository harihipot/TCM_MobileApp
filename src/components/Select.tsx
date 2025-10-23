import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Colors } from "../constants";

interface SelectProps {
  title: string;
  options: Array<{ label: string; value: string }>; // dropdown options
  selectedValue: string;
  onValueChange: (value: string) => void;
  style?: object;
  errorMessage?: string;
}

const Select: React.FC<SelectProps> = ({
  title,
  options,
  selectedValue,
  onValueChange,
  style,
  errorMessage,
}) => {
  const [showOptions, setShowOptions] = React.useState(false);
  const selectedLabel =
    options.find((o) => o.value === selectedValue)?.label || "Select";

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowOptions((prev) => !prev)}
      >
        <View style={styles.dropdownRow}>
          <Text style={styles.selectedText}>{selectedLabel}</Text>
          <Text style={styles.arrow}>{showOptions ? "\u25B2" : "\u25BC"}</Text>
        </View>
      </TouchableOpacity>
      {showOptions && (
        <ScrollView style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.option}
              onPress={() => {
                onValueChange(option.value);
                setShowOptions(false);
              }}
            >
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {errorMessage && errorMessage !== "" && (
        <Text style={styles.errorStyle}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrow: {
    fontSize: 18,
    marginLeft: 8,
    color: Colors.primary,
  },
  optionsContainer: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    zIndex: 10,
    elevation: 5,
    maxHeight: 200,
    overflow: "scroll",
  },
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  selectedText: {
    fontSize: 16,
    color: Colors.textColor,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    minWidth: 200,
    maxHeight: 300,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  errorStyle: {
    fontSize: 14,
    color: Colors.errorRed,
    paddingTop: 4,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    marginLeft: 4,
  },
});

export default Select;
