import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  error: null,
  isLoading: false,
  forgotPasswordResp: null,
  changePasswordResp: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser(state, action) {
      state.isLoading = true;
    },
    loginUserSuccess(state, action) {
      state.user = action.payload;
      state.error = null;
      state.isLoading = false;
    },
    loginUserFailure(state, action) {
      state.user = null;
      state.error = action.payload;
      state.isLoading = false;
    },
    logout(state) {
      state.isLoading = false;
    },
    forgotPassword(state, action) {
      state.isLoading = true;
    },
    forgotPasswordSuccuss(state, action) {
      state.isLoading = false;
      state.forgotPasswordResp = action.payload;
    },
    forgotPasswordFailure(state, action) {
      state.isLoading = false;
      state.forgotPasswordResp = action.payload;
    },
    changePassword(state, action) {
      state.isLoading = true;
    },
    changePasswordSuccuss(state, action) {
      state.isLoading = false;
      state.changePasswordResp = action.payload;
    },
    changePasswordFailure(state, action) {
      state.isLoading = false;
      state.changePasswordResp = action.payload;
    },
    resetAuth(state) {
      state.user = null;
      state.error = null;
      state.isLoading = false;
      state.forgotPasswordResp = null;
      state.changePasswordResp = null; 
    }
  },
});

export const {
  loginUser,
  loginUserSuccess,
  loginUserFailure,
  forgotPassword,
  forgotPasswordSuccuss,
  forgotPasswordFailure,
  changePassword,
  changePasswordSuccuss,
  changePasswordFailure,
  resetAuth,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
