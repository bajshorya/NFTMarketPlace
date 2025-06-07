"use client";
import React, { useState, useEffect, useContext } from "react";
import { NFTContext, NFT } from "@/context/NFTContext";
import NFTCard from "./NFTCard";

const HotBids = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Sort By");
  const [searchQuery, setSearchQuery] = useState("");
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>([]);
  const { fetchNFT } = useContext(NFTContext);

  const filterOptions = [
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Newest Listings", value: "recent" },
  ];

  // Fetch NFTs on mount
  useEffect(() => {
    const loadNFTs = async () => {
      try {
        const items = await fetchNFT();
        setNfts(items);
        setFilteredNfts(items);
        console.log("Hot Bids NFTs:", items);
      } catch (error) {
        console.error("Failed to fetch Hot Bids NFTs:", error);
      }
    };

    loadNFTs();
  }, [fetchNFT]);

  // Apply filter and search whenever nfts, selectedFilter, or searchQuery changes
  useEffect(() => {
    let updatedNfts = [...nfts];

    // Apply search filter
    if (searchQuery) {
      updatedNfts = updatedNfts.filter(
        (nft) =>
          nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sort filter
    switch (selectedFilter) {
      case "Price: High to Low":
        updatedNfts.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "Price: Low to High":
        updatedNfts.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "Newest Listings":
        updatedNfts.sort((a, b) => Number(b.tokenId) - Number(a.tokenId));
        break;
      case "Ending Soonest":
      case "Most Popular":
      case "Verified Only":
        // These filters require additional data (e.g., auction end time, popularity metrics, verification status)
        // For now, we'll leave them as no-ops; you can implement them later
        console.log(`Filter "${selectedFilter}" not implemented yet`);
        break;
      default:
        // Default to "Newest Listings" if no filter is selected
        updatedNfts.sort((a, b) => Number(b.tokenId) - Number(a.tokenId));
        break;
    }

    setFilteredNfts(updatedNfts);
  }, [nfts, selectedFilter, searchQuery]);

  const handleFilterSelect = (filter: { label: string; value: string }) => {
    setSelectedFilter(filter.label);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="max-w-7xl mx-4 lg:ml-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-2xl text-white">Hot Bids</h1>
          <div className="relative">
            <button
              className="flex items-center justify-between px-4 py-2 bg-gray-100 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedFilter}
              <svg
                className="ml-2 -mr-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                      onClick={() => handleFilterSelect(option)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative flex rounded-lg shadow-sm">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for bids by name or description..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-indigo-500"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center px-6 py-3 border border-l-0 border-gray-300 bg-indigo-600 text-white font-medium rounded-r-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:cursor-pointer"
            onClick={() => setSearchQuery(searchQuery)} // Reapply search (optional since search is dynamic)
          >
            Search
          </button>
        </div>

        {filteredNfts.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No NFTs found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {filteredNfts.map((nft) => (
              <NFTCard key={nft.tokenId} nft={nft} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotBids;
