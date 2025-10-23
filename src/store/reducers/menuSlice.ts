import { buildMenuSections } from "@/src/utils/commonUtils";
import { createSlice } from "@reduxjs/toolkit";

type MenuSection = {
  day: string;
  meals: any[];
};

type MenuState = {
  isLoading: boolean;
  menuItems: MenuSection[] | null;
  getMenuResp: any;
  createMenuResp: any;
  updateMenuResp: any;
  deleteMenuResp: any;
  error: any;
};

const initialState: MenuState = {
  isLoading: false,
  menuItems: null,
  getMenuResp: null,
  createMenuResp: null,
  updateMenuResp: null,
  deleteMenuResp: null,
  error: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    getMenuItems(state, action) {
      state.isLoading = true;
    },
    getMenuItemsSuccess(state, action) {
      state.isLoading = false;
      state.menuItems = buildMenuSections(action.payload);
      state.getMenuResp = action.payload;
      state.error = null;
    },
    getMenuItemsFailure(state, action) {
      state.isLoading = false;
      state.getMenuResp = action.payload;
      state.error = action.payload;
    },

    createMenuItem(state, action) {
      state.isLoading = true;
    },
    createMenuItemSuccess(state, action) {
      state.isLoading = false;
      state.createMenuResp = action.payload;
      state.error = null;
    },
    createMenuItemFailure(state, action) {
      state.isLoading = false;
      state.createMenuResp = action.payload;
      state.error = action.payload;
    },

    updateMenuItem(state, action) {
      state.isLoading = true;
    },
    updateMenuItemSuccess(state, action) {
      state.isLoading = false;
      state.updateMenuResp = action.payload;
      state.error = null;
    },
    updateMenuItemFailure(state, action) {
      state.isLoading = false;
      state.updateMenuResp = action.payload;
      state.error = action.payload;
    },

    deleteMenuItem(state, action) {
      state.isLoading = true;
    },
    deleteMenuItemSuccess(state, action) {
      state.isLoading = false;
      state.deleteMenuResp = action.payload;
      state.error = null;
    },
    deleteMenuItemFailure(state, action) {
      state.isLoading = false;
      state.deleteMenuResp = action.payload;
      state.error = action.payload;
    },

    resetMenuState(state) {
      state.isLoading = false;
      state.menuItems = null;
      state.getMenuResp = null;
      state.createMenuResp = null;
      state.updateMenuResp = null;
      state.deleteMenuResp = null;
      state.error = null;
    },
  },
});

export const {
  getMenuItems,
  getMenuItemsSuccess,
  getMenuItemsFailure,
  createMenuItem,
  createMenuItemSuccess,
  createMenuItemFailure,
  updateMenuItem,
  updateMenuItemSuccess,
  updateMenuItemFailure,
  deleteMenuItem,
  deleteMenuItemSuccess,
  deleteMenuItemFailure,
  resetMenuState,
} = menuSlice.actions;

export default menuSlice.reducer;
