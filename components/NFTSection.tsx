"use client";
import React, { useContext, useEffect, useState } from "react";
import NFTCard from "./NFTCard";
import { NFTContext } from "@/context/NFTContext";
import { NFT } from "@/context/NFTContext";

const NFTSection = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const { fetchNFT } = useContext(NFTContext);

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        const items = await fetchNFT();
        setNfts(items);
        console.log("Fetched NFTs:", items);
      } catch (error) {
        console.error("Failed to fetch NFTs:", error);
      }
    };

    loadNFTs();
  }, [fetchNFT]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap -mx-4">
        {nfts.map((nft) => (
          <NFTCard key={nft.tokenId} nft={nft} />
        ))}
      </div>
    </div>
  );
};

export default NFTSection;
