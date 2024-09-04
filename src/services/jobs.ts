import { JobData } from "@/types/jobs";
import mock from "./mock";

const mapJobData = (data: any): JobData => {
  return {
    jobs: data.jobs.map((job: any) => {
      const companyTag = job.tags.find((tag: any) => tag.name === "Company");

      return {
        ...job,
        description: job.summary || "",
        requiredSkills: job.skills.map((skill: any) => skill.name),
        startDate:
          job.ranges_date.length > 0 ? job.ranges_date[0].value_min : "",
        location: job.location?.text,
        category: job.tags.find((tag: any) => tag.name === "category")?.value,
        company: companyTag?.value,
      };
    }),
  };
};

export const fetchJobs = async (page: number) => {
  try {
    const { jobs } = mapJobData(mock.data);
    console.log(jobs);
    return {
      jobs,
    };
    // const { VITE_API_KEY, VITE_API_URL, VITE_BOARD_KEY } = import.meta.env;

    // const options = {
    //   params: { page, board_keys: [VITE_BOARD_KEY] },
    //   headers: {
    //     accept: "application/json",
    //     "X-Api-Key": VITE_API_KEY,
    //     "X-USER-EMAIL": "hmellahi@proton.com",
    //   },
    // };

    // const { data } = await axios.get(VITE_API_URL, options);
    // const { jobs } = mapJobData(mock.data);
    // console.log(jobs);
    // return {
    //   jobs
    // };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
