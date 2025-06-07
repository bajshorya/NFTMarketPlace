"use client";
import React from "react";
import { motion } from "motion/react";
import Image from "next/image";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-80 dark:text-white text-sm font-medium px-3 py-2"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_0.8rem)] left-1/2 transform -translate-x-1/2 pt-2">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white dark:bg-black/95 backdrop-blur-md rounded-lg border border-black/10 dark:border-white/10 shadow-lg"
              >
                <motion.div layout className="w-max h-full p-3">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-lg border border-transparent dark:bg-black/90 dark:border-white/10 bg-white shadow-md flex items-center justify-between px-6 py-3"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <a href={href} className="flex items-start gap-2">
      <Image
        src={src}
        width={100}
        height={50}
        alt={title}
        className="rounded-md shadow-md"
      />
      <div>
        <h4 className="text-sm font-semibold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-600 text-xs max-w-[8rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </a>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <a
      {...rest}
      className="text-neutral-600 dark:text-neutral-200 hover:text-black dark:hover:text-white text-sm font-medium px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
    >
      {children}
    </a>
  );
};
