const API_URL = "https://api.hrflow.ai/v1/jobs/searching";
const API_KEY = "your_api_key_here"; // Replace with your actual API key

export const fetchJobs = async () => {
  try {
    const mockJobsData = {
      jobs: [
        {
          id: "1",
          name: "Software Developer",
          description: "Develop and maintain web applications.",
          requiredSkills: ["JavaScript", "React", "Node.js"],
          startDate: "2024-10-01",
          salary: "$80,000 - $100,000",
          category: "Development",
          company: "Company A",
          creationDate: "2024-09-01",
        },
        {
          id: "2",
          name: "Frontend Engineer",
          description: "Build and optimize user interfaces.",
          requiredSkills: ["HTML", "CSS", "JavaScript", "React"],
          startDate: "2024-11-01",
          salary: "$75,000 - $95,000",
          category: "Development",
          company: "Company B",
          creationDate: "2024-09-02",
        },
      ],
    };

    // mockJobsData.jobs = mockJobsData.jobs.concat(mockJobsData.jobs)
    // mockJobsData.jobs = mockJobsData.jobs.concat(mockJobsData.jobs)
    // mockJobsData.jobs = mockJobsData.jobs.concat(mockJobsData.jobs)

    return mockJobsData;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
