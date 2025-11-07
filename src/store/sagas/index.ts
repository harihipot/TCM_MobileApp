import { all } from "redux-saga/effects";
import authSaga from "./authSaga";
import leaveSaga from "./leaveSaga";
import menuSaga from "./menuSaga";
import mealsSaga from "./mealsSaga";
import foodItemsSaga from "./foodItemsSaga";
import attendanceSaga from "./attendanceSaga";

function* rootSaga() {
  yield all([
    authSaga(),
    leaveSaga(),
    menuSaga(),
    mealsSaga(),
    foodItemsSaga(),
    attendanceSaga(),
  ]);
}

export default rootSaga;
