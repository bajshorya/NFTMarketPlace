import Banner from "@/components/Banner";
import ScrollCard from "@/components/CreatorCard";
import HotBids from "@/components/HotBids";

export default function Home() {
  return (
    <div className="px-10">
      <div>
        <div className="w-full">
          <Banner
            name="Discover Digital Art"
            parentStyles="h-[70vh] min-h-[500px] rounded-3xl p-8"
            childStyles="drop-shadow-lg"
          />
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
