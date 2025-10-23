import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  SectionList,
} from "react-native";
import moment from "moment";
import images from "@/assets/images";
import { Colors } from "@/src/constants";
import { useSelector } from "react-redux";

const meals = {
  breakfast: [
    {
      id: "1",
      title: "Berry Blast Acai Bowl",
      servings: "8 serving",
      image: "", // Add image URL or leave empty
    },
  ],
  lunch: [
    {
      id: "2",
      title: "Grilled Chicken And Vegetables",
      servings: "5 serving",
      image: "",
    },
    {
      id: "3",
      title: "Sweet Potato Cake Lemony Slaw",
      servings: "5 serving",
      image: "",
    },
  ],
  dinner: [
    {
      id: "4",
      title: "Honey Butter Chicken Tenders",
      servings: "8 serving",
      image: "",
    },
  ],
};

type Meal = {
  id: string;
  title: string;
  servings: string;
  image: string;
};

const MealItem = ({ item }: { item: any }) => {
  return (
    <View style={styles.mealItem}>
      <Image
        source={item.image ? { uri: item.image } : images.roundIcon}
        style={styles.mealImage}
      />
      <View style={styles.mealInfo}>
        <Text style={styles.mealTitle}>{item.name}</Text>
      </View>
    </View>
  );
};

const YourMenu = () => {
  const yourMenuState = useSelector((state: any) => state.menu.menuItems);
  const todayName = moment().format("ddd").toUpperCase();
  const [selectedDay, setSelectedDay] = React.useState(todayName);
  const weekDates = Array.from({ length: 7 }, (_, i) => ({
    date: moment().startOf("week").add(i, "days").date(),
    day: moment().startOf("week").add(i, "days").format("ddd").toUpperCase(),
  }));

  const [mealSections, setMealSelections] = React.useState<
    Array<{ title: string; data: Meal[] }>
  >([]);

  useEffect(() => {
    if (yourMenuState) {
      const selectedDaysMenu = yourMenuState?.filter(
        (section: any) =>
          section.day.substring(0, 3).toUpperCase() === selectedDay
      );
      if (selectedDaysMenu && selectedDaysMenu.length > 0)
        setMealSelections(selectedDaysMenu[0]?.meals);
      else setMealSelections([]);
    }
  }, [yourMenuState, selectedDay]);

  return (
    <View style={styles.container}>
      {/* Date Tabs */}
      <View style={styles.dateTabs}>
        {weekDates.map((item, idx) => (
          <Pressable
            onPress={() => {
              setSelectedDay(item.day);
            }}
            key={idx}
            style={[
              styles.dateItem,
              item.day === selectedDay && styles.activeDate,
            ]}
          >
            <Text
              style={[
                styles.dayText,
                item.day === selectedDay && styles.activeDayText,
              ]}
            >
              {item.day}
            </Text>
            <Text
              style={[
                styles.dateText,
                item.day === selectedDay && styles.activeDateText,
              ]}
            >
              {item.date}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Meals SectionList */}
      <SectionList
        sections={mealSections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MealItem item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionTitle}>{title}</Text>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.sectionListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.white,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: Colors.textColor,
  },
  dateTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateItem: {
    alignItems: "center",
    padding: 6,
    borderRadius: 12,
  },
  activeDate: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    fontSize: 12,
    color: "#888",
  },
  activeDayText: {
    color: Colors.textColor,
    fontWeight: "700",
  },
  dateText: {
    fontSize: 14,
    color: "#111",
    fontWeight: "600",
  },
  activeDateText: {
    color: Colors.textColor,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: "600",
  },

  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textColor,
    marginBottom: 10,
  },
  sectionListContent: { paddingBottom: 20 },
  mealItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    // backgroundColor: "#F9F9F9",
    padding: 10,
    borderRadius: 12,
  },
  mealImage: {
    width: 55,
    height: 55,
    borderRadius: 12,
    marginRight: 10,
  },
  mealInfo: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textColor,
  },
});
export default YourMenu;
