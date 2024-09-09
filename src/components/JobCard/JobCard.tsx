import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Job } from "@/types/jobs";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const JobCard = ({ job }: { job: Job }) => {
  const [expanded, setExpanded] = useState(false);
  const formattedDate = new Date(job.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="w-full !bg-gray-200 text-gray-900 job-card border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex gap-2 items-center">
          <DragHandleDots2Icon className="w-6 h-6 mr-2 text-gray-900" />{" "}
          {/* Smaller and positioned */}
          <div>
            <CardTitle className="job-title text-xl font-semibold text-gray-900 capitalize">
              {job.name}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {formattedDate}
            </CardDescription>
            {job.category && (
              <Badge className="border-none capitalize">{job.category}</Badge>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-200"
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
        <CardContent className="text-gray-700 job-card-details">
          <p className="mb-3 whitespace-pre-line">{job.summary}</p>
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-gray-900">
                Required Skills:
              </span>{" "}
              {job.requiredSkills.join(", ")}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Start Date:</span>{" "}
              {job.startDate}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Salary:</span>{" "}
              {job.location.text}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Category:</span>{" "}
              {job.category || "-"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Company:</span>{" "}
              {job.company || "-"}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default JobCard;
