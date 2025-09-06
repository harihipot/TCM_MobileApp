import { strings } from "@/src/constants/AppStrings";
import { Colors } from "@/src/constants/Colors";
import { logout } from "@/src/store/reducers/authSlice";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Alert, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { resetAuthToken } from "../utils/storageUtils";
import { persistor } from "@/src/store";

export const LogoutDrawer = (props: any) => {
  const dispatch = useDispatch();
  const performLogout = async () => {
    resetAuthToken();
    dispatch(logout());
    await persistor.purge(); // Clear persisted redux state

    // Instantly reset navigation to login before clearing redux state
    props.navigation.reset({
      index: 0,
      routes: [{ name: "login" }],
    });
  };

  const handleLogout = () => {
    props.navigation.closeDrawer && props.navigation.closeDrawer();
    Alert.alert(
      strings.headers.logout,
      strings.login.logoutConfirmation,
      [
        {
          text: strings.alert.cancel,
          style: "cancel",
        },
        {
          text: strings.alert.ok,
          onPress: performLogout,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label={strings.headers.logout}
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
