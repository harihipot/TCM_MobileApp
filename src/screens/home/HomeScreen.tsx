import React, { useEffect } from "react";
import { Card } from "@/src/components";
import { getDashboardMenu, pickMealForNow } from "../../utils/commonUtils";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Snackbar from "react-native-snackbar";
import { Colors, strings } from "@/src/constants";
import { init as initDB } from "@/src/utils/databaseUtils";
import { getMenuItems } from "@/src/store/reducers/menuSlice";
import moment from "moment";
import Images from "@/assets/images";
import { getMeals } from "@/src/store/reducers/mealsSlice";
import { getFoodItems } from "@/src/store/reducers/foodItemsSlice";
import images from "@/assets/images";

const HomeScreen = (props: any) => {
  const dispatch = useDispatch();

  const [mealNow, setMealNow] = React.useState<any>({});
  const user = useSelector((state: any) => state.auth.user);
  const yourMenuState = useSelector((state: any) => state.menu.menuItems);

  const dashboardFeature = getDashboardMenu(user?.role?.name?.toLowerCase());

  useEffect(() => {
    if (user?.role?.name === "admin") {
      initDB().catch((err) => {
        Snackbar.show({
          text: err.message || strings.errors.failedInitDB,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: Colors.errorRed,
        });
      });
    }
  }, [user]);

  // fetch menu items from API via saga
  useEffect(() => {
    dispatch(getMenuItems({}));
    dispatch(getMeals({}));
  }, []);

  useEffect(() => {
    if (yourMenuState) {
      const wednesdayMenu = yourMenuState?.filter(
        (section: { day: string }) => section.day === moment().format("dddd")
      );
      if (wednesdayMenu && wednesdayMenu.length > 0)
        setMealNow(pickMealForNow(wednesdayMenu[0]));
    }
  }, [yourMenuState]);

  const cardClick = (cardItem: any) => {
    if (cardItem.label === "View Bill" && cardItem.isDisable) {
      Snackbar.show({
        text: strings.common.viewBillDisableText,
        duration: Snackbar.LENGTH_LONG,
        textColor: Colors.textColor,
        backgroundColor: Colors.primary,
      });
      return;
    }
    props.navigation.navigate(cardItem.route);
  };

  // small component to render the current meal card + background
  const MealNowCard: React.FC<{ mealNow?: any }> = ({ mealNow }) => {
    return (
      <ImageBackground
        source={Images.foodImgBg}
        style={styles.imageStyle}
        resizeMode="cover"
      >
        <View style={styles.mealCard}>
          <Text style={styles.mealTitle}>
            Today's {mealNow?.title ?? "Menu"}
          </Text>
          {mealNow && Array.isArray(mealNow?.meals) && (
            // column-major grid: first column gets first 5 items, second column next 5 (max 10)
            <View style={styles.mealGrid}>
              <View style={styles.mealGridColumn}>
                {mealNow.meals
                  .slice(0, 5)
                  .map((item: string, index: number) => (
                    <View
                      key={"mealNowItem_col1_" + index}
                      style={styles.mealGridItem}
                    >
                      <Image
                        source={images.foodIcon}
                        style={styles.foodIconStyle}
                      />
                      <Text style={styles.mealItem}>{item}</Text>
                    </View>
                  ))}
              </View>
              <View style={styles.mealGridColumn}>
                {mealNow.meals
                  .slice(5, 10)
                  .map((item: string, index: number) => (
                    <View
                      key={"mealNowItem_col2_" + index}
                      style={styles.mealGridItem}
                    >
                      <Image
                        source={images.foodIcon}
                        style={styles.foodIconStyle}
                      />
                      <Text style={styles.mealItem}>{item}</Text>
                    </View>
                  ))}
              </View>
            </View>
          )}
        </View>
      </ImageBackground>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MealNowCard mealNow={mealNow} />

      <View style={styles.menuContainerStyle}>
        {Array.isArray(dashboardFeature) &&
          dashboardFeature.map((item: any, index: number) => (
            <View key={"menu" + index} style={styles.menuColumnStyle}>
              <Card
                label={item.label}
                image={item.image}
                onClick={() => cardClick(item)}
                cardStyle={item.isDisable ? styles.disableCardStyle : {}}
              />
            </View>
          ))}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  menuContainerStyle: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 40,
  },
  menuColumnStyle: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  disableCardStyle: {
    backgroundColor: "#D3D3D3", // Light gray
    opacity: 0.7, // Reduce opacity for a disabled look
  },
  mealCard: {
    backgroundColor: "rgba(255, 255, 255, 0.4)", // Semi-transparent white overlay
    padding: 15,
    elevation: 2,
    height: 200,
  },
  mealTitle: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: "bold",
    marginBottom: 8,
  },
  mealItem: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
    marginBottom: 4,
  },
  mealGrid: {
    width: "60%",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
  },
  mealGridColumn: {
    width: "50%",
    flexDirection: "column",
  },
  mealGridItem: {
    width: "100%",
    paddingVertical: 2,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  imageStyle: {
    width: "100%",
    height: 200,
  },
  foodIconStyle: {
    width: 14,
    height: 14,
    marginRight: 8,
  },
});
export default HomeScreen;
