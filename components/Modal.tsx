import assets from "@/assets";
import Image from "next/image";
import React, { ReactNode, useRef } from "react";

interface ModalProps {
  header: ReactNode;
  body: ReactNode;
  footer: ReactNode;
  handleClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ header, body, footer, handleClose }) => {
  const handleClickOutside = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };
  const modalRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-10"
      onClick={(e) => handleClickOutside(e)}
    >
      <div
        ref={modalRef}
        className="w-2/5 md:w-7/12 sm:w-2/4 flex flex-col rounded-lg bg-slate-700 shadow-lg border mt-20"
      >
        <div className="flex justify-end mt-5 mr-5 mb-3">
          <div
            className="relative w-3 h-3 cursor-pointer"
            onClick={() => {
              handleClose();
            }}
          >
            <Image
              src={assets.cross.src}
              alt="CLOSE"
              className="rounded-full"
              width={20}
              height={20}
            />
          </div>
        </div>
        <div className="flex justify-center items-center w-full text-center p-4 text-4xl font-semibold">
          <h1>{header}</h1>
        </div>
        <div className="p-10 border-t border-b border-gray-300 ">{body}</div>
        <div className="flex justify-center items-center w-full text-center p-4 text-2xl font-semibold">
          <h1>{footer}</h1>
        </div>
      </div>
    </div>
  );
};

export default Modal;
