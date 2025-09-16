import React from "react";
import { Colors } from "@/src/constants";
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

type cardProps = {
  label: string;
  image: ImageSourcePropType;
  onClick: (event: GestureResponderEvent) => void;
  cardStyle?: StyleProp<ViewStyle>;
};

export const Card = (props: cardProps) => {
  return (
    <Pressable style={styles.containerStyle} onPress={props.onClick}>
      <Image
        source={props.image}
        style={styles.imageStyle}
        resizeMode="contain"
      />
      <Text style={styles.textStyle}>{props.label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    height: 145,
    width: 145,
    alignItems: "center",
    paddingTop: 20,
    backgroundColor: Colors.primary,
    margin: 10,
    borderRadius: 10,
  },
  imageStyle: {
    width: 65,
    height: 65,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textColor,
    marginTop: 10,
    textAlign: "center",
  },
});
