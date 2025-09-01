import { all } from "redux-saga/effects";
import authSaga from "./authSaga";
import leaveSaga from "./leaveSaga";

function* rootSaga() {
  yield all([authSaga(), leaveSaga()]);
}

export default rootSaga;
