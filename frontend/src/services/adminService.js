
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAdminAnalytics = async () => {
  const response = await axios.get(`${API_URL}/analytics`, {
    withCredentials: true
  });

  return response.data;
};
