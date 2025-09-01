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

export const LogoutDrawer = (props: any) => {
  const dispatch = useDispatch();
  const performLogout = () => {
    dispatch(logout());
    resetAuthToken()
    props.navigation.navigate('login')
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
