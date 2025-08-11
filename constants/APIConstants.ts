export const APIConstants = {
  BASE_URL: "https://api.example.com", // Base URL for the API
  TIMEOUT: 5000, // Request timeout in milliseconds
  RETRY_LIMIT: 3, // Maximum number of retry attempts for failed requests
  HEADERS: {
    // Default headers for API requests
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: " Bearer YOUR_API_KEY", // Replace with your actual API key
  },
  ENDPOINTS: {
    // API endpoints
    LOGIN_USER: "/user",
  },
};
