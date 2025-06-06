import React, { useState } from "react";
import CustomButton from "./ui/CustomButton";

interface SearchBarProps {
  onFilterChange: (filter: string) => void;
  onSearchChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onFilterChange,
  onSearchChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Sort By");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Recently Added", value: "recent" },
  ];

  const handleFilterSelect = (filter: { label: string; value: string }) => {
    setSelectedFilter(filter.label);
    onFilterChange(filter.value);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  return (
    <div>
      <div className="max-w-full mx-auto">
        <div className="flex">
          <label
            htmlFor="search-dropdown"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Filter NFTs
          </label>
          <button
            id="dropdown-button"
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
          >
            {selectedFilter}{" "}
            <svg
              className="w-2.5 h-2.5 ms-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          <div
            id="dropdown"
            className={`z-10 ${
              isDropdownOpen ? "block" : "hidden"
            } bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 absolute mt-12`}
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdown-button"
            >
              {filters.map((filter) => (
                <li key={filter.value}>
                  <button
                    type="button"
                    onClick={() => handleFilterSelect(filter)}
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    {filter.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative w-full">
            <input
              type="search"
              id="search-dropdown"
              className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <CustomButton
              name="Search"
              styles="absolute right-2 top-1/2 -translate-y-1/2 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
              handleClick={() => onSearchChange(searchQuery)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
