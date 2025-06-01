"use client";
import React, { useState, useContext } from "react";
import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "../components/ui/navbar-menu";
import CustomButton from "./ui/CustomButton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import icon from "../public/reshot-icon-beer-D3X8V2SQAP.svg";
import { useRouter } from "next/navigation";
import { NFTContext } from "@/context/NFTContext";

const ButtonGroup = ({
  setActive,
  router,
}: {
  setActive: any;
  router: ReturnType<typeof useRouter>;
}) => {
  const { connectWallet, currentAccount, disconnectWallet } = useContext(
    NFTContext
  ) as {
    connectWallet: () => void;
    currentAccount: string | null;
    disconnectWallet: () => void;
  };
  const hasConnectedWallet = true;

  return currentAccount ? (
    <div className="flex items-center gap-3">
      <CustomButton
        name="Create"
        styles="bg-pink-700 py-2 px-4 text-sm font-semibold rounded-md hover:bg-pink-600 transition-colors duration-200"
        handleClick={() => {
          setActive("");
          router.push("/create-nft");
        }}
      />
      <CustomButton
        name="Disconnect Wallet"
        styles="bg-pink-700 py-2 px-4 text-sm font-semibold rounded-md hover:bg-pink-600 transition-colors duration-200"
        handleClick={disconnectWallet}
      />
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <CustomButton
        name="Connect Wallet"
        styles="bg-pink-700 py-2 px-4 text-sm font-semibold rounded-md hover:bg-pink-600 transition-colors duration-200"
        handleClick={connectWallet}
      />
    </div>
  );
};

const NavbarDemo = ({ className }: { className?: string }) => {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-6 inset-x-0 max-w-5xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <Link href="/" className="flex items-center gap-2 text-sm font-medium">
          <div>Home</div>
        </Link>

        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col gap-3 text-sm p-2">
            <HoveredLink href="/web-dev">Web Development</HoveredLink>
            <HoveredLink href="/interface-design">Interface Design</HoveredLink>
            <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
            <HoveredLink href="/branding">Branding</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Products">
          <div className="text-sm grid grid-cols-2 gap-6 p-3">
            <ProductItem
              title="Algochurn"
              href="https://algochurn.com"
              src="https://assets.aceternity.com/demos/algochurn.webp"
              description="Prepare for tech interviews like never before."
            />
            <ProductItem
              title="Tailwind Master Kit"
              href="https://tailwindmasterkit.com"
              src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
              description="Production ready Tailwind css components for your next project"
            />
            <ProductItem
              title="Moonbeam"
              href="https://gomoonbeam.com"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
              description="Never write from scratch again. Go from idea to blog in minutes."
            />
            <ProductItem
              title="Rogue"
              href="https://userogue.com"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
              description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Pricing">
          <div className="flex flex-col gap-3 text-sm p-2">
            <HoveredLink href="/hobby">Hobby</HoveredLink>
            <HoveredLink href="/individual">Individual</HoveredLink>
            <HoveredLink href="/team">Team</HoveredLink>
            <HoveredLink href="/enterprise">Enterprise</HoveredLink>
          </div>
        </MenuItem>
        <ButtonGroup setActive={setActive} router={router} />
      </Menu>
    </div>
  );
};

export default NavbarDemo;
