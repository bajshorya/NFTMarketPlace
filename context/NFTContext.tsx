"use client";
import Web3Modal from "web3modal";
import { createContext, useContext, useEffect, useState } from "react";
import { ethers, BrowserProvider, Signer, Contract } from "ethers";
import axios from "axios";
import { marketAddress, marketABI } from "./constants";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface FormInput {
  name: string;
  description: string;
  price: string;
}

export interface NFT {
  tokenId: string;
  seller: string;
  owner: string;
  price: bigint;
  image?: string;
  name: string;
  description: string;
  tokenURI: string;
}

interface MarketItem {
  tokenId: bigint;
  seller: string;
  owner: string;
  price: bigint;
}

export interface NFTContextType {
  nftCurrency: string;
  connectWallet: () => Promise<void>;
  currentAccount: string;
  disconnectWallet: () => void;
  uploadToIPFS: (file: File) => Promise<string | null>;
  createNFT: (
    formInput: FormInput,
    fileUrl: string,
    router: ReturnType<typeof useRouter>
  ) => Promise<void>;
  fetchNFT: () => Promise<NFT[]>;
  fetchMyNFTsOrListedNFTs: (type: any) => Promise<NFT[]>;
  buyNft?: (nft: NFT) => Promise<void>;
}
export const formatPrice = (price: bigint): string => {
  return ethers.formatUnits(price, "ether");
};
export const NFTContext = createContext<NFTContextType>({
  nftCurrency: "ETH",
  connectWallet: async () => {},
  currentAccount: "",
  disconnectWallet: () => {},
  uploadToIPFS: async () => null,
  createNFT: async () => {},
  fetchNFT: async () => [],
  fetchMyNFTsOrListedNFTs: async () => [],
  buyNft: async () => {},
});

const fetchContract = (
  signerOrProvider: BrowserProvider | Signer
): Contract => {
  return new ethers.Contract(marketAddress, marketABI, signerOrProvider);
};

interface NFTProviderProps {
  children: ReactNode;
}

export const NFTProvider: React.FC<NFTProviderProps> = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const nftCurrency = "ETH";

  const checkIfWalletIsConnected = async (): Promise<void> => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }
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

  const connectWallet = async (): Promise<void> => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }
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

  const disconnectWallet = (): void => {
    setCurrentAccount("");
  };

  const uploadToIPFS = async (file: File): Promise<string | null> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
      const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
      if (!apiKey || !apiSecret) {
        console.error(
          "Pinata API Key or Secret is not set in environment variables"
        );
        return null;
      }

      const formData = new FormData();
      formData.append("file", file);

      const pinataMetadata = JSON.stringify({ name: file.name });
      formData.append("pinataMetadata", pinataMetadata);

      const pinataOptions = JSON.stringify({ cidVersion: 0 });
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

  const createNFT = async (
    formInput: FormInput,
    fileUrl: string,
    router: ReturnType<typeof useRouter>
  ): Promise<void> => {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) {
      console.error("All fields are required");
      return;
    }

    const data = JSON.stringify({ name, description, image: fileUrl });

    try {
      const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
      const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
      if (!apiKey || !apiSecret) {
        console.error(
          "Pinata API Key or Secret is not set in environment variables"
        );
        return;
      }

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data,
        {
          headers: {
            pinata_api_key: apiKey,
            pinata_secret_api_key: apiSecret,
            "Content-Type": "application/json",
          },
        }
      );

      const tokenURI = `https://ipfs.io/ipfs/${res.data.IpfsHash}`;
      await createSale(tokenURI, price);
      router.push("/");
    } catch (error: any) {
      console.error("Error creating NFT:", error);
      if (error.response) {
        console.error("Pinata API response:", error.response.data);
        console.error("Status code:", error.response.status);
      }
    }
  };

  const createSale = async (
    url: string,
    formInputPrice: string,
    isReselling?: boolean,
    id?: string
  ): Promise<void> => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new BrowserProvider(connection);
      const signer = await provider.getSigner();
      const price = ethers.parseUnits(formInputPrice, "ether");
      const contract = fetchContract(signer);

      const listingPrice = await contract.getListingPrice();
      const transaction = await contract.createToken(url, price, {
        value: listingPrice.toString(),
      });
      await transaction.wait();
    } catch (error) {
      console.error("Error in createSale:", error);
      throw error;
    }
  };

  const fetchNFT = async (): Promise<NFT[]> => {
    const provider = new BrowserProvider(window.ethereum);
    const contract = fetchContract(provider);
    const data: MarketItem[] = await contract.fetchMarketItems();

    const items = await Promise.all(
      data.map(
        async ({
          tokenId,
          seller,
          owner,
          price: unformattedPrice,
        }: MarketItem) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const {
            data: { image, name, description },
          } = await axios.get(tokenURI);

          return {
            price: unformattedPrice,
            tokenId: tokenId.toString(),
            seller,
            owner,
            image,
            name,
            description,
            tokenURI,
          };
        }
      )
    );

    return items;
  };
  const fetchMyNFTsOrListedNFTs = async (type: any) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new BrowserProvider(connection);
    const signer = await provider.getSigner();
    const contract = fetchContract(signer);
    const data =
      type === "fetchItemsListed"
        ? await contract.fetchItemsListed()
        : await contract.fetchMyNFTs();
    const items = await Promise.all(
      data.map(
        async ({
          tokenId,
          seller,
          owner,
          price: unformattedPrice,
        }: MarketItem) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const {
            data: { image, name, description },
          } = await axios.get(tokenURI);

          return {
            price: unformattedPrice,
            tokenId: tokenId.toString(),
            seller,
            owner,
            image,
            name,
            description,
            tokenURI,
          };
        }
      )
    );
    return items;
  };
  const buyNft = async (nft: NFT): Promise<void> => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new BrowserProvider(connection);
    const signer = await provider.getSigner();
    const contract = fetchContract(signer);

    // No need to convert price here since it should already be in wei
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: nft.price, // Directly use the price which should be in wei
    });
    await transaction.wait();
  };
  return (
    <NFTContext.Provider
      value={{
        nftCurrency,
        connectWallet,
        currentAccount,
        disconnectWallet,
        uploadToIPFS,
        createNFT,
        fetchNFT,
        fetchMyNFTsOrListedNFTs,
        buyNft,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};

export const useNFTContext = (): NFTContextType => useContext(NFTContext);
