import React from "react";

function TextInput({ value, onChange, className }) {
  return (
    <input
      type="number"
      className={`input focus:outline-none border-[#d5d7da] focus-within:outline-none dark:bg-[#333] dark:outline-none dark:border-[transparent] dark:text-textColor-dark ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default TextInput;
