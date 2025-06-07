"use client";
import Input from "@/components/Input";
import CustomButton from "@/components/ui/CustomButton";
import { NFTContext } from "@/context/NFTContext";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { defaultStyles, FileIcon } from "react-file-icon";
import { useRouter } from "next/navigation";

const CreateNFT = () => {
  const { nftCurrency, uploadToIPFS, createNFT } = useContext(NFTContext);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [formInput, setFormInput] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setIsLoading(true);
      setError(null);
      try {
        const file = acceptedFiles[0];
        const url = await uploadToIPFS(file);
        if (url) {
          setFileUrl(url);
        } else {
          setError("Failed to upload file to IPFS");
        }
      } catch (err) {
        setError("Error uploading file");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [uploadToIPFS]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".svg"],
      "video/*": [".webm", ".mp4"],
      "audio/*": [".mp3"],
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

  useEffect(() => {}, [formInput]);

  return (
    <div className="py-5 px-4 sm:px-6 min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-poppins font-bold text-3xl mb-8 text-white">
          Create NFT
        </h1>
        {error && <p className="text-red-500 mb-4 font-poppins">{error}</p>}
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
            {isLoading && (
              <p className="mt-4 text-gray-300">Uploading to IPFS...</p>
            )}
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
        <Input
          inputType="text"
          title="Name"
          placeholder="NFT Name"
          handleClick={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            setFormInput({ ...formInput, name: e.target.value });
          }}
        />
        <Input
          inputType="textarea"
          title="Description"
          placeholder="NFT Description"
          handleClick={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            setFormInput({ ...formInput, description: e.target.value });
          }}
        />
        <Input
          inputType="number"
          title="Price"
          placeholder="NFT Price"
          handleClick={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            setFormInput({ ...formInput, price: e.target.value });
          }}
        />
        <div className="flex items-center mt-2">
          <p className="font-poppins text-white text-xl ml-2">{nftCurrency}</p>
        </div>
        <div className="flex items-center mt-10">
          <CustomButton
            name={isLoading ? "Creating NFT..." : "Create NFT"}
            styles={`bg-pink-700 py-3 px-6 text-lg hover:cursor-pointer hover:bg-pink-400 transition-colors duration-300 rounded-lg font-semibold ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            handleClick={() => createNFT(formInput, fileUrl ?? "", router)}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
