"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import assets from "../assets";
import { getCreators } from "@/utils/topCreators";
import { NFT, NFTContext } from "@/context/NFTContext";

interface CreatorCardProps {
  creator: { seller: string; sum: number };
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
  const [creatorKey, setCreatorKey] = useState<keyof typeof assets>("creator1");

  useEffect(() => {
    const randomKey = `creator${
      Math.floor(Math.random() * 10) + 1
    }` as keyof typeof assets;
    setCreatorKey(randomKey);
  }, []);

  const shortenAddress = (address: string): string => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center bg-slate-800 rounded-lg shadow-lg p-4 m-2 w-64 border-1">
        <img
          src={assets[creatorKey]?.src || assets.creator1.src}
          alt="Creator Avatar"
          className="w-24 h-24 rounded-full mb-4"
        />
        <h2 className="text-xl font-semibold text-white">
          {shortenAddress(creator.seller)}
        </h2>
        <p className="text-gray-400">
          Total Sales: {creator.sum.toFixed(2)} ETH
        </p>
        <button className="mt-4 px-6 py-2 bg-pink-700 text-white rounded-full hover:bg-pink-900 hover:cursor-pointer transition-colors duration-300">
          Follow
        </button>
      </div>
    </div>
  );
};

const ScrollCard = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const { fetchNFT } = useContext(NFTContext);

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        const items = await fetchNFT();
        setNfts(items);
      } catch (error) {
        console.error("Failed to fetch NFTs:", error);
      }
    };

    loadNFTs();
  }, [fetchNFT]);

  const topCreators = getCreators(nfts);

  return (
    <div>
      <h1 className="font-bold text-2xl mx-4 text-white">Best Creators</h1>
      <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
        {topCreators.length === 0 ? (
          <div className="w-full text-center text-gray-400 py-8">
            No creators found
          </div>
        ) : (
          <div
            className="flex flex-row w-max overflow-x-scroll select-none no-scrollbar"
            ref={scrollRef}
          >
            {topCreators.map((creator, index) => (
              <div key={creator.seller}>
                <CreatorCard creator={creator} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrollCard;
export { CreatorCard };
