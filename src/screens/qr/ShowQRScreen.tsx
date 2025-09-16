import { roundIcon } from "@/assets/images";
import { Colors } from "@/src/constants";
import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSelector } from "react-redux";

const ShowQRScreen = () => {
  const user = useSelector((state: any) => state.auth.user);

  return (
    <SafeAreaView style={styles.containerStyle}>
      <Text style={[styles.textStyle, styles.nameStyle]}>
        {user.firstName + " " + user.lastName}
        {"\n\n"}
        {user.rollNo}
      </Text>
      <QRCode
        value={`${user.rollNo}&${user.messNo}&${user.firstName}&${user.batch}`}
        color={Colors.primary}
        logo={roundIcon}
        logoSize={60}
        logoBackgroundColor="transparent"
        size={300}
      />
      <Text style={[styles.textStyle, styles.studentIdStyle]}>
        Mess ID: {user.messNo}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textColor,
    textAlign: "center",
  },
  nameStyle: {
    marginBottom: 50,
  },
  studentIdStyle: {
    marginTop: 50,
  },
});
export default ShowQRScreen;
