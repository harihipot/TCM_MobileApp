import Select from "@/src/components/Select";
import { Colors, strings } from "@/src/constants";
import { DAY_NAMES_SELECT } from "@/src/constants/Constants";
import React, { useState } from "react";
import { Button } from "@/src/components/Button";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";

const CreateMenu = () => {
  const [day, setDay] = useState("");
  const [dayError, setDayError] = useState("");
  const mealsList = useSelector((state: any) => state.meals.mealsList);
  const foodItemsList = useSelector(
    (state: any) => state.foodItems.foodItemsList
  );
  const [isAddFoodItemVisible, setIsAddFoodItemVisible] = useState(false);
  // track selected food ids per meal by meal id
  const [selectedFoodIds, setSelectedFoodIds] = useState<
    Record<string, string[]>
  >({});
  // the meal id for which the modal is currently open
  const [currentMealId, setCurrentMealId] = useState<string | null>(null);

  const openAddFoodItem = (mealId: string) => {
    setCurrentMealId(mealId);
    setIsAddFoodItemVisible(true);
    // ensure there's an array for this meal
    setSelectedFoodIds((prev) => ({
      ...(prev || {}),
      [mealId]: prev?.[mealId] ?? [],
    }));
  };

  const handleSubmit = () => {
    // TODO: persist selections for currentMealId or call an API
    setIsAddFoodItemVisible(false);
    setCurrentMealId(null);
  };

  return (
    <View style={styles.container}>
      <Select
        title={`${strings.menu.day} *`}
        options={DAY_NAMES_SELECT}
        selectedValue={day}
        onValueChange={(value) => {
          setDay(value);
          setDayError(value ? "" : strings.bills.transactionIdRequired);
        }}
      />
      {mealsList.map((item: any) => {
        const mealId = String(item.id);
        const selectedForMeal = selectedFoodIds[mealId] ?? [];
        return (
          <View style={styles.mealContainerStyle} key={mealId}>
            <Text style={styles.mealNameStyle}>
              {item.menuName + "    (" + item.timing + ")"}
            </Text>
            <View style={styles.addRow}>
              {/* Selected items chip group for this meal */}
              {selectedForMeal.length > 0 && (
                <View style={styles.selectedChipsWrapper}>
                  {selectedForMeal.map((foodId) => {
                    const food = (foodItemsList || []).find(
                      (f: any) => String(f.id) === foodId
                    );
                    const label = food ? food.name : `#${foodId}`;
                    return (
                      <View style={styles.selectedChip} key={foodId}>
                        <Text style={styles.selectedChipText}>{label}</Text>
                        <Pressable
                          onPress={() => {
                            setSelectedFoodIds((prev) => {
                              const prevForMeal = prev[mealId] ?? [];
                              const nextForMeal = prevForMeal.filter(
                                (p) => p !== foodId
                              );
                              return { ...prev, [mealId]: nextForMeal };
                            });
                          }}
                          style={styles.selectedChipRemove}
                        >
                          <Text style={styles.selectedChipRemoveText}>×</Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              )}
              <Pressable
                style={styles.addContaineStyle}
                onPress={() => openAddFoodItem(mealId)}
              >
                <Text style={styles.addImageStyle}>+</Text>
              </Pressable>
            </View>
          </View>
        );
      })}
      <Button
        label={strings.common.submit}
        onClick={handleSubmit}
        buttonStyle={styles.submitButton}
        textStyle={styles.modalButtonText}
      />

      {isAddFoodItemVisible && (
        <Modal
          animationType="fade"
          transparent
          visible={isAddFoodItemVisible}
          onRequestClose={() => setIsAddFoodItemVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{strings.menu.addFoodItem}</Text>
              <View style={styles.chipsWrapper}>
                {(foodItemsList || []).map((foodItem: any) => {
                  const id = String(foodItem.id);
                  const selectedForMeal = currentMealId
                    ? selectedFoodIds[currentMealId] ?? []
                    : [];
                  const selected = selectedForMeal.includes(id);
                  return (
                    <TouchableOpacity
                      key={id}
                      style={[styles.chip, selected && styles.chipSelected]}
                      onPress={() => {
                        if (!currentMealId) return;
                        setSelectedFoodIds((prev) => {
                          const prevForMeal = prev[currentMealId] ?? [];
                          const nextForMeal = prevForMeal.includes(id)
                            ? prevForMeal.filter((p) => p !== id)
                            : [...prevForMeal, id];
                          return { ...prev, [currentMealId]: nextForMeal };
                        });
                      }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selected && styles.chipTextSelected,
                        ]}
                      >
                        {foodItem.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {/* Add your form fields/components here */}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, { marginLeft: 8 }]}
                  onPress={() => {
                    setIsAddFoodItemVisible(false);
                    setCurrentMealId(null);
                  }}
                >
                  <Text style={styles.modalButtonText}>
                    {strings.menu.close}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.white,
  },
  mealContainerStyle: {
    marginBottom: 30,
  },
  mealNameStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textColor,
  },
  addRow: { flexDirection: "row", alignItems: "center" },
  addContaineStyle: {
    width: 60,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderColor: Colors.primary,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    marginTop: 8,
  },
  addImageStyle: {
    fontSize: 16,
    color: Colors.primary,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textColor,
    marginBottom: 12,
  },
  modalActions: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  modalButtonText: {
    color: Colors.white,
    fontWeight: "600",
  },
  chipsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.textColor,
  },
  chipTextSelected: {
    color: Colors.white,
  },
  selectedChipsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  selectedChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChipText: {
    fontSize: 16,
    color: Colors.white,
    marginRight: 8,
  },
  selectedChipRemove: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  selectedChipRemoveText: {
    color: Colors.white,
    fontWeight: "700",
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
});
export default CreateMenu;
