import httpClient from "../api/httpClient";

export const getUsers = async () => {
  try {
    const response = await httpClient.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
