export interface Job {
  id: string;
  name: string;
  description: string;
  requiredSkills: string[];
  startDate: string;
  salary: string;
  category: string;
  company: string;
  creationDate: string;
}

export interface JobData {
  jobs: Job[];
}
