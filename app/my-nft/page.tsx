"use client";
import React, { useEffect, useState, useContext } from "react";
import Loader from "./loading";
import NFTCard, { shortenAddress } from "@/components/NFTCard";
import { NFT, NFTContext } from "@/context/NFTContext";
import Banner from "@/components/Banner";
import assets from "../../assets";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>([]);
  const [filter, setFilter] = useState<string>("recent");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { fetchMyNFTsOrListedNFTs, currentAccount } = useContext(NFTContext);

  useEffect(() => {
    fetchMyNFTsOrListedNFTs("")
      .then((items) => {
        setNfts(items);
        setFilteredNfts(items);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [fetchMyNFTsOrListedNFTs]);

  useEffect(() => {
    let updatedNfts = [...nfts];
    if (searchQuery) {
      updatedNfts = updatedNfts.filter(
        (nft) =>
          nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (filter) {
      case "price-desc":
        updatedNfts.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "price-asc":
        updatedNfts.sort((a, b) => Number(a.price) - Number(b.price)); 
        break;
      case "recent":
      default:
        updatedNfts.sort((a, b) => Number(b.tokenId) - Number(a.tokenId));
        break;
    }

    setFilteredNfts(updatedNfts);
  }, [nfts, filter, searchQuery]);

  const handleFilterChange = (selectedFilter: string) => {
    setFilter(selectedFilter);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <Banner
          name="My NFT's"
          childStyles="rounded-sm"
          parentStyles="h-20 min-h-[200px] rounded-3xl"
        />
        <div className="flexCenter flex-col z-0">
          <div className="absolute transform rounded-full border-[#0a0a0a] border-4">
            <Image
              src={assets.creator1.src}
              alt="Creator"
              className="rounded-full"
              width={144}
              height={144}
            />
          </div>
        </div>
        <p className="flexCenter flex-col z-0 mt-20 font-extrabold text-2xl text-white">
          {shortenAddress(currentAccount)}
        </p>
      </div>
      {!isLoading && filteredNfts.length === 0 ? (
        <div className="flex items-center justify-center mt-30 border-2 border-dashed border-gray-600">
          <div className="font-extrabold text-4xl">No NFTs found</div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto mt-10">
          <h2 className="font-poppins text-white text-3xl font-semibold mb-8 text-center">
            My NFTs
          </h2>
          <SearchBar
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredNfts.map((nft) => (
              <div key={nft.tokenId} className="min-w-[250px]">
                <NFTCard nft={nft} onProfilePage />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
