import axios from "axios";
// API function to authenticate user
export const authenticateUser = async (username: any, password: any) => {
  try {
    const response = await axios.post("http://auth-api-url/login", {
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response.data.message || "An error occurred during login"
    );
  }
};
