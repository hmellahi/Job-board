const loadFiltersFromLS = () => {
  // Load filters from localStorage
  const savedFilters = JSON.parse(localStorage.getItem("jobFilters") || "{}");

  const {
    searchTerm = "",
    selectedCategory = "",
    sortOption = "",
  } = savedFilters;

  return {
    savedSearchTerm: searchTerm,
    savedSelectedCategory: selectedCategory,
    savedSortOption: sortOption,
  };
};

export default loadFiltersFromLS;
