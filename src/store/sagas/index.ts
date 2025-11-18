import { all } from "redux-saga/effects";
import authSaga from "./authSaga";
import leaveSaga from "./leaveSaga";
import menuSaga from "./menuSaga";
import mealsSaga from "./mealsSaga";
import foodItemsSaga from "./foodItemsSaga";
import attendanceSaga from "./attendanceSaga";
import billSaga from "./billSaga";

function* rootSaga() {
  yield all([
    authSaga(),
    leaveSaga(),
    menuSaga(),
    mealsSaga(),
    foodItemsSaga(),
    attendanceSaga(),
    billSaga(),
  ]);
}

export default rootSaga;
