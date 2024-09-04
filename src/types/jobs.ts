import { JobPost } from "./JobsApiResponse";

export interface Job extends JobPost {
  name: string;
  startDate: string;
  category: string;
  company: string;
  requiredSkills: string[];
}

export interface JobData {
  jobs: Job[];
  total: number;
  hasMore: number;
}
