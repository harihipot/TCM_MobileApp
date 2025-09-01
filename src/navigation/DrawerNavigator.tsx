import {
  createDrawerNavigator,
  DrawerToggleButton,
} from "@react-navigation/drawer";
import HomeScreen from "../screens/home/HomeScreen";
import { Colors } from "@/src/constants/Colors";
import { createStackNavigator } from "@react-navigation/stack";
import ApplyLeaves from "../screens/leaves/ApplyLeaves";
import LeaveHistory from "../screens/leaves/leaveHistory/LeaveHistory";
import ScanQRScreen from "../screens/qr/ScanQRScreen";
import ShowQRScreen from "../screens/qr/ShowQRScreen";
import ViewBills from "../screens/bills/ViewBills";
import BillingHistory from "../screens/bills/BillingHistory";
import ChangePassword from "../screens/login/ChangePassword";
import { LogoutDrawer } from "@/src/components/LogoutDrawer";
import { strings } from "../constants/AppStrings";
import { useSelector } from "react-redux";
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
        name={"leaveDetails"}
        component={LeaveHistory}
        options={setOptions(strings.headers.leaveDetails)}
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
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  const user = useSelector((state: any) => state.auth.user);

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
          fontSize: 18,
        },
        drawerActiveBackgroundColor: Colors.primary,
        drawerLabelStyle: {
          color: Colors.textColor,
          fontSize: 16,
        },
        headerLeft: () => <DrawerToggleButton tintColor={Colors.textColor} />,
      }}
      initialRouteName="Home"
      drawerContent={(props) => <LogoutDrawer {...props} />}
    >
      <Drawer.Screen
        name={strings.headers.home}
        component={HomeStack}
        options={{ headerShown: false }}
      />
      {user?.role?.name === "student" && (
        <Drawer.Screen
          name={strings.headers.billingHistory}
          component={BillingHistory}
        />
      )}
      <Drawer.Screen
        name={strings.headers.changePassword}
        component={ChangePassword}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
