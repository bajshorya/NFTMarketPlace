"use client";
import React, { useEffect, useState, useContext } from "react";
import Loader from "./loading";
import NFTCard from "@/components/NFTCard";
import { NFT, NFTContext } from "@/context/NFTContext";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const { fetchMyNFTsOrListedNFTs } = useContext(NFTContext);

  useEffect(() => {
    fetchMyNFTsOrListedNFTs("fetchItemsListed")
      .then((items) => {
        setNfts(items);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch listed NFTs:", error);
        setIsLoading(false);
      });
  }, [fetchMyNFTsOrListedNFTs]);

  if (isLoading) {
    return (
      <div className="text-white text-lg">
        <Loader />
      </div>
    );
  }

  if (!isLoading && nfts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-white text-lg">No NFTs found</div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-poppins text-white text-3xl font-semibold mb-8 text-center">
          NFTs Listed for Sale
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <div key={nft.tokenId} className="min-w-[250px]">
              <NFTCard nft={nft} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
