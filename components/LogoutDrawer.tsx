import { Colors } from "@/constants/Colors";
import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

export const LogoutDrawer = (props: any) => {
  const router = useRouter();
  const handleLogout = () => {
    router.replace("/(auth)");
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label={"Logout"}
        onPress={handleLogout}
        labelStyle={styles.textStyle}
      />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 16,
    color: Colors.textColor,
  },
});
