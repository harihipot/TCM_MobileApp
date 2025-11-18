import Images from "@/assets/images";
import { Colors } from "@/src/constants";
import { mealItemBasedOnNow } from "@/src/utils/commonUtils";
import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSelector } from "react-redux";

const ShowQRScreen = () => {
  const mealsList = useSelector((state: any) => state.meals.mealsList);
  const user = useSelector((state: any) => state.auth.user);
  const currentMeal = mealItemBasedOnNow(mealsList);

  return (
    <SafeAreaView style={styles.containerStyle}>
      <Text style={[styles.textStyle, styles.nameStyle]}>
        {user?.firstName + " " + user?.lastName}
        {"\n\n"}
        {user?.rollNo}
      </Text>
      <QRCode
        value={`${user?.messNo}&${user?.id}`}
        color={Colors.primary}
        logo={Images.roundIcon}
        logoSize={60}
        logoBackgroundColor="transparent"
        size={300}
      />
      <Text style={[styles.textStyle, styles.studentIdStyle]}>
        {currentMeal?.name}
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
    marginBottom: 30,
  },
  studentIdStyle: {
    marginTop: 30,
  },
});
export default ShowQRScreen;
