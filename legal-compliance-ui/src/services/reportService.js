import httpClient from "../api/httpClient";

export const getReports = async () => {
  try {
    const response = await httpClient.get("/reports");
    return response.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
};
