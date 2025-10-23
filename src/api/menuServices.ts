import { APIConstants } from "@/src/constants";
import { apiCall } from "./Api";

export const getMenuItemsService = async () => {
  return apiCall("GET", APIConstants.ENDPOINTS.MENU_ITEM_URL);
};

export const createMenuItemService = async (menuItemObj: any) => {
  return apiCall("POST", APIConstants.ENDPOINTS.MENU_ITEM_URL, menuItemObj);
};

export const deleteMenuItemService = async (menuItemId: any) => {
  return apiCall(
    "DELETE",
    APIConstants.ENDPOINTS.MENU_ITEM_URL + `/${menuItemId}`
  );
};

export const updateMenuItemService = async (
  menuItemId: any,
  menuItemObj?: any
) => {
  return apiCall(
    "PUT",
    APIConstants.ENDPOINTS.MENU_ITEM_URL + `/${menuItemId}`,
    menuItemObj
  );
};
