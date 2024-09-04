import axios from "axios";

const API_URL = "https://api.hrflow.ai/v1/jobs/searching";
const API_KEY = "your_api_key_here"; // Replace with your actual API key

export const fetchJobs = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "X-API-KEY": API_KEY,
      },
      params: {
        // Add any necessary parameters here
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
