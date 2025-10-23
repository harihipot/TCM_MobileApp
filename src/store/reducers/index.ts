import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import leaveSlice from "./leaveSlice";
import menuSlice from "./menuSlice";
import mealsSlice from "./mealsSlice";
import foodItemsSlice from "./foodItemsSlice";

const appReducer = combineReducers({
  auth: authSlice,
  leave: leaveSlice,
  menu: menuSlice,
  meals: mealsSlice,
  foodItems: foodItemsSlice,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logout") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
