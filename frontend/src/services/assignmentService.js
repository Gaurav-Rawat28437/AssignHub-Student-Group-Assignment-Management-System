
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getMyAssignments = async () => {
  const response = await axios.get(
    `${API_URL}/assignments/my-assignments`,
    { withCredentials: true }
  );

  return response.data;
};
