
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/auth/register`,
    userData,
    { withCredentials: true }
  );

  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await axios.post(
    `${API_URL}/auth/login`,
    loginData,
    { withCredentials: true }
  );

  return response.data;
};


export const getUserProfile = async () => {
  const response = await axios.get(
    `${API_URL}/users/profile`,
    { withCredentials: true }
  );

  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post(
    `${API_URL}/auth/logout`,
    {},
    { withCredentials: true }
  );

  return response.data;
};