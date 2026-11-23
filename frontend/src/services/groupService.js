import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getMyGroups = async () => {
  const response = await axios.get(
    `${API_URL}/groups/my-groups`,
    { withCredentials: true }
  );

  return response.data;
};