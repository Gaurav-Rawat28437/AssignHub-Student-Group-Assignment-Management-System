
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getMyGroups = async () => {
  const response = await axios.get(
    `${API_URL}/groups/my-groups`,
    { withCredentials: true }
  );

  return response.data;
};

export const createGroup = async (name) => {
  const response = await axios.post(
    `${API_URL}/groups`,
    { name },
    { withCredentials: true }
  );

  return response.data;
};


export const addGroupMember = async (groupId, email) => {
  const response = await axios.post(
    `${API_URL}/groups/${groupId}/members`,
    { email },
    { withCredentials: true }
  );

  return response.data;
};

export const deleteGroup = async (groupId) => {
  const response = await axios.delete(
    `${API_URL}/groups/${groupId}`,
    { withCredentials: true }
  );

  return response.data;
};

export const getGroupById = async (groupId) => {
  const response = await axios.get(
    `${API_URL}/groups/${groupId}`,
    { withCredentials: true }
  );

  return response.data;
};