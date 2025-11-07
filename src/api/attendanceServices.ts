import { apiCall } from "./Api";
import { APIConstants } from "@/src/constants";

export const submitAttendanceService = async (payload: any) => {
  return apiCall("POST", APIConstants.ENDPOINTS.ATTENDANCE_URL, payload);
};
