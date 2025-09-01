import axios from "axios";
import { APIConstants } from "@/src/constants/APIConstants";
import { getAuthToken } from "../utils/storageUtils";

const axiosInstance = axios.create({
  baseURL: APIConstants.BASE_URL,
  timeout: APIConstants.TIMEOUT, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
    // No static Authorization header here
  },
});

// Optional: Add interceptors for request/response
axiosInstance.interceptors.request.use(
  async (config) => {
    // console.log("Request config:", {
    //   method: config.method,
    //   url: config.url,
    //   data: config.data,
    //   baseURL: config.baseURL,
    //   headers: config.headers,
    // });

    // Dynamically set Authorization header if token exists
    try {
      const token = await getAuthToken();
      if (token && token != "") {
        if (config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.warn("Failed to get auth token from storage", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    // console.log("Response data:", {
    //   status: response.status,
    //   data: response.data,
    //   headers: response.headers,
    //   url: response.config.url,
    //   method: response.config.method,
    // });

    return response;
  },
  (error) => {
    // console.log("Response error:", {
    //   status: error.response?.status,
    //   data: error.response?.data,
    //   statusText: error.response?.statusText,
    //   url: error.config?.url,
    //   method: error.config?.method,
    //   message: error.message,
    //   baseURL: error.config?.baseURL,
    //   headers: error.config?.headers,
    // });

    // Handle errors globally
    // Example: if (error.response?.status === 401) { ... }
    return Promise.reject(error);
  }
);

export default axiosInstance;
