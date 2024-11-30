import React, { useState, useEffect } from "react";
import CustomSelect from "../../../../../components/Custom/CustomSelect";
import TagsInput from "../../../../../components/Custom/TagsInput";
import CustomPagination from "../../../../../components/Custom/CustomPagination";
import { getUserfavorites } from "../../../../../redux/slices/adminQuoteSlices";
import UserFavoriteTable from "./UserFavoriteTable";
import { useDispatch, useSelector } from "react-redux";


const selectOptions = ["Author", "QnID", "Content", "Tags"];

function UserFavoritesModal({ onClose, user_id, isOpen }) {
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState(selectOptions[0]);
  const [inputValue, setInputValue] = useState(""); // Holds the current input value
  const [debouncedValue, setDebouncedValue] = useState(""); // For debouncing input
  const { paginationForUserFavorite, toastMessage, error, success, loading } = useSelector(
    (state) => state.admin
  ); // Adjust according to your state shape

  const queryMapping = {
    Author: "author",
    QnID: "quoteNumberId",
    Content: "content",
    Tags: "tags",
  };

  const searchQuery = {
    [queryMapping[selectedOption]]: debouncedValue,
    user_id,
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 1000);

    // Cleanup function: Clear the timer if the user keeps typing
    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  useEffect(() => {
    // Dispatch the action with the search query
    dispatch(getUserfavorites(searchQuery));
  }, [debouncedValue, selectedOption, dispatch]);

  const renderInputByOption = () => {
    switch (selectedOption) {
      case "Tags":
        return (
          <TagsInput
            value={
              inputValue ? inputValue.split(",").map((tag) => tag.trim()) : []
            }
            onChange={setInputValue}
            className={"flex-grow"}
          />
        );
      case "QnID":
        return (
          <input
            type="number"
            className={`input focus:outline-none border-[#d5d7da] focus-within:outline-none dark:bg-[#333] dark:outline-none dark:border-[transparent] dark:text-textColor-dark flex-grow no-spinner text-[1.3rem]`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        );
      default:
        return (
          <input
            type="text"
            className={`input focus:outline-none border-[#d5d7da] focus-within:outline-none dark:bg-[#333] dark:outline-none dark:border-[transparent]
                 dark:text-textColor-dark text-[1.3rem] flex-grow `}
            value={inputValue}
            onInput={(e) => setInputValue(e.target.value)}
          />
        );
    }
  };

  const handleSelectChange = (option) => {
    setInputValue(""); // Clear the input value when changing options
    setDebouncedValue(""); // Clear the input value when changing options
    setSelectedOption(option);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 scroll">
      <div className="bg-pageBg-light dark:bg-pageBg-dark px-[20px] pt-[20px] pb-[40px] rounded-lg shadow-lg relative overflow-y-auto max-h-[80vh] w-[1000px]">
        <h2 className="text-[2rem] font-medium text-center mb-4 dark:text-textColor-dark ">
          User favorite quote list
        </h2>

        <div className="flex items-center mt-[20px]">
          <span className="font-medium mr-[8px] dark:text-textColor-dark">
            Find by:
          </span>
          <CustomSelect
            value={selectOptions[0]}
            options={selectOptions}
            onSelect={handleSelectChange}
          />
          <span className="font-medium ml-[20px] mr-[12px] dark:text-textColor-dark">
            Value:
          </span>
          {renderInputByOption()}
        </div>

        <UserFavoriteTable
          className="mt-[20px] max-h-[540px]"
          getFunction={getUserfavorites}
          tableHeightScaledByItem={8}
        />

        {/* Pagination here */}
        <CustomPagination
          className="mt-[20px]"
          pagination={paginationForUserFavorite}
          getFunction={getUserfavorites}
          searchQuery={searchQuery}
        />

        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-[20px]"
          onClick={handleClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default UserFavoritesModal;
