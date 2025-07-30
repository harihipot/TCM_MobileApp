import { Card } from "@/components/Card";
import { getDashboardMenu } from "@/utils/commonUtils";
import { useRouter } from "expo-router";

import { SafeAreaView, StyleSheet, View } from "react-native";
const HomeScreen = () => {
  const router = useRouter();
  const menu = getDashboardMenu("student");
  return (
    <SafeAreaView>
      <View style={styles.menuContainerStyle}>
        {menu.map((item, index) => (
          <View key={"menu" + index} style={styles.menuColumnStyle}>
            <Card
              label={item.label}
              image={item.image}
              onClick={() => router.navigate(item.route)}
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  menuContainerStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 30,
  },
  menuColumnStyle: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});
export default HomeScreen;
