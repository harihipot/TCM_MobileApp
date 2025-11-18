import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";

// Generic API call function
export const apiCall = async (
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  data?: any,
  config?: any
): Promise<AxiosResponse<any, any>> => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      ...config,
    });
    return response;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error.message || "API call failed"
    );
  }
};
