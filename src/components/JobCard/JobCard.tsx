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
import { Job } from "../../types/jobs";

const JobCard = ({ job }: { job: Job }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="w-full bg-gray-800 text-white border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold text-white">
            {job.name}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {new Date(job.creationDate).toLocaleDateString()}
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-white hover:bg-gray-700"
        >
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </CardHeader>
      {expanded && (
        <CardContent className="text-gray-300">
          <p className="mb-3">{job.description}</p>
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-white">Required Skills:</span>{" "}
              {job.requiredSkills.join(", ")}
            </p>
            <p>
              <span className="font-semibold text-white">Start Date:</span>{" "}
              {job.startDate}
            </p>
            <p>
              <span className="font-semibold text-white">Salary:</span>{" "}
              {job.salary}
            </p>
            <p>
              <span className="font-semibold text-white">Category:</span>{" "}
              {job.category}
            </p>
            <p>
              <span className="font-semibold text-white">Company:</span>{" "}
              {job.company}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default JobCard;
