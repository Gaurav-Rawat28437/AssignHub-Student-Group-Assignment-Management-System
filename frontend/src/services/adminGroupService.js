
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllGroups = async () => {
  const response = await axios.get(`${API_URL}/groups/all`, {
    withCredentials: true
  });

  return response.data;
};
