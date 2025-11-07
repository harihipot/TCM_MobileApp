import { Button } from "@/src/components";
import { Colors, strings } from "@/src/constants";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import Snackbar from "react-native-snackbar";

const ScanQRScreen: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const insertMealEntryRef = useRef<any>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Example QR: "userID|mealD" (customize parsing as needed)
  const handleBarCodeScanned = useCallback(
    async (result: { data: string }) => {
      if (scanned) return;
      setScanned(true);
      // Defensive: trim and validate
      const raw = result.data?.trim?.() || "";
      const [userID, mealD] = raw.split("|").map((v) => v?.trim?.() || "");
      if (!userID || !mealD) {
        Snackbar.show({
          text: strings.qr.invalidFormat,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: Colors.errorRed,
        });
        setScanned(false);
        return;
      }
      try {
        // Import only once for performance
        if (!insertMealEntryRef.current) {
          const mod = await import("@/src/utils/databaseUtils");
          insertMealEntryRef.current = mod.insertMealEntry;
        }
        await insertMealEntryRef.current(userID, mealD);
        Snackbar.show({
          text: strings.qr.saved,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: Colors.primary,
        });
        // store timeout so we can clear it on unmount to avoid setting state
        resetTimeoutRef.current = setTimeout(() => setScanned(false), 1200);
      } catch (err: any) {
        if (err.message && err.message.includes("Duplicate entry")) {
          Snackbar.show({
            text: strings.qr.duplicate,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: Colors.errorRed,
          });
        } else {
          Snackbar.show({
            text: err.message || strings.qr.failed,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: Colors.errorRed,
          });
        }
        setScanned(false);
      }
    },
    [scanned]
  );

  // memoize scanner settings to avoid object re-creation every render
  const scannerSettings = useMemo(() => ({ barcodeTypes: ["qr"] as any }), []);

  // clear pending timeout on unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current as any);
        resetTimeoutRef.current = null;
      }
    };
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{strings.qr.needPermission}</Text>
        <Button
          onClick={requestPermission}
          label={strings.qr.grantPermission}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={scannerSettings}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        facing={"back"}
      />
      <Text style={styles.text}>
        {scanned ? strings.qr.processing : strings.qr.scanPrompt}
      </Text>
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

export default React.memo(ScanQRScreen);
