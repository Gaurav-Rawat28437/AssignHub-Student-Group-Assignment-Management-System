
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getMyAssignments = async () => {
  const response = await axios.get(
    `${API_URL}/assignments/my-assignments`,
    {
      withCredentials: true
    }
  );

  return response.data;
};

export const confirmAssignmentSubmission = async (assignmentId, groupId) => {
  const response = await axios.post(
    `${API_URL}/assignments/${assignmentId}/confirm`,
    {
      groupId
    },
    {
      withCredentials: true
    }
  );

  return response.data;
};
