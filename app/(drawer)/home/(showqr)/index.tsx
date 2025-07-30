import { roundIcon } from "@/assets/images";
import { Colors } from "@/constants/Colors";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";

const ShowQRScreen = () => {
  return (
    <SafeAreaView style={styles.containerStyle}>
      <Text style={[styles.textStyle, styles.nameStyle]}>Hariharan S</Text>
      <QRCode
        value="http://awesome.link.qr"
        color={Colors.primary}
        logo={roundIcon}
        logoSize={60}
        logoBackgroundColor="transparent"
        size={300}
      />
      <Text style={[styles.textStyle, styles.studentIdStyle]}>
        Mess ID: 2189759
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
  },
  nameStyle: {
    marginBottom: 50,
  },
  studentIdStyle: {
    marginTop: 50,
  },
});
export default ShowQRScreen;
