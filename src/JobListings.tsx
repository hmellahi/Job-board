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
import { ChangeEvent, useEffect, useState } from "react";
import { useQuery } from "react-query";

// Assuming these components are created in separate files
import JobCard from "./JobCard";
import { fetchJobs } from "./api";
import Pagination from "./components/pagination/Pagination";
import { Job, JobData } from "./types/jobs";
import { categories, jobsPerPage } from "./constants/jobs";


const JobListings = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, isError } = useQuery<JobData>("jobs", fetchJobs);

  useEffect(() => {
    if (data) {
      setJobs(data.jobs);
      setFilteredJobs(data.jobs);
    }
  }, [data]);

  useEffect(() => {
    // Load filters from localStorage
    const savedFilters = JSON.parse(localStorage.getItem("jobFilters") || "{}");

    if (!savedFilters) {
      return;
    }

    const {
      searchTerm = "",
      selectedCategory = "",
      sortOption = "",
    } = savedFilters;

    setSearchTerm(searchTerm);
    setSelectedCategory(selectedCategory);
    setSortOption(sortOption);
  }, []);

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

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">Error fetching jobs</div>
    );

  const indexOfLastItem = currentPage * jobsPerPage;
  const indexOfFirstItem = indexOfLastItem - jobsPerPage;
  const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-28 bg-[#E8E8E8]">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={handleSearch}
          className="flex-grow"
        />

        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortOption} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={resetFilters}>Reset Filters</Button>
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
                        className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
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
