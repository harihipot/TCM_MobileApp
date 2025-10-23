import { call, put, takeLatest } from "redux-saga/effects";
import {
  getMeals,
  getMealsSuccess,
  getMealsFailure,
  createMeal,
  createMealSuccess,
  createMealFailure,
} from "../reducers/mealsSlice";
import { getMealsListService, createMealService } from "@/src/api/mealServices";

function* getMealsSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(getMealsListService);
    if (response.status === 200) {
      yield put(getMealsSuccess(response.data));
    }
  } catch (error: any) {
    console.log("errror", error);

    yield put(getMealsFailure(error.message));
  }
}

function* createMealSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(createMealService, action.payload);
    if (response.status === 201 || response.status === 200) {
      yield put(createMealSuccess(response.data));
    }
  } catch (error: any) {
    yield put(createMealFailure(error.message));
  }
}

function* mealsSaga() {
  yield takeLatest(getMeals.type, getMealsSaga);
  yield takeLatest(createMeal.type, createMealSaga);
}

export default mealsSaga;
