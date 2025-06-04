"use client";
import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Loader from "./loading";
import { NFTContext } from "@/context/NFTContext";
import { shortenAddress } from "@/components/NFTCard";
import CustomButton from "@/components/ui/CustomButton";
import Modal from "@/components/Modal";

type PaymentBodyCmpProps = {
  nft: {
    image: string;
    name: string;
    price: number;
    tokenId: string;
    owner: string;
    seller: string;
    tokenURI: string;
    description: string;
  };
  nftCurrency: string;
};

const PaymentBodyCmp: React.FC<PaymentBodyCmpProps> = ({
  nft,
  nftCurrency,
}) => {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={nft.image}
        alt={nft.name}
        width={300}
        height={300}
        className="rounded-lg mb-4 border-2 border-gray-300 shadow-lg object-cover
        transition-transform duration-300 ease-in-out transform hover:scale-105"
      />
      <h2 className="text-3xl font-semibold mb-2 font-serif">{nft.name}</h2>
      <p className="font-semibold border-1 p-2 border-dashed mb-4">
        Price: {nft.price} {nftCurrency}
      </p>
      <p className="font-semibold mb-3">Seller:{shortenAddress(nft.seller)}</p>
      <p className="text-gray-300 mb-6">
        Proceed with the payment to complete your purchase.
      </p>
    </div>
  );
};
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
  const { fetchNFT, nftCurrency, currentAccount } = useContext(NFTContext);
  const searchParams = useSearchParams();
  const nftId = searchParams.get("id");
  const [paymentModal, setPaymentModal] = useState(false);

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
            <div className="flex flex-row sm:flex-col mt-10 ">
              {currentAccount === nft.seller.toLowerCase() ? (
                <div className="border-1">
                  <p className="font-sans  text-center text-2xl ">
                    You cannot buy your own NFT
                  </p>
                </div>
              ) : (
                <div>
                  <CustomButton
                    name={`Buy Now for ${nft.price} ${nftCurrency} `}
                    styles=" text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
                    handleClick={() => setPaymentModal(true)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {paymentModal && (
        <Modal
          header="Checkout"
          body={<PaymentBodyCmp nft={nft} nftCurrency={nftCurrency} />}
          footer={
            <div>
              <div className="flex flex-row justify-between mt-6 ">
                <CustomButton
                  name="Checkout"
                  styles="bg-pink-700 text-lg p-6 mx-4"
                  handleClick={() => {}}
                />
                <CustomButton
                  name="Cancel"
                  styles="bg-pink-700 text-lg p-6 mx-4"
                  handleClick={() => {
                    setPaymentModal(false);
                  }}
                />
              </div>
            </div>
          }
          handleClose={() => setPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default NftDetails;
