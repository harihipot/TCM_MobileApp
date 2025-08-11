import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  error: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser(state, action) {
      state.status = "pending";
    },
    loginUserSuccess(state, action) {
      state.user = action.payload;
      state.error = null;
      state.status = "complete";
    },
    loginUserFailure(state, action) {
      state.user = null;
      state.error = action.payload;
      state.status = "failed";
    },
    logout (state) {
      state.status = "idle";
    }
  },
});

export const { loginUser, loginUserSuccess, loginUserFailure,logout } =
  authSlice.actions;
export default authSlice.reducer;
