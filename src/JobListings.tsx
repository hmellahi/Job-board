import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";

import JobCard from "@/components/JobCard/JobCard";
import Pagination from "@/components/pagination/Pagination";
import { categories, jobsPerPage } from "@/constants/jobs";
import { fetchJobs } from "@/services/jobs";
import { Job, JobData } from "@/types/jobs";
import loadFiltersFromLS from "./utils/loadFiltersFromLS";

const JobListings = () => {
  const { savedSearchTerm, savedSelectedCategory, savedSortOption } =
    loadFiltersFromLS();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(savedSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    savedSelectedCategory
  );
  const [sortOption, setSortOption] = useState<string>(savedSortOption);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, isError } = useQuery<JobData>(
    "jobs",
    () => fetchJobs(currentPage),
    {
      retry: 0,
    }
  );

  const noFiltersApplied = useMemo(
    () => searchTerm === "" && selectedCategory === "" && sortOption === "",
    [searchTerm, selectedCategory, sortOption]
  );

  useEffect(() => {
    if (data) {
      setJobs(data.jobs);
      setFilteredJobs(data.jobs);
    }
  }, [data]);

  useEffect(() => {
    filterJobs(searchTerm, selectedCategory, sortOption);

    // Save filters to localStorage
    localStorage.setItem(
      "jobFilters",
      JSON.stringify({
        searchTerm,
        selectedCategory,
        sortOption,
      })
    );
  }, [searchTerm, selectedCategory, sortOption]);

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

  const filterJobs = (search: string, category: string, sort: string) => {
    let result = jobs.filter(
      (job) =>
        job.name.toLowerCase().includes(search.toLowerCase()) &&
        (category === "" || job.category === category)
    );

    if (sort === "date") {
      result.sort(
        (a, b) =>
          new Date(b.creationDate).getTime() -
          new Date(a.creationDate).getTime()
      );
    } else if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "category") {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }

    setFilteredJobs(result);
    setCurrentPage(1);
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

  if (isLoading) {
    return <div className="text-center py-10 text-gray-400">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-400">Error fetching jobs</div>
    );
  }

  const indexOfLastItem = currentPage * jobsPerPage;
  const indexOfFirstItem = indexOfLastItem - jobsPerPage;
  const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-28 bg-[#222222] text-white h-screen">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={handleSearch}
          className="flex-grow bg-gray-800 text-white placeholder-gray-400"
        />

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
        <div className="text-center py-10">No jobs found</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="jobs">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {currentItems.map((job, index) => (
                  <Draggable key={job.id} draggableId={job.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
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
        totalItems={filteredJobs.length}
        itemsPerPage={jobsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default JobListings;
