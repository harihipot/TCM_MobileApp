import React from "react";

import {
  createDrawerNavigator,
  DrawerToggleButton,
} from "@react-navigation/drawer";
import HomeScreen from "../screens/home/HomeScreen";
import { Colors, strings } from "@/src/constants";
import { createStackNavigator } from "@react-navigation/stack";
import ApplyLeaves from "../screens/leaves/ApplyLeaves";
import LeaveHistory from "../screens/leaves/LeaveHistory";
import ScanQRScreen from "../screens/qr/ScanQRScreen";
import ShowQRScreen from "../screens/qr/ShowQRScreen";
import ViewBills from "../screens/bills/ViewBills";
import BillingHistory from "../screens/bills/BillingHistory";
import ChangePassword from "../screens/login/ChangePassword";
import { LogoutDrawer } from "@/src/components";

import { useSelector } from "react-redux";
import YourMenu from "../screens/menu/YourMenu";
import CreateMenu from "../screens/menu/CreateMenu";
import MealList from "../screens/menu/MealList";
import FoodList from "../screens/menu/FoodList";
import Attendance from "../screens/attendance/Attendance";
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const setOptions = (title: string) => {
  return {
    headerShown: true,
    headerTitle: title,
    headerBackTitle: "",
  };
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={"home"}
      screenOptions={{
        gestureEnabled: false,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.textColor,
        headerTitleStyle: {
          fontWeight: "bold",
          color: Colors.textColor,
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name={"home"}
        component={HomeScreen}
        options={{
          headerShown: true,
          headerTitle: strings.headers.home,
          headerLeft: (props) => (
            <DrawerToggleButton tintColor={Colors.textColor} />
          ),
        }}
      />
      {/* student dashboard menus  */}
      <Stack.Screen
        name={"showQR"}
        component={ShowQRScreen}
        options={setOptions(strings.headers.showQr)}
      />
      <Stack.Screen
        name={"applyLeave"}
        component={ApplyLeaves}
        options={setOptions(strings.headers.applyLeave)}
      />
      <Stack.Screen
        name={"leaveHistory"}
        component={LeaveHistory}
        options={setOptions(strings.headers.leaveHistory)}
      />
      <Stack.Screen
        name={"viewBill"}
        component={ViewBills}
        options={setOptions(strings.headers.viewBill)}
      />

      {/* admin dashboard menu */}
      <Stack.Screen
        name={"sanQR"}
        component={ScanQRScreen}
        options={setOptions(strings.headers.scanQr)}
      />

      <Stack.Screen
        name={"attendanceSubmission"}
        component={Attendance}
        options={setOptions(strings.headers.attendanceSubmission)}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  const user = useSelector((state: any) => state.auth.user);
  const role = user?.role?.name?.toLowerCase();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.textColor,
        headerTitleStyle: {
          fontWeight: "bold",
          color: Colors.textColor,
          fontSize: 20,
        },
        drawerActiveBackgroundColor: Colors.primary,
        drawerLabelStyle: {
          color: Colors.textColor,
          fontSize: 16,
        },
        headerLeft: () =>
          user?.isFirstTimeLogin ? null : (
            <DrawerToggleButton tintColor={Colors.textColor} />
          ),
        swipeEnabled: !user?.isFirstTimeLogin,
      }}
      initialRouteName="Home"
      drawerContent={(props) => <LogoutDrawer {...props} />}
    >
      <Drawer.Screen
        name={strings.headers.home}
        component={HomeStack}
        options={{ headerShown: false }}
      />
      {["student", "admin"].includes(role) && (
        <Drawer.Screen
          name={role === "student" ? strings.headers.yourMenu : "Menu"}
          component={YourMenu}
        />
      )}
      {role === "student" && (
        <Drawer.Screen
          name={strings.headers.billingHistory}
          component={BillingHistory}
        />
      )}
      <Drawer.Screen
        name={strings.headers.changePassword}
        component={ChangePassword}
      />
      {role === "student" && (
        <Drawer.Screen name={strings.headers.contactUs} component={FoodList} />
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
