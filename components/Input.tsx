const Input = ({
  inputType,
  title,
  placeholder,
  handleClick,
}: {
  inputType: string;
  title: string;
  placeholder: string;
  handleClick: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}) => (
  <div className="mt-6">
    <p className="font-poppins font-semibold text-xl text-white mb-2">
      {title}
    </p>
    {inputType === "textarea" ? (
      <textarea
        className="font-poppins bg-gray-900 border border-gray-500 text-white placeholder-gray-400 w-full rounded-lg outline-none text-base mt-2 px-4 py-3 resize-y"
        placeholder={placeholder}
        rows={6}
        onChange={handleClick}
      />
    ) : (
      <input
        type={inputType}
        className="font-poppins bg-gray-900 border border-gray-500 text-white placeholder-gray-400 w-full rounded-lg outline-none text-base mt-2 px-4 py-3"
        placeholder={placeholder}
        onChange={handleClick}
      />
    )}
  </div>
);
export default Input;
