import React, { useEffect } from "react";
import { Card } from "@/src/components";
import { getDashboardMenu } from "../../utils/commonUtils";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import Snackbar from "react-native-snackbar";
import { Colors, strings } from "@/src/constants";
import { init as initDB } from "@/src/utils/databaseUtils";

const HomeScreen = (props: any) => {
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    if (user?.role?.name === "admin") {
      initDB().catch((err) => {
        Snackbar.show({
          text: err.message || strings.errors.failedInitDB,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: Colors.errorRed,
        });
      });
    }
  }, [user]);

  const menu = getDashboardMenu(user?.role?.name);

  const cardClick = (cardItem: any) => {
    if (cardItem.label === "View Bill" && cardItem.isDisable) {
      Snackbar.show({
        text: strings.common.viewBillDisableText,
        duration: Snackbar.LENGTH_LONG,
        textColor: Colors.textColor,
        backgroundColor: Colors.primary,
      });
      return;
    }
    props.navigation.navigate(cardItem.route);
  };

  return (
    <SafeAreaView>
      <View style={styles.menuContainerStyle}>
        {menu.map((item, index) => (
          <View key={"menu" + index} style={styles.menuColumnStyle}>
            <Card
              label={item.label}
              image={item.image}
              onClick={() => cardClick(item)}
              cardStyle={item.isDisable ? styles.disableCardStyle : {}}
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
  disableCardStyle: {
    backgroundColor: "#D3D3D3", // Light gray
    opacity: 0.7, // Reduce opacity for a disabled look
  },
});
export default HomeScreen;
