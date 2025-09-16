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
};

export const Button = (props: ButtonViewProps) => {
  return (
    <Pressable
      style={[styles.containerStyle, props.buttonStyle]}
      onPress={(event) => props.onClick(event)}
    >
      <Text style={[styles.textStyle, props.textStyle]}>{props.label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    width: "40%",
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
    paddingVertical: 10,
  },
});
