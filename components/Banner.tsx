import React from "react";

interface BannerProps {
  name: string;
  childStyles?: string;
  parentStyles?: string;
}

const Banner: React.FC<BannerProps> = ({ name, childStyles, parentStyles }) => (
  <div
    className={`relative w-full flex items-center justify-center z-0 overflow-hidden bg-gradient-to-r from-pink-700 to-purple-800 animated-gradient ${parentStyles}`}
  >
    <div className="relative z-10 text-center px-4">
      <p
        className={`font-bold font-poppins text-white text-3xl sm:text-4xl md:text-5xl ${childStyles}`}
      >
        {name}
      </p>
    </div>
    <div className="absolute w-48 h-48 sm:w-32 sm:h-32 rounded-full bg-white/10 -top-9 -left-16 -z-10 blur-sm" />
    <div className="absolute w-72 h-72 sm:w-56 sm:h-56 rounded-full bg-white/10 -bottom-24 -right-14 -z-10 blur-sm" />
    <div className="absolute w-24 h-24 rounded-full bg-white/5 top-1/4 -right-8 -z-10 blur-sm" />
    <div className="absolute w-40 h-40 rounded-full bg-white/5 bottom-1/3 left-20 -z-10 blur-sm" />
    <div className="absolute w-64 h-64 rounded-full bg-white/5 -top-20 right-1/4 -z-10 blur-sm" />
  </div>
);

export default Banner;
