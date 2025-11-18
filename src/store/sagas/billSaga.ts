import { call, put, takeLatest } from "redux-saga/effects";
import {
    getbillsForUser,
    getbillsForUserSuccess,
    getbillsForUserFailure,
    generateBill,
    generateBillSuccess,
    generateBillFailure,
} from "../reducers/billSlice";
import { getBillForUserService, generateBillService } from "@/src/api/billServices";

function* getBillsSaga(action: any): Generator<any, void, any> {
    try {
        const { userId } = action.payload || {};
        const response = yield call(getBillForUserService, userId);
        if (response.status === 200) {
            yield put(getbillsForUserSuccess(response.data));
        }
    } catch (error: any) {
        yield put(getbillsForUserFailure(error.message));
    }
}

function* generateBillSaga(action: any): Generator<any, void, any> {
    try {
        const response = yield call(generateBillService);
        if (response.status === 200 || response.status === 201) {
            yield put(generateBillSuccess(response.data));
        }
    } catch (error: any) {
        yield put(generateBillFailure(error.message));
    }
}

function* billSaga() {
    yield takeLatest(getbillsForUser.type, getBillsSaga);
    yield takeLatest(generateBill.type, generateBillSaga);
}

export default billSaga;
