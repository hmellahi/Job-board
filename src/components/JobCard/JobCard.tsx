import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {  ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Job } from "../../types/jobs";
import { Badge } from "../ui/badge";

const JobCard = ({ job }: { job: Job }) => {
  const [expanded, setExpanded] = useState(false);
  const formattedDate = new Date(job.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="w-full !bg-gray-700 text-white job-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="job-title ext-xl font-bold text-white">
            {job.name}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {formattedDate}
          </CardDescription>
          <Badge>{job.category}</Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-white hover:bg-gray-700"
          aria-label={expanded ? "Collapse job details" : "Expand job details"}
          aria-expanded={expanded}
          aria-controls={`job-details-${job.id}`}
        >
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </CardHeader>
      {expanded && (
        <CardContent className="text-gray-300 job-card-details">
          <p className="mb-3 whitespace-pre-line">{job.summary}</p>
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
              {job.location.text}
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
