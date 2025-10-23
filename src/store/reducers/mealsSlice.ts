import { createSlice } from "@reduxjs/toolkit";

type MealState = {
  isLoading: boolean;
  mealsList: any[] | null;
  getMealsResp: any;
  createMealResp: any;
  error: any;
};

const initialState: MealState = {
  isLoading: false,
  mealsList: null,
  getMealsResp: null,
  createMealResp: null,
  error: null,
};

const mealsSlice = createSlice({
  name: "meals",
  initialState,
  reducers: {
    getMeals(state, action) {
      state.isLoading = true;
    },
    getMealsSuccess(state, action) {
      state.isLoading = false;
      state.mealsList = action.payload;
      state.getMealsResp = action.payload;
      state.error = null;
    },
    getMealsFailure(state, action) {
      state.isLoading = false;
      state.getMealsResp = action.payload;
      state.error = action.payload;
    },

    createMeal(state, action) {
      state.isLoading = true;
    },
    createMealSuccess(state, action) {
      state.isLoading = false;
      state.createMealResp = action.payload;
      state.error = null;
    },
    createMealFailure(state, action) {
      state.isLoading = false;
      state.createMealResp = action.payload;
      state.error = action.payload;
    },
    resetCreateMealState(state) {
      state.createMealResp = null;
      state.error = null;
    },
    resetMealsState(state) {
      state.isLoading = false;
      state.mealsList = null;
      state.getMealsResp = null;
      state.createMealResp = null;
      state.error = null;
    },
  },
});

export const {
  getMeals,
  getMealsSuccess,
  getMealsFailure,
  createMeal,
  createMealSuccess,
  createMealFailure,
  resetMealsState,
  resetCreateMealState,
} = mealsSlice.actions;

export default mealsSlice.reducer;
