"use client";
import { NFTContext } from "@/context/NFTContext";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import Loader from "./loading";
import Banner from "@/components/Banner";
import NFTCard from "@/components/NFTCard";
import Input from "@/components/Input";
import Image from "next/image";
import CustomButton from "@/components/ui/CustomButton";

const page = () => {
  const { createSale } = useContext(NFTContext);
  const searchParams = useSearchParams();
  const tokenId = searchParams.get("id");
  const tokenURI = searchParams.get("tokenURI");
  const router = useRouter();
  const [price, setPrice] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true); // Set initial loading state to true

  const fetchNFT = async () => {
    if (!tokenURI) {
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await axios.get(tokenURI);
      setImage(data.image || "");
      setPrice(data.price || "0");
    } catch (error) {
      console.error("Failed to fetch NFT data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNFT(); // Always call fetchNFT on mount if tokenURI exists
  }, [tokenURI]);
  const resell = async ({
    tokenURI,
    price,
    isReselling,
    tokenId,
  }: {
    tokenURI: string;
    price: string;
    isReselling: boolean;
    tokenId: string;
  }) => {
    if (!tokenURI || !price || !tokenId) {
      console.error("Missing required parameters for reselling NFT");
      return;
    }
    try {
      await createSale(tokenURI, price, isReselling, tokenId);
      console.log("NFT resold successfully" + tokenId);
      router.push("/listed-nft");
    } catch (error) {
      console.error("Failed to resell NFT:", error);
    }
  };
  if (isLoading) {
    return (
      <div className="text-white text-lg">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Banner
            name="Resell NFT"
            childStyles="rounded-sm"
            parentStyles="h-20 min-h-[200px] rounded-3xl mb-10"
          />
        </div>
        <Input
          inputType="number"
          title="Price"
          placeholder="NFT Price"
          handleClick={(e) => setPrice(e.target.value)}
        />
        {image && (
          <div className="relative w-full max-w-md mx-auto aspect-square mt-4 ">
            <Image
              src={image}
              alt="NFT Image"
              fill
              className="object-cover rounded border-2 border-gray-300 mt-10"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
      </div>
      <div>
        <div className="flex justify-center ">
          <CustomButton
            name={`List On MarketPlace `}
            styles=" text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out mt-10 flex justify-end"
            handleClick={() => {
              resell({
                tokenURI: tokenURI || "",
                price: price || "0",
                isReselling: true,
                tokenId: tokenId || "",
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
