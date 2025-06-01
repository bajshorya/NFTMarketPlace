"use client";
import Web3Modal from "web3modal";
import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

import { marketAddress, marketABI } from "./constants";

export const NFTContext = createContext({});

import { ReactNode } from "react";

export const NFTProvider = ({ children }: { children: ReactNode }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const nftCurrency = "ETH";

  // Check if wallet is connected
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    setCurrentAccount("");
  };

  // Upload file to IPFS via Pinata using API Key and Secret
  const uploadToIPFS = async (file: File) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
      const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
      if (!apiKey || !apiSecret) {
        console.error(
          "Pinata API Key or Secret is not set in environment variables"
        );
        return null;
      }
      console.log("Uploading file to IPFS:", file.name);

      const formData = new FormData();
      formData.append("file", file);

      const pinataMetadata = JSON.stringify({
        name: file.name,
      });
      formData.append("pinataMetadata", pinataMetadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", pinataOptions);

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            pinata_api_key: apiKey,
            pinata_secret_api_key: apiSecret,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const ipfsHash = res.data.IpfsHash;
      console.log("File uploaded to IPFS, hash:", ipfsHash);
      return `https://ipfs.io/ipfs/${ipfsHash}`;
    } catch (error: any) {
      console.error("Error uploading to IPFS:", error);
      if (error.response) {
        console.error("Pinata API response:", error.response.data);
        console.error("Status code:", error.response.status);
      }
      return null;
    }
  };

  useEffect(() => {
    if (currentAccount) {
      console.log("Connected account:", currentAccount);
    }
  }, [currentAccount]);

  return (
    <NFTContext.Provider
      value={{
        nftCurrency,
        connectWallet,
        currentAccount,
        disconnectWallet,
        uploadToIPFS,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};

export const useNFTContext = () => useContext(NFTContext);
