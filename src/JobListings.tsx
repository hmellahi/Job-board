import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useQuery } from "react-query";

// Assuming these components are created in separate files
import JobCard from "./JobCard";
import Pagination from "./Pagination";
import { fetchJobs } from "./api";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, isError } = useQuery("jobs", fetchJobs);

  useEffect(() => {
    if (data) {
      setJobs(data.jobs);
      setFilteredJobs(data.jobs);
    }
  }, [data]);

  useEffect(() => {
    // Load filters from localStorage
    const savedFilters = JSON.parse(localStorage.getItem("jobFilters"));
    if (savedFilters) {
      setSearchTerm(savedFilters.searchTerm);
      setSelectedCategory(savedFilters.selectedCategory);
      setSortOption(savedFilters.sortOption);
    }
  }, []);

  useEffect(() => {
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    filterJobs(event.target.value, selectedCategory, sortOption);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    filterJobs(searchTerm, event.target.value, sortOption);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    filterJobs(searchTerm, selectedCategory, event.target.value);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortOption("");
    setFilteredJobs(jobs);
    setCurrentPage(1);
  };

  const filterJobs = (search, category, sort) => {
    let result = jobs.filter(
      (job) =>
        job.name.toLowerCase().includes(search.toLowerCase()) &&
        (category === "" || job.category === category)
    );

    if (sort === "date") {
      result.sort(
        (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
      );
    } else if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "category") {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }

    setFilteredJobs(result);
    setCurrentPage(1);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(filteredJobs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFilteredJobs(items);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">Error fetching jobs</div>
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={handleSearch}
          className="flex-grow"
        />
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full sm:w-auto"
        >
          <option value="">All Categories</option>
          {/* Add category options here */}
        </Select>
        <Select
          value={sortOption}
          onChange={handleSortChange}
          className="w-full sm:w-auto"
        >
          <option value="">Sort by</option>
          <option value="date">Date</option>
          <option value="name">Name</option>
          <option value="category">Category</option>
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
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default JobListings;
