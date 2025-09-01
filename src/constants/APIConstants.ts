export const APIConstants = {
  BASE_URL: "https://tmc-gmc.el.r.appspot.com", // Base URL for the API
  TIMEOUT: 10000, // Request timeout in milliseconds
  RETRY_LIMIT: 3, // Maximum number of retry attempts for failed requests
  HEADERS: {
    // Default headers for API requests
    "Content-Type": "application/json",
    Accept: "application/json",
    // Authorization header is set dynamically in axiosInstance
  },
  ENDPOINTS: {
    // API endpoints
    LOGIN_USER: "/api/gmc/auth/login",
    CHANGE_PASSWORD: "/api/gmc/auth/change-password",
    FORGOT_PASSWORD:"/api/gmc/auth/forgot-password",
    CREATE_USER: "/api/gmc/user",
    APPLY_LEAVE: "/api/gmc/leave/apply",
    GET_LEAVE_HISTORY: "api/gmc/leave",
  },
};
