import { JobPost, JobsApiResponse, Skill, Tag } from "@/types/JobsApiResponse";
import { JobData } from "@/types/jobs";
import mock from "./mock";

const mapJobData = (jobsResponse: JobsApiResponse, page:number): JobData => {
  const {
    meta: { total, maxPage },
    data: { jobs },
  } = jobsResponse;

  return {
    jobs: jobs.map((job: JobPost) => {
      const companyTag = job.tags.find((tag: Tag) => tag.name === "company");
      const categoryTag = job.tags.find((tag: Tag) => tag.name === "category");

      return {
        ...job,
        requiredSkills: job.skills.map((skill: Skill) => skill.name),
        startDate:
          job.ranges_date.length > 0 ? job.ranges_date[0].value_min : "",
        category: categoryTag?.value || "",
        company: companyTag?.value || "",
      };
    }),
    total,
    hasMore : page < maxPage
  };
};

export const fetchJobs = async (page: number) => {
  try {
    console.log('fetch ' + page)
    const data = mapJobData(mock as any, page);
    console.log(data);
    return data;
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
