import { call, put, takeLatest } from "redux-saga/effects";
import {
  getFoodItems,
  getFoodItemsSuccess,
  getFoodItemsFailure,
  createFoodItem,
  createFoodItemSuccess,
  createFoodItemFailure,
  deleteFoodItem,
  deleteFoodItemSuccess,
  deleteFoodItemFailure,
} from "../reducers/foodItemsSlice";
import {
  getFoodItemsListService,
  createFoodItemService,
  deleteFoodItemService,
} from "@/src/api/foodItemServices";

function* getFoodItemsSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(getFoodItemsListService);
    if (response.status === 200) {
      yield put(getFoodItemsSuccess(response.data));
    }
  } catch (error: any) {
    console.log("errror", error);

    yield put(getFoodItemsFailure(error.message));
  }
}

function* createFoodItemSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(createFoodItemService, action.payload);
    if (response.status === 201 || response.status === 200) {
      yield put(createFoodItemSuccess(response.data));
    }
  } catch (error: any) {
    yield put(createFoodItemFailure(error.message));
  }
}

function* deleteFoodItemSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(deleteFoodItemService, action.payload);
    if (response.status === 200 || response.status === 204) {
      yield put(deleteFoodItemSuccess({ id: action.payload }));
    }
  } catch (error: any) {
    yield put(deleteFoodItemFailure(error.message));
  }
}

function* foodItemsSaga() {
  yield takeLatest(getFoodItems.type, getFoodItemsSaga);
  yield takeLatest(createFoodItem.type, createFoodItemSaga);
  yield takeLatest(deleteFoodItem.type, deleteFoodItemSaga);
}

export default foodItemsSaga;
