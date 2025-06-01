"use client";
import Input from "@/components/Input";
import CustomButton from "@/components/ui/CustomButton";
import { NFTContext } from "@/context/NFTContext";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { defaultStyles, FileIcon } from "react-file-icon";
interface NFTContextType {
  nftCurrency: string;
}
const page = () => {
  const { nftCurrency } = useContext(NFTContext) as NFTContextType;
  const [fileUrl, setFileUrl] = React.useState<string | null>(null);
  const [formInput, setFormInput] = React.useState({
    name: "",
    description: "",
    price: "",
  });
  const onDrop = useCallback(() => {
    //upload image to blockchain
  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxSize: 50000000,
  });
  const fileStyle = useMemo(
    () =>
      `bg-gray-900 border border-gray-500 flex flex-col items-center justify-center p-6 rounded-md border-dashed w-full mx-2 sm:mx-4 h-[200px]
      ${isDragActive && "border-blue-500"}
      ${isDragAccept && "border-green-500"}   
      ${isDragReject && "border-red-500"}      
    `,
    [isDragActive, isDragAccept, isDragReject]
  );
  useEffect(() => {
    console.log(formInput);
  }, [formInput]);
  return (
    <div className="py-8 px-4 sm:px-6 min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-poppins font-bold text-3xl mb-8 text-white">
          Create NFT
        </h1>
        <div>
          <p className="font-poppins font-semibold text-xl mb-4 text-white">
            Upload File
          </p>
          <div className="mb-6">
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center text-center">
                <p className="font-poppins font-light text-lg text-gray-300">
                  JPG, PNG, GIF, SVG, WEBM, MP3
                </p>
                <div className="mt-4 w-12 h-12">
                  <FileIcon extension="doc" {...defaultStyles.doc} />
                </div>
                <p className="font-poppins font-light text-sm mt-4 text-gray-400">
                  Drag and Drop File
                </p>
                <p className="font-poppins font-light text-xs text-gray-500">
                  Or Browse Media on your Device
                </p>
              </div>
            </div>
            {fileUrl && (
              <div className="mt-6">
                <img
                  src={fileUrl}
                  alt="Preview"
                  className="w-full h-auto rounded-lg max-w-md mx-auto"
                />
              </div>
            )}
          </div>
        </div>
        {/* Use the Input component for NFT Name, Description, and Price */}
        <Input
          inputType="text"
          title="Name"
          placeholder="NFT Name"
          handleClick={(e) => {
            setFormInput({ ...formInput, name: e.target.value });
          }}
        />
        <Input
          inputType="textarea"
          title="Description"
          placeholder="NFT Description"
          handleClick={(e) => {
            setFormInput({ ...formInput, description: e.target.value });
          }}
        />
        <Input
          inputType="number"
          title="Price"
          placeholder="NFT Price"
          handleClick={(e) => {
            setFormInput({ ...formInput, price: e.target.value });
          }}
        />
        <div className="flex items-center mt-2">
          <p className="font-poppins text-white text-xl ml-2">{nftCurrency}</p>
        </div>
        <div className="flex items-center mt-10">
          <CustomButton
            name="Create NFT"
            styles="bg-pink-700 py-3 px-6 text-lg hover:cursor-pointer hover:bg-pink-400 transition-colors duration-300 rounded-lg font-semibold"
            handleClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
