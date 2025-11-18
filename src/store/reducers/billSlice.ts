import { createSlice } from "@reduxjs/toolkit";

type BillState = {
    isLoading: boolean;
    billList: any[] | null;
    getBillResp: any;
    generateBillResp: any;
    error: any;
};

const initialState: BillState = {
    isLoading: false,
    billList: null,
    getBillResp: null,
    generateBillResp: null,
    error: null,
};

const billSlice = createSlice({
    name: "bill",
    initialState,
    reducers: {
        // fetch bills for a user
        getbillsForUser(state, action) {
            state.isLoading = true;
        },
        getbillsForUserSuccess(state, action) {
            state.isLoading = false;
            state.getBillResp = action.payload;
            state.error = null;
        },
        getbillsForUserFailure(state, action) {
            state.isLoading = false;
            state.getBillResp = null;
            state.error = action.payload;
        },

        // generate bill
        generateBill(state, action) {
            state.isLoading = true;
        },
        generateBillSuccess(state, action) {
            state.isLoading = false;
            state.generateBillResp = action.payload;
            state.error = null;
        },
        generateBillFailure(state, action) {
            state.isLoading = false;
            state.generateBillResp = action.payload;
            state.error = action.payload;
        },

        resetGenerateBillState(state) {
            state.generateBillResp = null;
            state.error = null;
        },
        resetBillState(state) {
            state.isLoading = false;
            state.billList = null;
            state.getBillResp = null;
            state.generateBillResp = null;
            state.error = null;
        },
    },
});

export const {
    getbillsForUser,
    getbillsForUserSuccess,
    getbillsForUserFailure,
    generateBill,
    generateBillSuccess,
    generateBillFailure,
    resetBillState,
    resetGenerateBillState,
} = billSlice.actions;

export default billSlice.reducer;
