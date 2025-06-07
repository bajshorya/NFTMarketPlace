"use client";
import React, { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { NFTContext } from "@/context/NFTContext";
import { NFT as ContextNFT } from "@/context/NFTContext";

interface NFTContextType {
  nftCurrency: string;
}
interface NFTCardProps {
  nft: ContextNFT;
  onProfilePage?: boolean;
}

interface NFT {
  tokenId: string;
  image?: string;
  name?: string;
  i?: number; // Added 'i' property to match usage
  price?: string;
  owner?: string;
  seller?: string;
}

const NFTCard = ({ nft, onProfilePage = false }: NFTCardProps) => {
  const { nftCurrency } = useContext(NFTContext) as NFTContextType;
  const nftImage = nft.image || "../assets/nft10.jpeg";

  return (
    <div className="w-full p-3">
      <Link
        href={{ pathname: "/nft-details", query: { id: nft.tokenId } }}
        className="group"
      >
        <div className="bg-slate-800 rounded-xl overflow-hidden border border-neutral-700 transition-all duration-300 ease-in-out h-full flex flex-col hover:shadow-lg hover:-translate-y-1 hover:border-neutral-500 group cursor-pointer relative after:absolute after:inset-0 after:bg-neutral-900 after:opacity-0 hover:after:opacity-5 after:transition-opacity after:duration-300 hover:bg-slate-600">
          {/* Image container */}
          <div className="relative w-full aspect-square">
            <Image
              src={nftImage}
              alt={nft.name || `NFT ${nft.tokenId}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
            />
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-semibold text-lg text-neutral-900 dark:text-white truncate mb-2">
              {nft.name || `NFT ${nft.tokenId}`}
            </h3>

            <div className="mt-auto">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-neutral-50 font-bold">
                    {nft.price ? Number(nft.price) / 1e18 : "0.1"} {nftCurrency}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-mono text-neutral-600 dark:text-neutral-300">
                    {shortenAddress(
                      (onProfilePage ? nft.owner : nft.seller) || ""
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NFTCard;

export const shortenAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
