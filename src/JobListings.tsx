import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useLocalStorage } from "@uidotdev/usehooks";

import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";

import { queryClient } from "@/App";
import JobCard from "@/components/JobCard/JobCard";
import Pagination from "@/components/pagination/Pagination";
import { categories, jobsPerPage } from "@/constants/jobs";
import { fetchJobs } from "@/services/jobs";
import { Job, JobData } from "@/types/jobs";
import { isCaseInsensitiveEqual } from "./utils/isCaseInsensitiveEqual";

const JobListings = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useLocalStorage("searchTerm", "");
  const [selectedCategory, setSelectedCategory] = useLocalStorage(
    "selectedCategory",
    ""
  );
  const [sortOption, setSortOption] = useLocalStorage("sortOption", "");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isPreviousData } = useQuery<JobData>({
    queryKey: ["jobs", currentPage],
    queryFn: () => fetchJobs(currentPage),
    keepPreviousData: true,
  });

  const noFiltersApplied = useMemo(
    () => searchTerm === "" && selectedCategory === "" && sortOption === "",
    [searchTerm, selectedCategory, sortOption]
  );

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (newSelectedCategory: string) => {
    setSelectedCategory(newSelectedCategory);
  };

  const handleSortChange = (newSortField: string) => {
    setSortOption(newSortField);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortOption("");
    setFilteredJobs(jobs);
    setCurrentPage(1);
  };

  const filterJobs = (jobsList: Job[]) => {
    let result = jobsList.filter(
      (job) =>
        job.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!selectedCategory ||
          isCaseInsensitiveEqual(job.category, selectedCategory))
    );

    if (sortOption === "date") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortOption === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "category") {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }

    setFilteredJobs(result);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredJobs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFilteredJobs(items);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Prefetch the next page!
  useEffect(() => {
    //isPreviousData : what data the query is currently providing you
    // true => The current data is from the previous query, and a new query is in flight.
    // false => The data is up-to-date for the current query parameters.
    // It ensures that you only prefetch the next page when you have the most current data for the current page.

    if (!isPreviousData && data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ["jobs", currentPage + 1],
        queryFn: () => fetchJobs(currentPage + 1),
      });
    }
  }, [data, isPreviousData, currentPage, queryClient]);

  useEffect(() => {
    if (data) {
      const { jobs } = data;
      setJobs(jobs);
      filterJobs(jobs);
    }
  }, [data]);

  useEffect(() => {
    filterJobs(jobs);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortOption]);

  if (isLoading) {
    return <div className="text-center py-10 text-gray-400">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-400">Error fetching jobs</div>
    );
  }

  const totalJobs = data?.total;

  return (
    <div className="p-4 sm:p-12 md:p-28 text-white h-full">
      <div className="mb-10 flex flex-wrap items-center gap-4 ">
        <div>
          <Input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-grow bg-white text-gray-900 placeholder-gray-400 inline-block border-none"
          />
        </div>

        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-auto bg-gray-800 text-white">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white">
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortOption} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-auto bg-gray-800 text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white">
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
        <Button
          disabled={noFiltersApplied}
          onClick={resetFilters}
          className="bg-gray-700 hover:bg-gray-600"
        >
          Reset Filters
        </Button>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-10 text-black">No jobs found</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="jobs">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4 job-listings"
              >
                {filteredJobs.map((job, index) => (
                  <Draggable
                    key={job.id}
                    draggableId={String(job.id)}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
                      >
                        <JobCard job={job} />
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={totalJobs}
        itemsPerPage={jobsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default JobListings;
