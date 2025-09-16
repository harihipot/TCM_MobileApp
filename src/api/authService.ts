import { APIConstants } from "@/src/constants";
import { apiCall } from "./Api";

// Example: API function to authenticate user
export const authenticateUserService = async (
  mobileNumber: string,
  password: string
) => {
  return apiCall("POST", APIConstants.ENDPOINTS.LOGIN_USER, {
    mobile: mobileNumber,
    password: password,
  });
};

export const forgotPasswordService = async (mobileNumber: string) => {
  return apiCall("POST", APIConstants.ENDPOINTS.FORGOT_PASSWORD, {
    mobile: mobileNumber,
  });
};

export const changePasswordService = async (passwordObj: any) => {
  return apiCall("POST", APIConstants.ENDPOINTS.CHANGE_PASSWORD, passwordObj);
};
