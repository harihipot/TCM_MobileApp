import { MaterialIcons } from "@expo/vector-icons";
import {
  EmptyView,
  FabButton,
  Loader,
  Checkbox,
  Button,
} from "@/src/components";
import { Colors, strings } from "@/src/constants";
import {
  cancelLeave,
  leaveHistory,
  resetLeaveState,
} from "@/src/store/reducers/leaveSlice";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

type leaveData = {
  id: number;
  date: string;
  isActive: boolean;
};

const LeaveHistory = (props: any) => {
  const dispatch = useDispatch();
  const [leaveData, setLeaveData] = useState<leaveData[]>([]); // Placeholder for billing history data
  const [refreshing, setRefreshing] = useState(false);
  const [isMulipleSelect, setIsMulipleSelect] = useState(false);
  const [selectedLeaves, setSelectedLeaves] = useState<number[]>([]);
  const user = useSelector((state: any) => state.auth.user);
  const leavesState = useSelector((state: any) => state.leave);
  const { isLoading, leaveHistoryResp, cancelLeaveResponse } = leavesState;

  const fetchLeaveHistory = () => {
    const startOfMonth = moment().add(1, "days").format("YYYY-MM-DD");
    const endOfMonth = moment().add(30, "days").format("YYYY-MM-DD");

    dispatch(
      leaveHistory({
        userId: user.id,
        fromDate: startOfMonth,
        toDate: endOfMonth,
      })
    );
  };

  useEffect(() => {
    fetchLeaveHistory();
    const unsubscribe = props.navigation.addListener("beforeRemove", () => {
      dispatch(resetLeaveState());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (leaveHistoryResp && Array.isArray(leaveHistoryResp)) {
      setLeaveData(leaveHistoryResp);
    }
    setRefreshing(false);
  }, [leaveHistoryResp]);

  useEffect(() => {
    if (
      cancelLeaveResponse &&
      cancelLeaveResponse.toString().includes("successfully")
    ) {
      Alert.alert(strings.alert.success, cancelLeaveResponse, [
        {
          text: "OK",
          onPress: () => {
            dispatch(resetLeaveState());
            setIsMulipleSelect(false);
            setSelectedLeaves([]);
            fetchLeaveHistory();
          },
        },
      ]);
    }
  }, [cancelLeaveResponse]);

  const handleAddLeave = (event: GestureResponderEvent) => {
    props.navigation.navigate("applyLeave" as never);
  };

  const cancelLeaveAction = (leaveId: number) => {
    const cancelLeaveObj = {
      userId: user.id,
      leaveIds: [leaveId],
    };
    dispatch(cancelLeave(cancelLeaveObj));
  };

  const onLongPress = (item: any) => {
    setIsMulipleSelect(true);
    setSelectedLeaves((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaveHistory();
  };

  const onCheckboxChange = (item: any) => {
    setSelectedLeaves((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id]
    );
  };

  // Automatically exit multiple select mode when no items are selected
  useEffect(() => {
    if (isMulipleSelect && selectedLeaves.length === 0) {
      setIsMulipleSelect(false);
    }
  }, [selectedLeaves, isMulipleSelect]);

  const isSelected = (id: number) => selectedLeaves.includes(id);

  const onMultipleLeaveCancel = () => {
    const cancelLeaveObj = {
      userId: user.id,
      leaveIds: selectedLeaves,
    };
    dispatch(cancelLeave(cancelLeaveObj));
  };

  const renderLeaveItem = ({ item }: { item: leaveData }) => {
    return (
      <Pressable
        onLongPress={() => onLongPress(item)}
        style={styles.itemContainer}
      >
        {item.isActive && isMulipleSelect && selectedLeaves.length > 0 && (
          <Checkbox
            checked={isSelected(item.id)}
            onChange={() => onCheckboxChange(item)}
          />
        )}
        <View style={isMulipleSelect ? { flex: 1, marginLeft: 30 } : {}}>
          <Text style={styles.labelStyle}>{strings.leave.date}</Text>
          <Text style={styles.dateStyle}>{item.date}</Text>
        </View>
        <Text style={styles.labelStyle}>
          {item.isActive ? strings.leave.active : strings.leave.cancelled}
        </Text>
        {!isMulipleSelect && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={(e) => {
              // e.stopPropagation && e.stopPropagation();
              cancelLeaveAction(item.id);
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="cancel" size={22} color={Colors.primary} />
            <Text style={styles.cancelText}>{strings.alert.cancel}</Text>
          </TouchableOpacity>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && !refreshing && <Loader />}
      <>
        {isMulipleSelect && selectedLeaves?.length > 0 && (
          <Button
            onClick={onMultipleLeaveCancel}
            label={`${strings.alert.cancel} (${selectedLeaves.length})`}
            buttonStyle={styles.cancelMultiple}
          />
        )}
        {!isLoading && leaveData?.length > 0 && !isMulipleSelect && (
          <Text style={styles.multiSelectInfo}>
            hold long press to select multiple leaves
          </Text>
        )}

        <FlatList
          data={leaveData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLeaveItem}
          ListEmptyComponent={
            leaveData.length === 0 && !isLoading ? (
              <EmptyView message="No leaves available." />
            ) : null
          }
          scrollEnabled={leaveData.length > 0}
          contentContainerStyle={styles.contentContainerStyle}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />

        <FabButton onPress={handleAddLeave} />
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: Colors.white,
  },
  itemContainer: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contentContainerStyle: { paddingBottom: "32%" },
  cancelButton: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  cancelText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 8,
  },
  labelStyle: {
    fontSize: 16,
    color: Colors.textColor,
    fontWeight: "bold",
  },
  dateStyle: {
    fontSize: 16,
    color: Colors.textColor,
  },
  cancelMultiple: {
    backgroundColor: Colors.primary,
    margin: 16,
    alignSelf: "flex-end",
    paddingHorizontal: 2,
  },
  multiSelectInfo: {
    textAlign: "center",
    fontStyle: "italic",
    fontSize: 16,
    marginBottom: 8,
    color: Colors.textColor,
  },
});

export default LeaveHistory;
