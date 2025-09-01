import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/src/constants/Colors";

interface FabButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  iconName?: keyof typeof MaterialIcons.glyphMap;
}

const FabButton: React.FC<FabButtonProps> = ({ onPress, iconName = "add" }) => {
  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialIcons name={iconName} size={56 * 0.5} color={Colors.textColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: Colors.primary,
    borderRadius: 28,
    padding: 14,
    bottom: 80,
    right: 25,
    elevation: 5,
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
});

export default FabButton;
