import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import { Job } from "../../types/jobs";
import JobCard from "./JobCard";

// Sample job data for testing
const mockJob: Job = {
  id: "1",
  name: "Software Engineer",
  creationDate: "2024-09-01",
  description: "Develop and maintain software applications.",
  requiredSkills: ["JavaScript", "React", "Node.js"],
  startDate: "2024-10-01",
  salary: "$100,000",
  category: "Software Engineering",
  company: "Tech Corp",
};

describe("JobCard", () => {
  test("renders job details correctly", () => {
    render(<JobCard job={mockJob} />);

    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("09/01/2024")).toBeInTheDocument();
  });

  test("toggles the expanded content when button is clicked", () => {
    render(<JobCard job={mockJob} />);

    // Initially, expanded content should not be visible
    expect(
      screen.queryByText("Develop and maintain software applications.")
    ).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(screen.getByRole("button"));

    // Expanded content should be visible now
    expect(
      screen.getByText("Develop and maintain software applications.")
    ).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(screen.getByRole("button"));

    // Expanded content should not be visible again
    expect(
      screen.queryByText("Develop and maintain software applications.")
    ).not.toBeInTheDocument();
  });

  test("displays additional job details when expanded", () => {
    render(<JobCard job={mockJob} />);

    // Expand the card to reveal additional details
    fireEvent.click(screen.getByRole("button"));

    expect(
      screen.getByText("Required Skills: JavaScript, React, Node.js")
    ).toBeInTheDocument();
    expect(screen.getByText("Start Date: 2024-10-01")).toBeInTheDocument();
    expect(screen.getByText("Salary: $100,000")).toBeInTheDocument();
    expect(
      screen.getByText("Category: Software Engineering")
    ).toBeInTheDocument();
    expect(screen.getByText("Company: Tech Corp")).toBeInTheDocument();
  });
});
