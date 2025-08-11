import { strings } from "@/constants/AppStrings";
import { Colors } from "@/constants/Colors";
import { logout } from "@/store/reducers/authSlice";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Alert, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";

export const LogoutDrawer = (props: any) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const performLogout = () => {
    dispatch(logout());
    // Logic to perform logout, e.g., clearing user data, tokens, etc.
    // After logout, navigate to the login screen or home screen
    router.replace("/(auth)");
  };

  const handleLogout = () => {
    props.navigation.closeDrawer && props.navigation.closeDrawer();
    Alert.alert(
      strings.login.logoutText,
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
        label={strings.login.logoutText}
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
