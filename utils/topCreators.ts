import { NFT } from "@/context/NFTContext";

export const getCreators = (nfts: NFT[]) => {
  const creators = nfts.reduce<Record<string, NFT[]>>((creatorObject, nft) => {
    const creator = creatorObject[nft.seller] || [];
    creator.push(nft);
    creatorObject[nft.seller] = creator;
    return creatorObject;
  }, {});

  // Map to array of { seller, sum }
  return Object.entries(creators).map(([seller, creatorNfts]) => {
    const sum = creatorNfts
      .map((item) => Number(item.price) / 1e18) // Convert from wei to ETH
      .reduce((a: number, b: number) => a + b, 0);
    return { seller, sum };
  });
};
