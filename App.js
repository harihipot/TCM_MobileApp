import { useColorSchemeState } from "@/hooks";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Provider } from "react-redux";
import store from "./src/store";
import RootNavigation from "./src/navigation/RootNavigator";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isDark = useColorSchemeState();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <RootNavigation />
        <StatusBar style="auto" /> 
      </ThemeProvider>
    </Provider>
  );
}
