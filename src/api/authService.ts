import { APIConstants } from "@/src/constants/APIConstants";
import { apiCall } from "./Api";

// Example: API function to authenticate user
export const authenticateUserService = async (
  username: string,
  password: string
) => {
  return apiCall("POST", APIConstants.ENDPOINTS.LOGIN_USER, {
    mobile: username,
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
