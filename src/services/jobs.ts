import axios from "axios";

export const fetchJobs = async (page: number) => {
  try {
    const { VITE_API_KEY, VITE_API_URL, VITE_BOARD_KEY } = import.meta.env;

    const options = {
      params: { page },
      headers: {
        accept: "application/json",
        "X-Api-Key": VITE_API_KEY,
        "X-Board-Key": VITE_BOARD_KEY,
        "X-USER-EMAIL": "hmellahi@proton.com",
      },
    };

    const { data } = await axios.get(VITE_API_URL, options);
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
