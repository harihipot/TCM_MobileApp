import { Button } from "@/src/components";
import { Colors, strings } from "@/src/constants";
import { mealItemBasedOnNow } from "@/src/utils/commonUtils";
import { insertMealEntry } from "@/src/utils/databaseUtils";
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
import { useSelector } from "react-redux";

const ScanQRScreen: React.FC = () => {
  const mealsList = useSelector((state: any) => state.meals.mealsList);

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const insertMealEntryRef = useRef<any>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // keep last scanned raw data to avoid processing the same QR repeatedly
  const lastScannedRef = useRef<string | null>(null);

  const currentMeal = mealItemBasedOnNow(mealsList);

  // Example QR: "userID|mealD" (customize parsing as needed)
  const handleBarCodeScanned = useCallback(
    async (result: { data: string }) => {
      if (scanned) return;

      // Defensive: trim and validate
      const raw = result.data?.trim?.() || "";

      // If the same QR was just scanned, ignore it to avoid duplicate processing
      if (raw && lastScannedRef.current === raw) {
        // show a small feedback for duplicate-scans (uses existing duplicate string)
        Snackbar.show({
          text: strings.qr.duplicate,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: Colors.errorRed,
        });
        return;
      }

      // mark scanning started and remember raw value
      setScanned(true);
      lastScannedRef.current = raw;

      const [messNo, userID] = raw.split("&").map((v) => v?.trim?.() || "");

      if (!userID || !currentMeal?.id) {
        Snackbar.show({
          text: strings.qr.invalidFormat,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: Colors.errorRed,
        });
        setScanned(false);
        return;
      }
      try {
        insertMealEntry(userID, currentMeal?.id).then(() => {
          Snackbar.show({
            text: strings.qr.saved,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: Colors.primary,
          });
        });
        // store timeout so we can clear it on unmount to avoid setting state
        // also clear the remembered lastScanned after the same interval so the
        // same QR can be scanned again later if needed
        resetTimeoutRef.current = setTimeout(() => {
          setScanned(false);
          lastScannedRef.current = null;
        }, 1200);
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
        // keep the lastScannedRef populated for the same cooldown to avoid
        // immediate re-processing; set a timeout to clear it similar to the
        // success path
        if (resetTimeoutRef.current)
          clearTimeout(resetTimeoutRef.current as any);
        resetTimeoutRef.current = setTimeout(() => {
          setScanned(false);
          lastScannedRef.current = null;
        }, 1200);
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
      <Text style={styles.mealText}>
        {currentMeal.name + "\n\n" + currentMeal.timing}
      </Text>
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
    paddingTop: "20%",
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
  mealText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 20,
  },
});

export default React.memo(ScanQRScreen);
