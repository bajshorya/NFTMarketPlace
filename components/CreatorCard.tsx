"use client";
import React, { useState, useEffect, useRef } from "react";
import assets from "../assets";

const CreatorCard = () => {
  const [creatorKey, setCreatorKey] = useState<keyof typeof assets>("creator1");

  useEffect(() => {
    const randomKey = `creator${
      Math.floor(Math.random() * 10) + 1
    }` as keyof typeof assets;
    setCreatorKey(randomKey);
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center justify-center bg-slate-600 rounded-lg shadow-lg p-4 m-2 w-64">
        <img
          src={assets[creatorKey]?.src || assets.creator1.src}
          alt="Creator Avatar"
          className="w-24 h-24 rounded-full mb-4"
        />
        <h2 className="text-xl font-semibold">Creator Name</h2>
        <p className="text-gray-600">Creator Bio</p>
        <button className="mt-4 px-6 py-2 bg-pink-700 text-white rounded-full hover:bg-pink-900 hover:cursor-pointer transition-colors duration-300">
          Follow
        </button>
      </div>
    </div>
  );
};

const ScrollCard = () => {
  const parentRef = useRef(null);
  const scrollRef = useRef(null);

  return (
    <div>
      <h1 className="font-bold text-2xl mx-4">Best Creators</h1>
      <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
        <div
          className="flex flex-row w-max overflow-x-scroll select-none no-scrollbar"
          ref={scrollRef}
        >
          {[6, 2, 1, 3, 8, 9, 4, 5, 7, 10].map((creator, index) => (
            <div key={index}>
              <CreatorCard />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollCard;
export { CreatorCard };
