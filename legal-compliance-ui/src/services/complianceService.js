import httpClient from "../api/httpClient";

export const getCompliances = async () => {
  try {
    const response = await httpClient.get("/compliances");
    return response.data;
  } catch (error) {
    console.error("Error fetching compliances:", error);
    return [];
  }
};
