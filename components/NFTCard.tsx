import React from "react";
import Image from "next/image";
import Link from "next/link";
import assets from "../assets";

const NFTCard = ({ nft }: { nft: any }) => {
  const nftKey = `nft${nft.i}` as keyof typeof assets; // Dynamically create the key based on nft.i example nft1, nft2, etc.

  const nftImage = assets[nftKey] || assets.nft1;

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
      <Link href={{ pathname: "/nft-details", query: { id: nft.i } }}>
        <div className="dark:bg-nft-black-3 bg-slate-600 text-white rounded-2xl p-4 cursor-pointer shadow-md h-full transition-transform hover:scale-105">
          <div className="relative w-full aspect-square overflow-hidden rounded-xl">
            <Image
              src={nftImage.src}
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
              {nft.price || "0.1"} ETH
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NFTCard;
