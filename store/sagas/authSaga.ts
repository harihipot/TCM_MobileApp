import { takeLatest, put, call } from "redux-saga/effects";
import {
  loginUser,
  loginUserSuccess,
  loginUserFailure,
} from "../reducers/authSlice";
import { authenticateUser } from "../../api/auth";

function* handleLogin(action: any): Generator<any, void, any> {
  try {
    const { username, password } = action.payload;
    const user = yield call(authenticateUser, username, password);
    yield put(loginUserSuccess(user));
  } catch (error: any) {
    yield put(loginUserFailure(error.message));
  }
}

function* authSaga() {
  yield takeLatest(loginUser.type, handleLogin);
}

export default authSaga;
