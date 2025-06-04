"use client";
import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Loader from "./loading";
import { NFTContext } from "@/context/NFTContext";
import { shortenAddress } from "@/components/NFTCard";

const NftDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [nft, setNft] = useState({
    image: "",
    tokenId: "",
    name: "",
    description: "",
    price: 0,
    owner: "",
    seller: "",
    tokenURI: "",
  });
  const { fetchNFT, nftCurrency } = useContext(NFTContext);
  const searchParams = useSearchParams();
  const nftId = searchParams.get("id");

  useEffect(() => {
    if (!nftId) {
      setIsLoading(false);
      return;
    }

    fetchNFT()
      .then((nfts) => {
        const foundNft = nfts.find((item) => item.tokenId === nftId);
        if (foundNft) {
          setNft({
            image: foundNft.image || "/default-nft.png",
            tokenId: foundNft.tokenId,
            name: foundNft.name || `NFT ${foundNft.tokenId}`,
            description: foundNft.description || "No description available",
            price: Number(foundNft.price) / 1e18,
            owner: foundNft.owner,
            seller: foundNft.seller,
            tokenURI: foundNft.tokenURI,
          });
        } else {
          console.error("NFT not found for ID:", nftId);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch NFT details:", error);
        setIsLoading(false);
      });
  }, [nftId, fetchNFT]);

  if (isLoading) {
    return (
      <div className="text-white text-lg">
        <Loader />
      </div>
    );
  }

  if (!nft.tokenId) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <div className="text-white text-lg">NFT not found</div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-5xl mx-auto border-2 rounded-2xl bg-slate-800 p-8 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* NFT Image */}
          <div className="relative w-full aspect-square">
            <Image
              src={nft.image}
              alt={nft.name}
              fill
              className="object-cover rounded-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="font-poppins text-white text-3xl font-semibold mb-4">
                {nft.name}
              </h1>
              <p className="text-neutral-300 text-lg mb-6">{nft.description}</p>

              <div className="mb-6">
                <p className="text-neutral-400 text-sm mb-1">Token ID</p>
                <p className="text-white font-mono">{nft.tokenId}</p>
              </div>

              <div className="mb-6">
                <p className="text-neutral-400 text-sm mb-1">Price</p>
                <p className="text-white text-xl font-bold">
                  {nft.price} {nftCurrency}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-neutral-400 text-sm mb-1">Owner</p>
                <p className="text-white font-mono">
                  {shortenAddress(nft.owner) || "Unknown"}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-neutral-400 text-sm mb-1">Seller</p>
                <p className="text-white font-mono">
                  {shortenAddress(nft.seller) || "Unknown"}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300"
              onClick={() => alert("Buy functionality coming soon!")}
            >
              Buy NFT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftDetails;
