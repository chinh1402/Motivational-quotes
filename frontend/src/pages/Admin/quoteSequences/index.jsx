import React, { useState, useEffect } from "react";
import DaisyUICustomToggle from "../../../components/DaisyUI/DaisyUICustomToggle";
import CustomSelect from "../../../components/Custom/CustomSelect";
import AdminHeader from "../../../components/Admin/AdminHeader";
import AdminSidebar from "../../../components/Admin/AdminSidebar";
import CustomPagination from "../../../components/Custom/CustomPagination";
import AllQuoteSequencesTable from "./components/AllQuoteSequencesTable";
import TagsInput from "../../../components/Custom/TagsInput";

import { useDispatch, useSelector } from "react-redux";
import {
  getQuoteSequences,
  resetSuccess,
} from "../../../redux/slices/adminQuoteSlices";
import { Checkbox } from "@/components/ui/checkbox";

import SuccessToast from "../../../components/Custom/Toasts/SuccessToast";
import AddQuoteSequencesModal from "./components/AddQuoteSequenceModal";

const typeoptions = ["random", "daily"];
const selectOptions = [
  "Email",
  "Type",
  "Tags",
  "Timezone",
  "Send at",
  "Start Date",
  "Last Date",
];

const queryMapping = {
  Email: "email",
  Type: "sequenceType",
  Tags: "tags",
  Timezone: "timezone",
  "Send at": "sendAt",
  "Start Date": "startSendingDay",
  "Last Date": "lastSendingDay",
};

function QuoteSequence() {
  const dispatch = useDispatch();
  const { pagination, toastMessage, error, success, loading } = useSelector(
    (state) => state.admin
  ); // Adjust according to your state shape
  const [selectedOption, setSelectedOption] = useState(selectOptions[0]);
  const [inputValue, setInputValue] = useState(""); // Holds the current input value
  const [debouncedValue, setDebouncedValue] = useState(""); // For debouncing input
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagCheckbox, setTagCheckbox] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const searchQuery = {
    [queryMapping[selectedOption]]: debouncedValue,
  };

  useEffect(() => {
    console.log(searchQuery);
  }, [debouncedValue]);

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
    if (!tagCheckbox) {
      searchQuery.tagQueryType = "matchAny";
    }
    dispatch(getQuoteSequences(searchQuery));
  }, [debouncedValue, selectedOption, dispatch, tagCheckbox]);

  const renderInputByOption = () => {
    switch (selectedOption) {
      case "Tags":
        return (
          <>
            <TagsInput
              value={
                inputValue ? inputValue.split(",").map((tag) => tag.trim()) : []
              }
              onChange={setInputValue}
              className={"flex-grow"}
            />
            <span className="text-[1.3rem] text-[#000] dark:text-textColor-dark ml-[1.2rem]">
              Match all?
            </span>
            <Checkbox
              className="w-[1.6rem] h-[1.6rem] rounded-[2px] border-[#000] dark:border-textColor-dark ml-[8px]"
              defaultChecked
              onCheckedChange={(checked) => setTagCheckbox(checked)}
              checked={tagCheckbox}
            />
          </>
        );
      case "Type":
        console.log("Custom shelect");
        return (
          <CustomSelect
            value={typeoptions[0]}
            options={typeoptions}
            onSelect={setInputValue}
            className={"flex-grow"}
          />
        );
      case "Start Date":
      case "Last Date":
        return (
          <div className="relative flex-grow">
            <input
              type="date"
              className={`input focus:outline-none text-[1.3rem] dark:bg-[#333] dark:text-textColor-dark read-only:opacity-[70%]`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        );
      case "Send at":
        return (
          <div className="relative flex-grow">
            <input
              type="time"
              className={`input focus:outline-transparent focus:border-none outline-transparent border-none dark:text-textColor-dark dark:bg-[#333] dark:clock-dark text-[1.3rem]`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
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
          Quotes Sequences
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
              + Add new quote sequences
            </button>
          </div>

          {/* Table here */}

          <AllQuoteSequencesTable
            className="mt-[20px] max-h-[640px]"
            getFunction={getQuoteSequences}
          />

          {/* Pagination here */}
          <CustomPagination
            className="mt-[20px]"
            pagination={pagination}
            getFunction={getQuoteSequences}
            searchQuery={searchQuery}
          />
        </div>
        <div className="col-span-1"></div>

        <AddQuoteSequencesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {showSuccessToast && <SuccessToast message={toastMessage} />}

        <div className="relative bottom-[20px]">
          <DaisyUICustomToggle />
        </div>
      </div>
    </div>
  );
}

export default QuoteSequence;
