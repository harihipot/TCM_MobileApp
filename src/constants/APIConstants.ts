export const APIConstants = {
  // BASE_URL: "https://tmc-gmc.el.r.appspot.com", // Base URL for the API
  TIMEOUT: 10000, // Request timeout in milliseconds
  BASE_URL: "https://tf-mess.el.r.appspot.com",
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
    FORGOT_PASSWORD: "/api/gmc/auth/forgot-password",
    CREATE_USER: "/api/gmc/user",

    //Leaves
    APPLY_LEAVE: "/api/gmc/leave/apply",
    GET_LEAVE_HISTORY: "api/gmc/leave",
    CANCEL_LEAVE: "/api/gmc/leave/cancel",

    //Menu
    MENU_ITEM_URL: "/api/gmc/menu_item",

    //meals
    DAILY_MEAL_URL: "/api/gmc/daily_meal",

    //Food items
    FOOD_ITEM_URL: "/api/gmc/food_item",

    //Attendance
    ATTENDANCE_URL: "/api/gmc/attendance",

    //Billing
    GENERATE_BILL_URL: "/api/gmc/bill/generate",
    GET_BILL_URL: "/api/gmc/bill",
  },
};
