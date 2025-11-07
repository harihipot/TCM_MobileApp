import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Alert } from "react-native";
import { init as initDB, getAllMealEntries } from "@/src/utils/databaseUtils";
import { Button, Loader } from "@/src/components";
import { Colors, strings } from "@/src/constants";
import { clearAllMealEntries } from "@/src/utils/databaseUtils";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "react-native-snackbar";
import {
  submitAttendance,
  resetAttendanceState,
} from "@/src/store/reducers/attendanceSlice";

const Attendance = (props: any) => {
  const [mealEntries, setMealEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const items = await getAllMealEntries();
      // ensure we have an array
      setMealEntries(Array.isArray(items) ? items : []);
    } catch (err: any) {
      Alert.alert(strings.alert.error, err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initialize DB (safe if already initialized)
    initDB().catch((err: any) => {
      Alert.alert(strings.alert.error, err?.message ?? String(err));
    });
    loadEntries();
  }, []);

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const attendanceState = useSelector((state: any) => state.attendance);
  useEffect(() => {
    if (attendanceState?.submitResp) {
      Snackbar.show({
        text: attendanceState.submitResp?.message || strings.attendance.submitted,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Colors.primary,
      });

      // clear local DB entries, then reset state and reload entries
      (async () => {
        try {
          await clearAllMealEntries();
        } catch (e) {
          // ignore clear errors but log
          console.warn("Failed to clear local meal entries", e);
        }
        dispatch(resetAttendanceState());
        loadEntries();
      })();
    }
    if (attendanceState?.error) {
      Snackbar.show({
        text:
          attendanceState.error?.toString() || strings.attendance.failedSubmit,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Colors.errorRed,
      });
      dispatch(resetAttendanceState());
    }
  }, [attendanceState]);

  const onMarkAttendance = () => {
    if (!mealEntries || mealEntries.length === 0) {
      Alert.alert(strings.attendance.noEntries, strings.attendance.noEntries);
      return;
    }

    if (!user || !user.id) {
      Alert.alert(strings.alert.error, "User not available");
      return;
    }

    Alert.alert(
      strings.alert.confirm,
      strings.attendance.confirmSubmit(mealEntries.length),
      [
        { text: strings.alert.cancel, style: "cancel" },
        {
          text: strings.common.submit,
          onPress: () => {
            // build payload
            const attendances = mealEntries.map((m: any) => ({
              date: m.mealD, // local DB stores mealD
              mealId: m.id,
              userId: user.id,
            }));
            const payload = {
              attendances,
              createdBy: user.id,
            };
            dispatch(submitAttendance(payload));
          },
        },
      ]
    );
  };

  const mealCount = mealEntries?.length ?? 0;
  const mealIds = mealEntries.map((m: any) => m.id).join(", ");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>{strings.attendance.totalMealEntries}</Text>
        <Text style={styles.value}>{mealCount}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>{strings.attendance.mealIds}</Text>
        <Text style={styles.value}>{mealIds || strings.attendance.noEntriesFound}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button label={strings.attendance.markAttendance} onClick={onMarkAttendance} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.white,
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  value: {
    color: Colors.textColor,
    fontSize: 16,
    fontWeight: "700",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default Attendance;
