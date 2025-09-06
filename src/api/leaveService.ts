import { APIConstants } from "../constants/APIConstants";
import { apiCall } from "./Api";

// Example: API function to authenticate user
export const applyLeaveService = async (leaveOj: any) => {
  return apiCall("POST", APIConstants.ENDPOINTS.APPLY_LEAVE, leaveOj);
};

export const leaveHitoryService = async (
  userId: string,
  fromDate: string,
  Todate: string
) => {
  const url = `${APIConstants.ENDPOINTS.GET_LEAVE_HISTORY}?userId=${userId}&fromDate=${fromDate}&toDate=${Todate}`;
  return apiCall("GET", url);
};
