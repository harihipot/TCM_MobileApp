import { useEffect, useState } from "react";
import { Platform, useColorScheme } from "react-native";

export const useColorSchemeState = (): boolean => {
  const systemColorScheme = useColorScheme();

  const [isDark, setIsDarak] = useState(() => {
    if (Platform.OS === "web") {
      const stored = localStorage.getItem("colorScheme");
      return stored ? stored === " dark" : systemColorScheme === "dark";
    }
    return systemColorScheme === "dark";
  });

  useEffect(() => {
    if (Platform.OS === "web") {
      const handleColorSchemeEvent = (event: CustomEvent) => {
        setIsDarak(event.detail.colorScheme === "dark");
      };

      window.addEventListener(
        "colorSchemeChange",
        handleColorSchemeEvent as EventListener
      );
      return () => {
        window.removeEventListener(
          "colorSchemeChange",
          handleColorSchemeEvent as EventListener
        );
      };
    }
  }, []);
  useEffect(() => {
    if (Platform.OS === "web") {
      setIsDarak(systemColorScheme === "dark");
    }
  }, [systemColorScheme]);

  return isDark;
};
