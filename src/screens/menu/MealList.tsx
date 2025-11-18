import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Button,
  EmptyView,
  FabButton,
  TextInputComponent,
} from "@/src/components";
import {
  createMeal,
  getMeals,
  resetCreateMealState,
} from "@/src/store/reducers/mealsSlice";
import Select from "@/src/components/Select";
import { getTimeOptions } from "@/src/utils/commonUtils";

type ListItemProps = { item: any };

const MealList = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [isAddMealVisible, setIsAddMealVisible] = useState(false);
  const [startTime, setStartTime] = React.useState<string>("");
  const [endTime, setEndTime] = React.useState<string>("");
  const [mealName, setMealName] = useState<string>("");
  const [mealNameError, setMealNameError] = useState<string>("");
  const [startTimeError, setStartTimeError] = useState<string>("");
  const [endTimeError, setEndTimeError] = useState<string>("");
  const mealsList = useSelector((state: any) => state.meals.mealsList);

  const createMealResp = useSelector(
    (state: any) => state.meals.createMealResp
  );

  const timeOptions = useMemo(() => getTimeOptions(), []);

  useEffect(() => {
    dispatch(getMeals({}));
  }, [dispatch]);

  useEffect(() => {
    if (createMealResp) {
      dispatch(getMeals({}));
      setIsAddMealVisible(false);
      dispatch(resetCreateMealState());
      setEndTime("");
      setStartTime("");
      setMealName("");
    }
  }, [createMealResp]);

  useEffect(() => {
    if (mealsList) {
      setRefreshing(false);
    }
  }, [mealsList]);

  const mealNameChange = useCallback((text: string) => {
    setMealName(text);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(getMeals({}));
  }, [dispatch]);

  const handleAddMeals = useCallback(() => {
    setIsAddMealVisible(true);
  }, []);

  const submitAddMeal = useCallback(() => {
    // Reset errors
    setMealNameError("");
    setStartTimeError("");
    setEndTimeError("");

    // Validate required fields
    let hasError = false;
    if (!mealName || mealName.trim() === "") {
      setMealNameError(strings.menu.mealNameRequired);
      hasError = true;
    }
    if (!startTime || startTime.trim() === "") {
      setStartTimeError(strings.menu.startTimeRequired);
      hasError = true;
    }
    if (!endTime || endTime.trim() === "") {
      setEndTimeError(strings.menu.endTimeRequired);
      hasError = true;
    }
    if (hasError) return;

    const obejct = {
      name: mealName,
      timing: `${startTime} - ${endTime}`,
      menuName: mealName,
    };
    dispatch(createMeal(obejct));
  }, [mealName, startTime, endTime, dispatch]);

  const closeAddMeal = useCallback(() => setIsAddMealVisible(false), []);

  const ListItem: React.FC<ListItemProps> = React.memo(({ item }) => {
    return (
      <Pressable style={styles.row} onPress={() => {}}>
        <View style={styles.rowLeft}>
          <Text style={styles.title}>{item.menuName}</Text>
          <Text style={styles.subtitle}>{item.timing}</Text>
        </View>
        <Pressable style={styles.rowRight}>
          <Image source={images.deleteIcon} style={styles.deleteIcon} />
        </Pressable>
      </Pressable>
    );
  });

  const renderItem = useCallback(({ item }: { item: any }) => {
    return <ListItem item={item} />;
  }, []);

  const keyExtractor = useCallback((item: any) => String(item.id), []);

  const Separator = useMemo(
    () => React.memo(() => <View style={styles.separator} />),
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mealsList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={
          mealsList.length === 0 ? (
            <EmptyView message="No meals available." />
          ) : null
        }
        contentContainerStyle={styles.contentContainerStyle}
      />
      <FabButton onPress={handleAddMeals} />
      <Modal
        animationType="fade"
        transparent
        visible={isAddMealVisible}
        onRequestClose={closeAddMeal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{strings.menu.addMeal}</Text>
              <Pressable onPress={closeAddMeal}>
                <Image source={images.closeIcon} style={styles.deleteIcon} />
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <TextInputComponent
                containerStyleProp={styles.textInputContainer}
                placeholderText={strings.menu.mealName}
                textValue={mealName}
                onChange={mealNameChange}
                autoCapitalizeProp="words"
                errorMessage={mealNameError}
              />
              <View style={styles.timeContainer}>
                <Select
                  style={styles.selectStyle}
                  title={`${strings.menu.startTime} *`}
                  options={timeOptions}
                  selectedValue={startTime}
                  onValueChange={useCallback((value: string) => {
                    setStartTime(value);
                    setStartTimeError("");
                  }, [])}
                  errorMessage={startTimeError}
                />
                <Select
                  style={styles.selectStyle}
                  title={`${strings.menu.endTime} *`}
                  options={timeOptions}
                  selectedValue={endTime}
                  onValueChange={useCallback((value: string) => {
                    setEndTime(value);
                    setEndTimeError("");
                  }, [])}
                  errorMessage={endTimeError}
                />
              </View>
              <Button
                label={strings.common.submit}
                onClick={submitAddMeal}
                buttonStyle={styles.modalButton}
                textStyle={styles.modalButtonText}
              />
            </View>
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
  subtitle: { fontSize: 12, color: Colors.textColor, opacity: 0.7 },
  rowRight: { width: 40, alignItems: "center" },
  count: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  deleteIcon: { width: 20, height: 20 },
  separator: { height: 1, backgroundColor: "#eee" },
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
  modalButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  modalBody: { alignItems: "center", marginTop: 20 },
  textInputContainer: { width: "90%" },
  modalButton: { marginTop: 30 },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  selectStyle: {
    width: "40%",
    marginTop: 16,
  },
  contentContainerStyle: { paddingBottom: "32%" },
});

export default MealList;
