import EmptyView from "@/components/EmptyView";
import FabButton from "@/components/FabButton";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  GestureResponderEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";

type leaveData = {
  id: number;
  date: string;
  amount: string;
};

const LeaveHistory = () => {
  const router = useRouter();
  const [leaveData, setLeaveData] = useState<leaveData[]>([]); // Placeholder for billing history data

  const handleAddLeave = (event: GestureResponderEvent) => {
    // Logic to add a new leave entry
    router.navigate("/(drawer)/home/(applyleave)");
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        data={leaveData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.date}</Text>
            <Text>{item.amount}</Text>
          </View>
        )}
        ListEmptyComponent={<EmptyView message="No leaves available." />}
        contentContainerStyle={{ flex: 1 }}
      />
      <FabButton onPress={handleAddLeave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LeaveHistory;
