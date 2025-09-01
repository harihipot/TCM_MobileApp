import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/login/LoginScreen";
import DrawerNavigator from "./DrawerNavigator";

const Stack = createStackNavigator();
const RootStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={"login"}
      screenOptions={{
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name={"login"}
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"drawer"}
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const RootNavigation = (props: any) => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};

export default RootNavigation;
