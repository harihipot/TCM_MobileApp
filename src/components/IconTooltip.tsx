import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/src/constants";

interface IconTooltipProps {
  iconName: keyof typeof MaterialIcons.glyphMap;
  tooltipContent: string;
  iconSize?: number;
  iconColor?: string;
  style?: ViewStyle;
  tooltipStyle?: TextStyle;
}

export const IconTooltip: React.FC<IconTooltipProps> = ({
  iconName,
  tooltipContent,
  iconSize = 24,
  iconColor = Colors.primary,
  style,
  tooltipStyle,
}) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPressIn={() => setVisible(!visible)}
      >
        <MaterialIcons name={iconName} size={iconSize} color={iconColor} />
      </TouchableOpacity>
      {visible && (
        <View style={styles.tooltipBox}>
          <Text style={[styles.tooltipText, tooltipStyle]}>
            {tooltipContent}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  tooltipBox: {
    position: "absolute",
    bottom: "100%", // Always above the icon
    right: 0, // Align to right
    // No horizontal transform
    minWidth: 120,
    maxWidth: 200,
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 6,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    // Height will auto-adjust based on content
  },
  tooltipText: {
    color: Colors.textColor,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
