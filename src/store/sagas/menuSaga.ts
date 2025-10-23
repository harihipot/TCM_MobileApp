import { call, put, takeLatest } from "redux-saga/effects";
import {
  getMenuItems,
  getMenuItemsSuccess,
  getMenuItemsFailure,
  createMenuItem,
  createMenuItemSuccess,
  createMenuItemFailure,
  updateMenuItem,
  updateMenuItemSuccess,
  updateMenuItemFailure,
  deleteMenuItem,
  deleteMenuItemSuccess,
  deleteMenuItemFailure,
} from "../reducers/menuSlice";
import {
  getMenuItemsService,
  createMenuItemService,
  deleteMenuItemService,
  updateMenuItemService,
} from "@/src/api/menuServices";

function* getMenuItemsSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(getMenuItemsService);

    if (response.status === 200) {
      yield put(getMenuItemsSuccess(response.data));
    }
  } catch (error: any) {
    yield put(getMenuItemsFailure(error.message));
  }
}

function* createMenuItemSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(createMenuItemService, action.payload);
    if (response.status === 201 || response.status === 200) {
      yield put(createMenuItemSuccess(response.data));
    }
  } catch (error: any) {
    yield put(createMenuItemFailure(error.message));
  }
}

function* updateMenuItemSaga(action: any): Generator<any, void, any> {
  try {
    const { id, body } = action.payload || {};
    const response = yield call(updateMenuItemService, id, body);
    if (response.status === 200) {
      yield put(updateMenuItemSuccess(response.data));
    }
  } catch (error: any) {
    yield put(updateMenuItemFailure(error.message));
  }
}

function* deleteMenuItemSaga(action: any): Generator<any, void, any> {
  try {
    const { id } = action.payload || {};
    const response = yield call(deleteMenuItemService, id);
    if (response.status === 200 || response.status === 204) {
      yield put(deleteMenuItemSuccess(response.data));
    }
  } catch (error: any) {
    yield put(deleteMenuItemFailure(error.message));
  }
}

function* menuSaga() {
  yield takeLatest(getMenuItems.type, getMenuItemsSaga);
  yield takeLatest(createMenuItem.type, createMenuItemSaga);
  yield takeLatest(updateMenuItem.type, updateMenuItemSaga);
  yield takeLatest(deleteMenuItem.type, deleteMenuItemSaga);
}

export default menuSaga;
