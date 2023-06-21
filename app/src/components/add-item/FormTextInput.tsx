import React from "react";

interface IForm {
  placeholder?: string;
  title: string;
  value?: string;
  onChange: (newVal: string) => void;
  errorMessage?: string;
  errorDescription?: string;
}

const FormTextInput: React.FC<IForm> = ({
  title,
  placeholder,
  value,
  onChange,
  errorMessage,
  errorDescription
}) => {
  return (
    <>
      <div className="flex flex-col">
        <p className="font-bold text-xl pb-2 mx-auto">{title}</p>
        <input
          className="border-[1px] rounded-lg px-3 py-2 border-black/10 mx-auto"
          type="text"
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {errorMessage && <p className="text-red-500 text-center pt-1 font-bold">{errorMessage}</p>}
        {errorDescription && <p className="text-red-500 text-center opacity-80">{errorDescription}</p>}
      </div>
    </>
  );
};

export default FormTextInput;
