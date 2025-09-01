import { APIConstants } from "../constants/APIConstants";
import { apiCall } from "./Api";

// Example: API function to authenticate user
export const applyLeaveService = async (leaveOj: any) => {
  return apiCall("POST", APIConstants.ENDPOINTS.APPLY_LEAVE, leaveOj);
};

export const leaveHitoryService = async () => {
  return apiCall("GET", APIConstants.ENDPOINTS.GET_LEAVE_HISTORY);
};
