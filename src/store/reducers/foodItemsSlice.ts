import { createSlice } from "@reduxjs/toolkit";

type FoodItemsState = {
  isLoading: boolean;
  foodItemsList: any[] | null;
  getFoodItemsResp: any;
  createFoodItemResp: any;
  error: any;
};

const initialState: FoodItemsState = {
  isLoading: false,
  foodItemsList: null,
  getFoodItemsResp: null,
  createFoodItemResp: null,
  error: null,
};

const foodItemsSlice = createSlice({
  name: "foodItems",
  initialState,
  reducers: {
    getFoodItems(state, action) {
      state.isLoading = true;
    },
    getFoodItemsSuccess(state, action) {
      state.isLoading = false;
      state.foodItemsList = action.payload;
      state.getFoodItemsResp = action.payload;
      state.error = null;
    },
    getFoodItemsFailure(state, action) {
      state.isLoading = false;
      state.getFoodItemsResp = action.payload;
      state.error = action.payload;
    },

    createFoodItem(state, action) {
      state.isLoading = true;
    },
    createFoodItemSuccess(state, action) {
      state.isLoading = false;
      state.createFoodItemResp = action.payload;
      state.error = null;
    },
    createFoodItemFailure(state, action) {
      state.isLoading = false;
      state.createFoodItemResp = action.payload;
      state.error = action.payload;
    },
    resetcreateFoodItemState(state) {
      state.createFoodItemResp = null;
    },
    deleteFoodItem(state, action) {
      state.isLoading = true;
    },
    deleteFoodItemSuccess(state, action) {
      state.isLoading = false;
      // remove deleted item from list if present
      const id = action.payload?.id;
      if (state.foodItemsList && id !== undefined) {
        state.foodItemsList = state.foodItemsList.filter(
          (f) => String(f.id) !== String(id)
        );
      }
      state.error = null;
    },
    deleteFoodItemFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    resetFoodItemsState(state) {
      state.isLoading = false;
      state.foodItemsList = null;
      state.getFoodItemsResp = null;
      state.createFoodItemResp = null;
      state.error = null;
    },
  },
});

export const {
  getFoodItems,
  getFoodItemsSuccess,
  getFoodItemsFailure,
  createFoodItem,
  deleteFoodItem,
  deleteFoodItemSuccess,
  deleteFoodItemFailure,
  createFoodItemSuccess,
  createFoodItemFailure,
  resetFoodItemsState,
  resetcreateFoodItemState,
} = foodItemsSlice.actions;

export default foodItemsSlice.reducer;
