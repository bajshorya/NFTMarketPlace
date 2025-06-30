"use client";
import ScrollCard from "@/components/CreatorCard";
import HotBids from "@/components/HotBids";
import AdSpaceProvider from "adspace-provider";
export default function Home() {
  return (
    <div className="px-10">
      <div>
        <div className="w-full">
          <div>
            <AdSpaceProvider
              tokenId={1}
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto py-12">
          <ScrollCard />
        </div>
        <div className="max-w-7xl mx-auto py-12">
          <HotBids />
        </div>
      </div>
    </div>
  );
}
