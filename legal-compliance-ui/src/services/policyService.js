import httpClient from "../api/httpClient";

export const getPolicies = async () => {
  try {
    const response = await httpClient.get("/policies");
    return response.data;
  } catch (error) {
    console.error("Error fetching policies:", error);
    return [];
  }
};
