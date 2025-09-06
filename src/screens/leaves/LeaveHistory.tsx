import { MaterialIcons } from "@expo/vector-icons";
import EmptyView from "@/src/components/EmptyView";
import FabButton from "@/src/components/FabButton";
import { Loader } from "@/src/components/Loader";
import { Colors } from "@/src/constants/Colors";
import { leaveHistory } from "@/src/store/reducers/leaveSlice";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "@/src/components/Checkbox";
import { Button } from "@/src/components/Button";
import { strings } from "@/src/constants/AppStrings";

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
  const leavesResponse = useSelector((state: any) => state.leave);
  const { isLoading, leaveHistoryResp } = leavesResponse;

  const fetchLeaveHistory = () => {
    const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
    const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
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
  }, []);

  useEffect(() => {
    if (leaveHistoryResp && Array.isArray(leaveHistoryResp)) {
      setLeaveData(leaveHistoryResp);
    }
    setRefreshing(false);
  }, [leaveHistoryResp]);

  const handleAddLeave = (event: GestureResponderEvent) => {
    props.navigation.navigate("applyLeave" as never);
  };

  const cancelLeave = (leaveId: number) => {
    // Implement cancel leave logic here

    console.log("Cancel leave with ID:", leaveId);
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
    console.log("s", selectedLeaves);

    // cancelLeave(0);
    // setIsMulipleSelect(false);
    // setSelectedLeaves([]);
  };
  const renderLeaveItem = ({ item }: { item: leaveData }) => {
    return (
      <Pressable onLongPress={() => onLongPress(item)}>
        <View style={styles.itemContainer}>
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
            <Pressable
              style={styles.cancelButton}
              onPress={() => cancelLeave(item.id)}
            >
              <MaterialIcons name="cancel" size={22} color={Colors.primary} />
              <Text style={styles.cancelText}>{strings.alert.cancel}</Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && !refreshing ? (
        <Loader />
      ) : (
        <>
          {isMulipleSelect && selectedLeaves.length > 0 && (
            <Button
              onClick={onMultipleLeaveCancel}
              label={`${strings.alert.cancel} (${selectedLeaves.length})`}
              buttonStyle={styles.cancelMultiple}
            />
          )}
          <FlatList
            data={leaveData}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderLeaveItem}
            ListEmptyComponent={<EmptyView message="No leaves available." />}
            scrollEnabled={leaveData.length > 0}
            contentContainerStyle={styles.contentContainerStyle}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
          <FabButton onPress={handleAddLeave} />
        </>
      )}
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
});

export default LeaveHistory;
