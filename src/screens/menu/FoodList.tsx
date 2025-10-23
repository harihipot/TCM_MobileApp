import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Colors, strings } from "@/src/constants";
import images from "@/assets/images";
import {
  FabButton,
  TextInputComponent,
  Button,
  EmptyView,
} from "@/src/components";
import {
  getFoodItems,
  createFoodItem,
  deleteFoodItem,
  resetFoodItemsState,
} from "@/src/store/reducers/foodItemsSlice";

const FoodList = () => {
  const dispatch = useDispatch();
  const foodItemsList = useSelector(
    (state: any) => state.foodItems.foodItemsList
  );
  const createResp = useSelector(
    (state: any) => state.foodItems.createFoodItemResp
  );
  const deleteResp = useSelector((state: any) => state.foodItems.error);

  const [isAddVisible, setIsAddVisible] = useState(false);
  const [newFoodName, setNewFoodName] = useState("");
  const [newFoodError, setNewFoodError] = useState("");

  useEffect(() => {
    dispatch(getFoodItems({}));
    return () => {
      dispatch(resetFoodItemsState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (createResp) {
      // refresh
      dispatch(getFoodItems({}));
      setIsAddVisible(false);
      setNewFoodName("");
      setNewFoodError("");
    }
  }, [createResp, dispatch]);

  const handleDelete = useCallback(
    (id: string | number) => {
      dispatch(deleteFoodItem(id));
    },
    [dispatch]
  );

  const submitNewFood = useCallback(() => {
    // validation
    if (!newFoodName || newFoodName.trim() === "") {
      setNewFoodError(strings.menu.foodItemNameRequired);
      return;
    }
    setNewFoodError("");
    dispatch(createFoodItem({ name: newFoodName }));
  }, [newFoodName, dispatch]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      return (
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.title}>{item.name}</Text>
          </View>
          <Pressable
            style={styles.rowRight}
            onPress={() => handleDelete(item.id)}
          >
            <Image source={images.deleteIcon} style={styles.deleteIcon} />
          </Pressable>
        </View>
      );
    },
    [handleDelete]
  );

  const keyExtractor = useCallback((item: any) => String(item.id), []);

  return (
    <View style={styles.container}>
      <FlatList
        data={foodItemsList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={
          foodItemsList?.length === 0 ? (
            <EmptyView message="No meals available." />
          ) : null
        }
        contentContainerStyle={styles.contentContainerStyle}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <FabButton onPress={() => setIsAddVisible(true)} />

      <Modal
        animationType="fade"
        transparent
        visible={isAddVisible}
        onRequestClose={() => setIsAddVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{strings.menu.addFoodItem}</Text>
              <Pressable onPress={() => setIsAddVisible(false)}>
                <Image source={images.closeIcon} style={styles.deleteIcon} />
              </Pressable>
            </View>

            <TextInputComponent
              placeholderText={strings.menu.foodItemName}
              textValue={newFoodName}
              onChange={setNewFoodName}
              errorMessage={newFoodError}
              containerStyleProp={styles.textInput90}
            />

            <Button
              label={strings.common.submit}
              onClick={submitNewFood}
              buttonStyle={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  row: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600", color: Colors.textColor },
  rowRight: { width: 40, alignItems: "center" },
  deleteIcon: { width: 20, height: 20 },
  separator: { height: 1, backgroundColor: "#eee" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    alignSelf: "center",
    width: "90%",
    maxWidth: 600,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: { fontSize: 18, fontWeight: "600" },
  contentContainerStyle: { paddingBottom: "32%" },
  textInput90: { width: "90%" },
  modalButton: { marginTop: 20 },
});

export default FoodList;
