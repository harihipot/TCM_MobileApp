import { APIConstants } from "@/constants/APIConstants";
import axiosInstance from "./axiosInstance";

// Generic API call function
export const apiCall = async <T = any>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  data?: any,
  config?: any
): Promise<T> => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      ...config,
    });
    console.log("API response:", response.data);
    
    return response.data;
  } catch (error: any) {
    console.log("API call error:", error);
    throw new Error(
      error?.response?.data?.message || error.message || "API call failed"
    );
  }
};

// Example: API function to authenticate user
export const authenticateUser = async (username: string, password: string) => {
  console.log("Authenticating user:", username);
  return apiCall("POST", APIConstants.ENDPOINTS.LOGIN_USER, {
    username,
    password,
  });
};
