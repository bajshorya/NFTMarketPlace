import React from "react";
import NFTCard from "./NFTCard";

const NFTSection = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap -mx-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <NFTCard
            key={`nft-${i}`}
            nft={{
              i,
              name: `NFT ${i}`,
              price: (10 - 0.534 * i).toFixed(2),
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NFTSection;
