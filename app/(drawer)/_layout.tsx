import { LogoutDrawer } from "@/components/LogoutDrawer";
import { Colors } from "@/constants/Colors";
import { getDrawerMenu, lcFirst } from "@/utils/commonUtils";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";

const DrawerLayout = () => {
  const drawerMenu = getDrawerMenu("student");

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.textColor,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerActiveBackgroundColor: Colors.primary,
        drawerLabelStyle: {
          color: Colors.textColor,
          fontSize: 16,
        },
        headerLeft: () => <DrawerToggleButton tintColor={Colors.textColor} />,
      }}
      drawerContent={(props) => <LogoutDrawer {...props} />}
    >
      {drawerMenu.map((item, index) => (
        <Drawer.Screen
          key={"drawer" + index}
          name={lcFirst(item.replace(/ +/g, ""))}
          options={{
            drawerLabel: item,
            title: item,
          }}
        />
      ))}
    </Drawer>
  );
};

export default DrawerLayout;
