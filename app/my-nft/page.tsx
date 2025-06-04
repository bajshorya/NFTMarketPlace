"use client";
import React, { useEffect, useState, useContext } from "react";
import Loader from "./loading";
import NFTCard, { shortenAddress } from "@/components/NFTCard";
import { NFT, NFTContext } from "@/context/NFTContext";
import Banner from "@/components/Banner";
import assets from "../../assets";
import Image from "next/image";
const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const { fetchMyNFTsOrListedNFTs, currentAccount } = useContext(NFTContext);

  useEffect(() => {
    fetchMyNFTsOrListedNFTs("")
      .then((items) => {
        setNfts(items);
        setIsLoading(false);
        console.log("My NFTs:", items);
      })
      .catch((error) => {
        console.error("Failed to fetch MY NFTs:", error);
        setIsLoading(false);
      });
  }, [fetchMyNFTsOrListedNFTs]);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="relative ">
        <Banner
          name="My NFT's"
          childStyles="rounded-sm"
          parentStyles="h-20 min-h-[200px] rounded-3xl "
        ></Banner>
        <div className="flexCenter flex-col  z-0">
          <div className="absolute transform rounded-full border-[#0a0a0a] border-4">
            <Image
              src={assets.creator1.src}
              alt="Creator"
              className="rounded-full "
              width={144}
              height={144}
            />
          </div>
        </div>
        <p className=" flexCenter flex-col z-0 mt-20 font-extrabold text-2xl text-white ">
          {shortenAddress(currentAccount)}
        </p>
      </div>
      {!isLoading && nfts.length === 0 ? (
        <div className="flex items-center justify-center mt-30 border-2 border-dashed border-gray-600 ">
          <div className="font-extrabold text-4xl">No NFTs found</div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto mt-10">
          <h2 className="font-poppins text-white text-3xl font-semibold mb-8 text-center">
            My NFTs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <div key={nft.tokenId} className="min-w-[250px]">
                <NFTCard nft={nft} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
