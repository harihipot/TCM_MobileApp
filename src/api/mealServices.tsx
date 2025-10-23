import { APIConstants } from "../constants";
import { apiCall } from "./Api";

export const getMealsListService = async () => {
  return apiCall("GET", APIConstants.ENDPOINTS.DAILY_MEAL_URL);
};

export const createMealService = async (mealsObj: any) => {
  return apiCall("POST", APIConstants.ENDPOINTS.DAILY_MEAL_URL, mealsObj);
};
