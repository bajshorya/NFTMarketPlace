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
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <div>Home</div>
        </Link>

        <Link
          href="/listed-nft"
          className="flex items-center gap-2 text-lg font-bold"
        >
          <div>Your Listings</div>
        </Link>
        <Link
          href="/my-nft"
          className="flex items-center gap-2 text-lg font-bold"
        >
          <div>My NFT's</div>
        </Link>

        <ButtonGroup setActive={setActive} router={router} />
      </Menu>
    </div>
  );
};

export default NavbarDemo;
