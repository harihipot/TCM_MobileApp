import { call, put, takeLatest } from "redux-saga/effects";
import {
  applyLeave,
  applyLeaveFailure,
  applyLeaveSuccess,
  leaveHistory,
  leaveHistoryFailure,
  leaveHistorySuccuss,
} from "../reducers/leaveSlice";
import { applyLeaveService, leaveHitoryService } from "@/src/api/leaveService";

function* applyLeaveSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(applyLeaveService, action.payload);
    if (response.status === 201) {
      yield put(applyLeaveSuccess(response.data));
    }
  } catch (error: any) {
    yield put(applyLeaveFailure(error.message));
  }
}

function* leaveHistorySaga(action: any): Generator<any, void, any> {
  try {
    const { userId, fromDate, toDate } = action.payload;
    const response = yield call(leaveHitoryService, userId, fromDate, toDate);
    if (response.status === 200) {
      yield put(leaveHistorySuccuss(response.data));
    }
  } catch (error: any) {
    console.log("Error in leaveHistorySaga:", error);
    
    yield put(leaveHistoryFailure(error.message));
  }
}

function* leaveSaga() {
  yield takeLatest(applyLeave.type, applyLeaveSaga);
  yield takeLatest(leaveHistory.type, leaveHistorySaga);
}

export default leaveSaga;
