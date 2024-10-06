import React, { useState, useEffect } from "react";

function CustomSelect({ value, options, onSelect, className, displayValues, readOnly }) {
  const [selectedOption, setSelectedOption] = useState(options[0]); // Default selected option
  const [isOpen, setIsOpen] = useState(false); // To toggle the dropdown

  const handleSelect = (option) => {
    if (!readOnly) {
      setSelectedOption(option);
      setIsOpen(false); // Close dropdown after selecting
      onSelect(option); // Call parent function to set the selected option
    }
  };

  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  return (
    <div className={`relative ${className} `}>
      {/* Display the selected option */}
      <div
        onClick={() => !readOnly && setIsOpen(!isOpen)}
        className={`select focus:outline-none focus:border-none w-[114px] max-w-xs bg-white border border-[#D1D5DB] px-[16px] py-[4px] cursor-pointer text-[1.2rem] dark:bg-[#333] dark:outline-none dark:border-[transparent]
         dark:text-textColor-dark ${readOnly ? "opacity-[70%] cursor-default" : ""}`}
      >
        {displayValues ? displayValues[selectedOption] : selectedOption}
      </div>

      {/* Dropdown Options */}
      {!readOnly && isOpen && (
        <ul className="absolute mt-[-4px] w-[114px] bg-white border border-[#D1D5DB] shadow-lg z-[100] rounded-bl-[8px] rounded-br-[8px] overflow-hidden text-[#374151] dark:bg-[#333] dark:outline-none dark:border-[transparent] dark:text-textColor-dark ">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-[16px] py-[4px] cursor-pointer hover:bg-primary-light active:bg-primary-light hover:text-textColor-light active:text-textColor-light overflow-hidden font-normal height=[24px] text-[12px] dark:bg-[#333] dark:outline-none dark:border-[transparent] dark:text-textColor-dark dark:hover:bg-primary-dark dark:hover:text-[#fff]" // Hover and active styles
              onClick={() => handleSelect(option)}
            >
              {displayValues ? displayValues[index] : option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;
