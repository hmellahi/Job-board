import { jobsPerPage } from "@/constants/jobs";
import { JobPost, JobsApiResponse, Skill, Tag } from "@/types/JobsApiResponse";
import { JobData } from "@/types/jobs";
import axios from "axios";

const mapJobData = (jobsResponse: JobsApiResponse, page: number): JobData => {
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
    hasMore: page < maxPage,
  };
};

export const fetchJobs = async (page: number) => {
  try {
    const { VITE_API_KEY, VITE_API_URL, VITE_BOARD_KEY, VITE_USER_EMAIL } =
      import.meta.env;

    const options = {
      params: { page, board_keys: [VITE_BOARD_KEY], limit: jobsPerPage },
      headers: {
        accept: "application/json",
        "X-Api-Key": VITE_API_KEY,
        "X-USER-EMAIL": VITE_USER_EMAIL,
      },
    };

    const { data } = await axios.get(VITE_API_URL, options);
    return mapJobData(data, page);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
