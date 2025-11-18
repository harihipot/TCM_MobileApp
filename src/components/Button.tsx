import React from "react";
import { Colors } from "@/src/constants";
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

type ButtonViewProps = {
  label: string;
  onClick: (event: GestureResponderEvent) => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

export const Button = (props: ButtonViewProps) => {
  return (
    <Pressable
      style={[
        styles.containerStyle,
        props.buttonStyle,
        props.disabled && styles.disabledContainerStyle,
      ]}
      onPress={(event) => props.onClick(event)}
      disabled={props.disabled}
    >
      <Text
        style={[
          styles.textStyle,
          props.textStyle,
          props.disabled && styles.disabledTextStyle,
        ]}
      >
        {props.label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    width: "43%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: Colors.primary,
    marginTop: 10,
    borderRadius: 10,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textColor,
    paddingVertical: 12,
  },
  disabledContainerStyle: {
    opacity: 0.6,
    backgroundColor: "#d3d3d3",
  },
  disabledTextStyle: {
    color: "#bdbdbd",
  },
});
