"use client";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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
  image: string;
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
  createSale: (
    url: string,
    formInputPrice: string,
    isReselling?: boolean,
    id?: string
  ) => Promise<void>;
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
  createSale: async () => {},
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
  const [web3ModalRef, setWeb3ModalRef] = useState<Web3Modal | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              11155111: "https://rpc.sepolia.org",
            },
            chainId: 11155111,
          },
        },
      };
      const modal = new Web3Modal({
        network: "sepolia",
        cacheProvider: false,
        providerOptions,
      });
      setWeb3ModalRef(modal);
    }
  }, []);

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length > 0) {
      setCurrentAccount(accounts[0]);
    } else {
      setCurrentAccount("");
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    setCurrentAccount("");
    if (web3ModalRef) {
      web3ModalRef.clearCachedProvider();
    }
  }, [web3ModalRef]);

  const switchToSepolia = async () => {
    if (typeof window === "undefined" || !window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xaa36a7",
              chainName: "Sepolia Test Network",
              rpcUrls: ["https://rpc.sepolia.org"],
              nativeCurrency: {
                name: "Sepolia ETH",
                symbol: "ETH",
                decimals: 18,
              },
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
      } else {
        console.error("Error switching to Sepolia:", error);
      }
    }
  };

  const checkIfWalletIsConnected = async (): Promise<void> => {
    if (typeof window === "undefined" || !window.ethereum) {
      console.error("MetaMask is not installed or not available");
      alert("Please install MetaMask and connect to the Sepolia testnet");
      return;
    }
    try {
      await switchToSepolia();
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== "0xaa36a7") {
        console.error("Please switch to the Sepolia testnet");
        alert("Please switch to the Sepolia testnet in MetaMask");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("disconnect", handleDisconnect);
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, [handleAccountsChanged, handleDisconnect]);

  const connectWallet = async (): Promise<void> => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask to use this application.");
      return;
    }
    if (!web3ModalRef) {
      console.log("Web3Modal not initialized yet");
      alert("Web3Modal not initialized. Please try again.");
      return;
    }
    try {
      await switchToSepolia();
      const connection = await web3ModalRef.connect();
      const provider = new BrowserProvider(connection);
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(11155111)) {
        alert("Please switch to the Sepolia testnet in MetaMask.");
        return;
      }
      const accounts = await provider.listAccounts();
      if (accounts.length) {
        setCurrentAccount(accounts[0].address);
      } else {
        alert("No accounts found. Please connect your wallet.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Check console for details.");
    }
  };

  const disconnectWallet = (): void => {
    try {
      setCurrentAccount("");
      if (web3ModalRef) {
        web3ModalRef.clearCachedProvider();
      }
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      alert("Failed to disconnect wallet. Check console for details.");
    }
  };

  const uploadToIPFS = async (file: File): Promise<string | null> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
      const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
      if (!apiKey || !apiSecret) {
        console.error("Pinata API Key or Secret is not set");
        alert("Pinata configuration error. Please contact support.");
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
      console.log("Pinata upload response:", res.data);
      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error: any) {
      console.error("Error uploading to IPFS:", error);
      if (error.response) {
        console.error("Pinata API response:", error.response.data);
        console.error("Status code:", error.response.status);
      }
      alert("Failed to upload file to IPFS. Check console for details.");
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
      alert("Please fill in all fields.");
      return;
    }
    const data = JSON.stringify({ name, description, image: fileUrl });
    try {
      const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
      const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
      if (!apiKey || !apiSecret) {
        console.error("Pinata API Key or Secret is not set");
        alert("Pinata configuration error. Please contact support.");
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
      console.log("Pinata JSON upload response:", res.data);
      const tokenURI = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      await createSale(tokenURI, price);
      router.push("/");
    } catch (error: any) {
      console.error("Error creating NFT:", error);
      if (error.response) {
        console.error("Pinata API response:", error.response.data);
        console.error("Status code:", error.response.status);
      }
      alert("Failed to create NFT. Check console for details.");
    }
  };

  const createSale = async (
    url: string,
    formInputPrice: string,
    isReselling?: boolean,
    id?: string
  ): Promise<void> => {
    try {
      if (!web3ModalRef) {
        throw new Error("Web3Modal not initialized");
      }
      const connection = await web3ModalRef.connect();
      const provider = new BrowserProvider(connection);
      const signer = await provider.getSigner();
      const balance = await provider.getBalance(await signer.getAddress());
      const price = ethers.parseUnits(formInputPrice, "ether");
      const contract = fetchContract(signer);
      const listingPrice = await contract.getListingPrice();
      if (balance < listingPrice + price) {
        alert(
          `Insufficient Sepolia ETH. You need at least ${ethers.formatEther(
            listingPrice + price
          )} ETH. Please fund your wallet using a Sepolia faucet.`
        );
        throw new Error(
          "Insufficient Sepolia ETH for listing price and NFT price"
        );
      }
      const transaction = !isReselling
        ? await contract.createToken(url, price, {
            value: listingPrice.toString(),
          })
        : await contract.resellToken(id, price, {
            value: listingPrice.toString(),
          });
      await transaction.wait({ timeout: 60000 });
    } catch (error) {
      console.error("Error in createSale:", error);
      alert("Failed to create NFT. Check console for details.");
      throw error;
    }
  };

  const fetchNFT = async (): Promise<NFT[]> => {
    if (typeof window === "undefined" || !window.ethereum) {
      console.error("No Ethereum provider available");
      return [];
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = fetchContract(provider);
      const data: MarketItem[] = await contract.fetchMarketItems();
      console.log("Fetched market items:", data);
      const items = await Promise.all(
        data.map(
          async ({
            tokenId,
            seller,
            owner,
            price: unformattedPrice,
          }: MarketItem) => {
            try {
              const tokenURI = await contract.tokenURI(tokenId);
              console.log(
                `Fetching tokenURI for tokenId ${tokenId}:`,
                tokenURI
              );
              const {
                data: { image, name, description },
              } = await axios.get(tokenURI).catch((error) => {
                console.error(`Failed to fetch tokenURI ${tokenURI}:`, error);
                throw error;
              });
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
            } catch (error) {
              console.error(`Error processing tokenId ${tokenId}:`, error);
              return null;
            }
          }
        )
      );
      const filteredItems = items.filter((item): item is NFT => item !== null);
      console.log("Fetched NFTs:", filteredItems);
      return filteredItems;
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      alert("Failed to fetch NFTs. Check console for details.");
      return [];
    }
  };

  const fetchMyNFTsOrListedNFTs = async (type: any) => {
    if (!web3ModalRef) {
      console.log("Web3Modal not initialized");
      return [];
    }
    try {
      const connection = await web3ModalRef.connect();
      const provider = new BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);
      const data =
        type === "fetchItemsListed"
          ? await contract.fetchItemsListed()
          : await contract.fetchMyNFTs();
      console.log(`Fetched ${type} items:`, data);
      const items = await Promise.all(
        data.map(
          async ({
            tokenId,
            seller,
            owner,
            price: unformattedPrice,
          }: MarketItem) => {
            try {
              const tokenURI = await contract.tokenURI(tokenId);
              console.log(
                `Fetching tokenURI for tokenId ${tokenId}:`,
                tokenURI
              );
              const {
                data: { image, name, description },
              } = await axios.get(tokenURI).catch((error) => {
                console.error(`Failed to fetch tokenURI ${tokenURI}:`, error);
                throw error;
              });
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
            } catch (error) {
              console.error(`Error processing tokenId ${tokenId}:`, error);
              return null;
            }
          }
        )
      );
      const filteredItems = items.filter((item): item is NFT => item !== null);
      console.log(`Fetched ${type} NFTs:`, filteredItems);
      return filteredItems;
    } catch (error) {
      console.error(`Error fetching ${type} NFTs:`, error);
      alert(`Failed to fetch ${type} NFTs. Check console for details.`);
      return [];
    }
  };

  const buyNft = async (nft: NFT): Promise<void> => {
    if (!web3ModalRef) {
      throw new Error("Web3Modal not initialized");
    }
    try {
      const connection = await web3ModalRef.connect();
      const provider = new BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: nft.price,
      });
      await transaction.wait({ timeout: 60000 });
    } catch (error) {
      console.error("Error buying NFT:", error);
      alert("Failed to buy NFT. Check console for details.");
      throw error;
    }
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
        createSale,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};

export const useNFTContext = (): NFTContextType => useContext(NFTContext);
