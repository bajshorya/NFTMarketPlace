"use client";
import React, { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { NFTContext } from "@/context/NFTContext";
interface NFTContextType {
  nftCurrency: string;
}
const NFTCard = ({ nft }: { nft: any }) => {
  const { nftCurrency } = useContext(NFTContext) as NFTContextType;
  const nftImage = nft.image || "/default-nft.png"; // Fallback to a default image if nft.image is not available

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
      <Link href={{ pathname: "/nft-details", query: { id: nft.i } }}>
        <div className="dark:bg-nft-black-3 bg-slate-800 border-1 text-white rounded-2xl p-4 cursor-pointer shadow-md h-full transition-transform hover:scale-105">
          <div className="relative w-full aspect-square overflow-hidden rounded-xl">
            <Image
              src={nftImage}
              alt={nft.name || `NFT ${nft.i}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="mt-3">
            <h3 className="font-extrabold text-2xl truncate">
              {nft.name || `NFT ${nft.i}`}
            </h3>
            <p className="text-white text-sm font-light">
              {nft.price ? (Number(nft.price) / 1e18).toFixed(4) : "0.1"}{" "}
              {nftCurrency}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NFTCard;
