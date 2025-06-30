import instance from "./axiosInstance.js";
import axiosInstance from "./axiosInstance.js";

const authService = {
  signup: async (username, email, password, confirmPassword) => {
    try {
      const response = await instance.post("/user/register", {
        username,
        email,
        password,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to sign up. Please try again.";
      throw new Error(errorMessage);
    }
  },
  shorten: async (longUrl, accessToken) => {
    try {
      const response = await instance.post("/url/shorten", {
        url: longUrl
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      },
    {
      Authorization: `Bearer ${accessToken}`
    });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Shortening the URL failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
};

export default authService;
