import EmptyView from "@/src/components/EmptyView";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

type BillingData = {
  id: number;
  date: string;
  amount: string;
};

const BillingHistory = () => {
  const [billingData, setBillingData] = useState<BillingData[]>([]); // Placeholder for billing history data
  return (
    <View style={styles.container}>
      <FlatList
        data={billingData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.date}</Text>
            <Text>{item.amount}</Text>
          </View>
        )}
        ListEmptyComponent={
          <EmptyView message="No billing history available." />
        }
        contentContainerStyle={{ flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BillingHistory;
