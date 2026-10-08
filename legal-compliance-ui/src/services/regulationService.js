import httpClient from "../api/httpClient";

export const getRegulations = async () => {
  try {
    const response = await httpClient.get("/regulations");
    return response.data;
  } catch (error) {
    console.error("Error fetching regulations:", error);
    return [];
  }
};
