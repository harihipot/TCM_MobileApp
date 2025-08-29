import { Button } from "@/components/Button";
import { Colors } from "@/constants/Colors";
import { CameraView, useCameraPermissions } from "expo-camera";
import { StyleSheet, Text, View } from "react-native";

const ScanQRScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onClick={requestPermission} label="grant permission" />
      </View>
    );
  }
  const handleBarCodeScanned = () => {};

  return (
    <View style={styles.container}>
      <View>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={handleBarCodeScanned}
          facing={"back"}
        />
      </View>
      <Text style={styles.text}>Scan QR code to mark attendance</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    width: 300,
    height: 300,
  },

  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 30,
    marginTop: 40,
    color: Colors.textColor,
  },
});

export default ScanQRScreen;
