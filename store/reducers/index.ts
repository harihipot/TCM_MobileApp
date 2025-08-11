import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

const appReducer = combineReducers({
  auth: authSlice,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logout") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
