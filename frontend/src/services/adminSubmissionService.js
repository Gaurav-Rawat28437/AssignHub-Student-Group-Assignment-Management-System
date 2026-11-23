
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAssignmentProgress = async (assignmentId) => {
  const response = await axios.get(
    `${API_URL}/assignments/${assignmentId}/progress`,
    { withCredentials: true }
  );

  return response.data;
};
