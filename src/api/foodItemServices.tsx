import { APIConstants } from "../constants";
import { apiCall } from "./Api";

export const getFoodItemsListService = async () => {
  return apiCall("GET", APIConstants.ENDPOINTS.FOOD_ITEM_URL);
};

export const createFoodItemService = async (foodItemObj: any) => {
  return apiCall("POST", APIConstants.ENDPOINTS.FOOD_ITEM_URL, foodItemObj);
};

export const deleteFoodItemService = async (id: string | number) => {
  const url = `${APIConstants.ENDPOINTS.FOOD_ITEM_URL}/${id}`;
  return apiCall("DELETE", url);
};
