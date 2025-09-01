import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  applyLeaveResponse: null,
  leaveHistoryResp: null,
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
  },
});

export const {
  applyLeave,
  applyLeaveFailure,
  applyLeaveSuccess,
  resetApplyLeave,
  leaveHistory,
  leaveHistoryFailure,
  leaveHistorySuccuss
} = leaveSlice.actions;
export default leaveSlice.reducer;
