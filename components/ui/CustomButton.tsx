import React from "react";

type ButtonProps = {
  name: string;
  styles?: string;
  

  handleClick?: () => void; // Add onClick prop
};

const CustomButton = ({ name, styles, handleClick }: ButtonProps) => {
  return (
    <>
      <button
        className={`px-4 py-1  border-0 rounded-xl  text-white font-poppins hover:cursor-pointer ${styles}`}
        onClick={handleClick} // Use the handleClick prop
        type="button"
        data-testid="custom-button"
      >
        {name}
      </button>
    </>
  );
};

export default CustomButton;
