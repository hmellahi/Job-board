import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Job } from "./types/jobs";

const JobCard = ({ job }: { job: Job }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{job.name}</CardTitle>
          <CardDescription>
            {new Date(job.creationDate).toLocaleDateString()}
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </CardHeader>
      {expanded && (
        <CardContent>
          <p className="mb-2">{job.description}</p>
          <p className="mb-2">
            <strong>Required Skills:</strong> {job.requiredSkills.join(", ")}
          </p>
          <p className="mb-2">
            <strong>Start Date:</strong> {job.startDate}
          </p>
          <p className="mb-2">
            <strong>Salary:</strong> {job.salary}
          </p>
          <p className="mb-2">
            <strong>Category:</strong> {job.category}
          </p>
          <p>
            <strong>Company:</strong> {job.company}
          </p>
        </CardContent>
      )}
    </Card>
  );
};

export default JobCard;
