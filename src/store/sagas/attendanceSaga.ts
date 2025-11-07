import { call, put, takeLatest } from "redux-saga/effects";
import {
  submitAttendance,
  submitAttendanceSuccess,
  submitAttendanceFailure,
} from "../reducers/attendanceSlice";
import { submitAttendanceService } from "@/src/api/attendanceServices";

function* submitAttendanceSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(submitAttendanceService, action.payload);
    if (response.status === 200 || response.status === 201) {
      yield put(submitAttendanceSuccess(response.data));
    }
  } catch (error: any) {
    yield put(submitAttendanceFailure(error.message));
  }
}

function* attendanceSaga() {
  yield takeLatest(submitAttendance.type, submitAttendanceSaga);
}

export default attendanceSaga;
