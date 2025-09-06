import { takeLatest, put, call } from "redux-saga/effects";
import {
  loginUser,
  forgotPassword,
  loginUserSuccess,
  loginUserFailure,
  changePasswordSuccuss,
  changePasswordFailure,
  changePassword,
  forgotPasswordSuccuss,
  forgotPasswordFailure,
} from "../reducers/authSlice";
import {
  authenticateUserService,
  changePasswordService,
  forgotPasswordService,
} from "@/src/api/authService";

function* loginSaga(action: any): Generator<any, void, any> {
  try {
    const { username, password } = action.payload;
    const response = yield call(authenticateUserService, username, password);
    if (response.status === 200) {
      yield put(loginUserSuccess(response.data));
    }
  } catch (error: any) {
    yield put(loginUserFailure(error.message));
  }
}

function* forgotPasswordSaga(action: any): Generator<any, void, any> {
  try {
    const { mobile } = action.payload;
    const response = yield call(forgotPasswordService, mobile);
    console.log("forgotPasswordSaga",response);
    
    if (response.status === 200) {
      yield put(forgotPasswordSuccuss(response.data));
    }
  } catch (error: any) {
    yield put(forgotPasswordFailure(error.message));
  }
}

function* changePasswordSaga(action: any): Generator<any, void, any> {
  try {
    const { password } = action.payload;

    const response = yield call(changePasswordService, {
      userId: "1",
      oldPassword: password,
      confirmPassword: password,
    });
    if (response.status === 200) {
      yield put(changePasswordSuccuss(response.data));
    }
  } catch (error: any) {
    yield put(changePasswordFailure(error.message));
  }
}

function* authSaga() {
  yield takeLatest(loginUser.type, loginSaga);
  yield takeLatest(forgotPassword.type, forgotPasswordSaga);
  yield takeLatest(changePassword.type, changePasswordSaga);
}

export default authSaga;
