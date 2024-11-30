import React, { useState, useEffect, useRef } from "react";
import TagItem from "./Tags/TagItem";
import { authenticatedAPI } from "../../services/apiServices";

function TagsInput({ className, value = [], onChange, required, onFocusErrorRemove, readOnly }) {
  const firstInputRef = useRef(null);
  const secondInputRef = useRef(null); // Ref for the second input
  const [maxWidth, setMaxWidth] = useState("400px"); // Initial max-width
  const [inputValue, setInputValue] = useState(""); // Input value for filtering available value
  const [availableTags, setAvailableTags] = useState([]); // Available value from API
  const [filteredTags, setFilteredTags] = useState([]); // Filtered tag suggestions based on user input
  const [isFocused, setIsFocused] = useState(false); // Track focus state

  useEffect(() => {
    // Get the width of the second input after component mounts
    if (secondInputRef.current) {
      const secondInputWidth = secondInputRef.current.offsetWidth;
      setMaxWidth(`${secondInputWidth}px`);
    }
  }, []);

  // Fetch the available value from the API when the component mounts
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await authenticatedAPI.getAllTagNames();
        setAvailableTags(response.data); // Assuming response.data contains an array of tag names
      } catch (error) {
        console.error("Error fetching value:", error);
      }
    };

    fetchTags();
  }, []);

  // Filter value based on user input or show all if input is empty and focused
  useEffect(() => {
    if (inputValue) {
      // Filter value when user types in the input, excluding already selected value
      setFilteredTags(
        availableTags
          .filter(
            (tag) => tag.toLowerCase().includes(inputValue.toLowerCase()) // Case-insensitive filtering
          )
          .filter((tag) => !value.includes(tag)) // Exclude selected value
      );
    } else if (isFocused) {
      // Show all available value when input is focused and empty, excluding selected value
      setFilteredTags(availableTags.filter((tag) => !value.includes(tag)));
    } else {
      setFilteredTags([]); // Clear filtered value if input is not focused or empty
    }
  }, [inputValue, availableTags, JSON.stringify(value), isFocused]);

  // Handle selecting a tag
  const handleSelectTag = (tag) => {
    if (!readOnly && !value.includes(tag)) {
      const newTags = [...value, tag]; // Add the new tag
      onChange(newTags.join(", ")); // Notify parent, join value with a comma and space
    }
    setInputValue(""); // Clear the input field
    setFilteredTags([]); // Clear the filtered suggestions
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    if (!readOnly) {
      const newTags = value.filter((tag) => tag !== tagToRemove); // Remove the selected tag
      onChange(newTags.join(", ")); // Notify parent, join remaining value with a comma and space
    }
  };

  // Handle input focus
  const handleFocus = () => {
    if (!readOnly) {
      setIsFocused(true); // Set focus state to true when input is focused
      if (!inputValue) {
        setFilteredTags(availableTags); // Show all value if input is empty
      }
      if (onFocusErrorRemove) {
        onFocusErrorRemove(); // Trigger error removal on focus
      }
    }
  };
  // Handle input blur
  const handleBlur = () => {
    if (!readOnly) {
      // Delay setting focus state to avoid immediate hiding when selecting a tag
      setTimeout(() => setIsFocused(false), 100);
    }
  };

  return (
    <div className={`relative flex flex-nowrap items-center  ${className} ${readOnly ? "opacity-[70%] cursor-default" : ""}`}>
      {/* Render each selected tag using TagItem */}
      <div
        className={`z-10 flex flex-nowrap overflow-scroll scrollbar-hide`}
        style={{ maxWidth: maxWidth }}
      >
        {Array.isArray(value) && value.length > 0 && value.map((tag, index) => (
          <TagItem
            key={index}
            tag={tag}
            onRemove={handleRemoveTag}
            className={`ml-[4px] mt-[4px]`}
          />
        ))}

        {/* Input for typing and searching value */}
          <input
            ref={firstInputRef}
            type="text"
            placeholder=""
            className={`input focus:outline-none focus:border-none flex-grow px-2 py-1 border bg-transparent relative z-50 min-w-[200px] dark:text-textColor-dark 
              ${readOnly ? "pointer-events-none" : ""}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleFocus} // Show all value when input is focused
            onBlur={handleBlur} // Hide dropdown on blur
          />
      </div>

      <input
        ref={secondInputRef} // Attach ref to second input
        type="text"
        placeholder=""
        className={`absolute w-[100%] input focus:outline-none flex-grow px-2 py-1 z-0 dark:bg-[#333] ${required ? "border-red-900 dark:border-primary-dark dark:border-solid" : "border-[#d1d5db] dark:border-none"} 
        `} // Lower z-index
        onClick={() => firstInputRef.current && firstInputRef.current.focus()} // Focus first input when second input is clicked
        onFocus={onFocusErrorRemove}
      />

      {/* Dropdown with filtered tag suggestions */}
      {filteredTags.length > 0 && !readOnly && (
        <div className="absolute bg-white border rounded-b-[8px] top-[28px] w-full max-h-40 overflow-y-auto z-10 dark:border-none dark:text-[#fff] dark:bg-[#333]">
          {filteredTags.map((tag, index) => (
            <div
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-primary-light hover:text-textColor-light dark:bg-[#333] dark:outline-none dark:border-[transparent] dark:text-textColor-dark dark:hover:bg-primary-dark dark:hover:text-[#fff]"
              onClick={() => handleSelectTag(tag)} // Handle tag selection
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TagsInput;
