import React from "react";
import { Colors } from "@/src/constants";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export const Loader = (props: any) => {
  return (
    <View style={styles.loaderContainerStyle}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainerStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
    zIndex: 999,
  },
});
