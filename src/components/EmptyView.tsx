import Images from "@/assets/images";
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface EmptyViewProps {
  message: string;
}

export const EmptyView: React.FC<EmptyViewProps> = ({ message }) => (
  <View style={styles.container}>
    <Image
      source={Images.greyedLogo}
      style={styles.image}
      resizeMode="contain"
    />
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "60%",
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});
