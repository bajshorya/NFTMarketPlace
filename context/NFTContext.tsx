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
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log("No accounts found");
    }
  };
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(accounts[0]);
    window.location.reload();
  };
  const disconnectWallet = async () => {
    setCurrentAccount("");
  };

  useEffect(() => {
    if (currentAccount) {
      console.log("Connected account:", currentAccount);
    }
  }, [currentAccount]);
  const nftCurrency = "SOL"; // This can be dynamic based on your requirements
  return (
    <NFTContext.Provider
      value={{ nftCurrency, connectWallet, currentAccount, disconnectWallet }}
    >
      {children}
    </NFTContext.Provider>
  );
};
export const useNFTContext = () => useContext(NFTContext);
