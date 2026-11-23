
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllAssignments = async () => {
  const response = await axios.get(`${API_URL}/assignments`, {
    withCredentials: true
  });

  return response.data;
};

export const createAssignment = async (assignmentData) => {
  const response = await axios.post(
    `${API_URL}/assignments`,
    assignmentData,
    { withCredentials: true }
  );

  return response.data;
};

export const updateAssignment = async (assignmentId, assignmentData) => {
  const response = await axios.put(
    `${API_URL}/assignments/${assignmentId}`,
    assignmentData,
    { withCredentials: true }
  );

  return response.data;
};
