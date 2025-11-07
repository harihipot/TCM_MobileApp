import { createSlice } from "@reduxjs/toolkit";

type AttendanceState = {
  isLoading: boolean;
  submitResp: any;
  error: any;
};

const initialState: AttendanceState = {
  isLoading: false,
  submitResp: null,
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    submitAttendance(state, action) {
      state.isLoading = true;
    },
    submitAttendanceSuccess(state, action) {
      state.isLoading = false;
      state.submitResp = action.payload;
      state.error = null;
    },
    submitAttendanceFailure(state, action) {
      state.isLoading = false;
      state.submitResp = action.payload;
      state.error = action.payload;
    },
    resetAttendanceState(state) {
      state.isLoading = false;
      state.submitResp = null;
      state.error = null;
    },
  },
});

export const {
  submitAttendance,
  submitAttendanceSuccess,
  submitAttendanceFailure,
  resetAttendanceState,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
