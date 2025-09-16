import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  applyLeaveResponse: null,
  leaveHistoryResp: null,
  cancelLeaveResponse: null,
};

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    applyLeave(state, action) {
      state.isLoading = true;
    },
    applyLeaveSuccess(state, action) {
      state.isLoading = false;
      state.applyLeaveResponse = action.payload;
    },
    applyLeaveFailure(state, action) {
      state.isLoading = false;
      state.applyLeaveResponse = action.payload;
    },
    resetApplyLeave(state) {
      state.isLoading = false;
      state.applyLeaveResponse = null;
    },

    leaveHistory(state, action) {
      state.isLoading = true;
    },
    leaveHistorySuccuss(state, action) {
      state.isLoading = false;
      state.leaveHistoryResp = action.payload;
    },
    leaveHistoryFailure(state, action) {
      state.isLoading = false;
      state.leaveHistoryResp = action.payload;
    },
    cancelLeave(state, action) {
      state.isLoading = true;
    },
    cancelLeaveSuccess(state, action) {
      state.isLoading = false;
      state.cancelLeaveResponse = action.payload;
    },
    cancelLeaveFailure(state, action) {
      state.isLoading = false;
      state.cancelLeaveResponse = action.payload;
    },
    resetLeaveState(state) {
      state.isLoading = false;
      state.applyLeaveResponse = null;
      state.leaveHistoryResp = null;
      state.cancelLeaveResponse = null;
    },
  },
});

export const {
  applyLeave,
  applyLeaveFailure,
  applyLeaveSuccess,
  resetApplyLeave,
  leaveHistory,
  leaveHistoryFailure,
  leaveHistorySuccuss,
  cancelLeave,
  cancelLeaveFailure,
  cancelLeaveSuccess,
  resetLeaveState,
} = leaveSlice.actions;
export default leaveSlice.reducer;
