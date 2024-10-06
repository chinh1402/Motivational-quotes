import React, { useState, useEffect } from "react";
import DaisyUICustomToggle from "../../../components/DaisyUI/DaisyUICustomToggle";
import CustomSelect from "../../../components/Custom/CustomSelect";
import AdminHeader from "../../../components/Admin/AdminHeader";
import AdminSidebar from "../../../components/Admin/AdminSidebar";
import CustomPagination from "../../../components/Custom/CustomPagination";

import AllQuotesTable from "./components/AllQuotesTable";
import TagsInput from "../../../components/Custom/TagsInput";

import { useDispatch, useSelector } from "react-redux";
import {
  getQuotes,
  resetSuccess,
} from "../../../redux/slices/adminQuoteSlices";

import SuccessToast from "../../../components/Custom/Toasts/SuccessToast";
import ErrorToast from "../../../components/Custom/Toasts/ErrorToast";

import AddQuoteModal from "./components/AddQuoteModal";

function Quotes() {
  const dispatch = useDispatch();
  const { pagination, toastMessage, error, success, loading } = useSelector(
    (state) => state.admin
  ); // Adjust according to your state shape

  // Cant use camelcase due to QnID
  const selectOptions = ["Author", "QnID", "Content", "Tags"];
  const [selectedOption, setSelectedOption] = useState(selectOptions[0]);
  const [inputValue, setInputValue] = useState(""); // Holds the current input value
  const [debouncedValue, setDebouncedValue] = useState(""); // For debouncing input
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const queryMapping = {
    Author: "author",
    QnID: "quoteNumberId",
    Content: "content",
    Tags: "tags",
  };

  const searchQuery = {
    [queryMapping[selectedOption]]: debouncedValue,
  };

  useEffect(() => {
    if (success) {
      setShowSuccessToast(true);

      // Automatically hide the toast after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        dispatch(resetSuccess()); // Reset the success state after showing the toast
      }, 3000);

      // Cleanup timer
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  useEffect(() => {
    console.log(inputValue);
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
    dispatch(getQuotes(searchQuery));
  }, [debouncedValue, selectedOption, dispatch]);

  const renderInputByOption = () => {
    switch (selectedOption) {
      case "Tags":
        return (
          <TagsInput
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

  return (
    <div className="py-[4rem] grid">
      <div className="mx-[12rem] grid grid-cols-12 gap-x-[3rem]">
        <AdminHeader />
        <span className="col-span-12 text-center font-medium text-[2.4rem] leading-[2.4rem] mt-[80px] mb-[8px] dark:text-textColor-dark">
          Quotes
        </span>
        <div className="col-span-2">
          <AdminSidebar />
        </div>
        <div className="col-span-9">
          <span className="mt-[20px] flex"></span>
          <div className="flex items-center ">
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

            <button
              className=" bg-[#4bc55e] text-textColor-light font-bold text-[1.3rem] py-[8px] px-[15px] ml-[40px] rounded-[16px] dark:text-[#fff] dark:bg-[#B27023]"
              onClick={() => setIsModalOpen(true)} // Open the modal
            >
              + Add new quotes
            </button>
          </div>

          {/* Table here */}

          <AllQuotesTable
            className="mt-[20px] max-h-[640px]"
            getFunction={getQuotes}
          />

          {/* Pagination here */}
          <CustomPagination
            className="mt-[20px]"
            pagination={pagination}
            getFunction={getQuotes}
            searchQuery={searchQuery}
          />
        </div>
        <div className="col-span-1"></div>

        <AddQuoteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {showSuccessToast && <SuccessToast message={toastMessage} />}

        {showErrorToast && <ErrorToast message={error.error} />}

        <div className="relative bottom-[20px]">
          <DaisyUICustomToggle />
        </div>
      </div>
    </div>
  );
}

export default Quotes;
