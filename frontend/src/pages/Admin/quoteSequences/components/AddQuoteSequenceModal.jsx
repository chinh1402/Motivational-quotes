import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addQuoteSequence } from "../../../../redux/slices/adminQuoteSlices";
import { resetError } from "../../../../redux/slices/adminQuoteSlices";
import TagsInput from "../../../../components/Custom/TagsInput";
import CustomSelect from "../../../../components/Custom/CustomSelect";
import ErrorToast from "../../../../components/Custom/Toasts/ErrorToast";
import { Checkbox } from "@/components/ui/checkbox";

const typeoptions = ["random", "daily"];
const AddQuoteModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [sendAt, setSendAt] = useState("");
  const [startSendingDay, setStartSendingDay] = useState("");
  const [lastSendingDay, setLastSendingDay] = useState("");
  const [sequenceType, setSequenceType] = useState(typeoptions[0]);
  const [tagCheckbox, setTagCheckbox] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    if (error) {
      setShowErrorToast(true);

      // Automatically hide the toast after 5 seconds
      const timer = setTimeout(() => {
        setShowErrorToast(false);
        dispatch(resetError()); // Reset the success state after showing the toast
      }, 3000);

      // Cleanup timer
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!tags) newErrors.tags = "Tags are required";
    if (!timezone) newErrors.timezone = "Timezones are required";
    if (!sendAt) newErrors.sendAt = "Time are required";
    if (!startSendingDay) newErrors.startSendingDay = "Date are required";
    if (!lastSendingDay) newErrors.lastSendingDay = "Date are required";
    if (!sequenceType) newErrors.sequenceType = "Sequence Type are required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {

        const inputData = {
          email,
          sequenceType,
          tags,
          tagQueryType: tagCheckbox ? "matchAll" : "matchAny",
          timezone,
          sendAt,
          startSendingDay,
          lastSendingDay,
        };

        const getQuoteSequences = Object.keys(inputData).reduce((acc, key) => {
          const value = inputData[key];
          acc[key] = typeof value === "string" ? value.trim() : value;
          return acc;
        }, {});

        await dispatch(addQuoteSequence(getQuoteSequences)).unwrap(); // Dispatch the addQuote action
        onClose(); // Close modal after successful submission
      } catch (err) {
        console.error("Failed to add quote:", err);
      }
    }
  };

  const handleFocus = (field) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: null, // Clear the error for the focused field
    }));
  };

  const handleClose = () => {
    // Avoid the bug where when you turn off the modal when it's daily, when you come back the input is readOnly
    setSequenceType(typeoptions[0]);
    onClose();
  };

  useEffect(() => {
    if (sequenceType === "daily") {
      setTags("Motivational,Success,Wisdom");
    } else {
      setTags("");
    }
  }, [sequenceType]);

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-pageBg-light dark:bg-pageBg-dark w-[400px] px-[20px] pt-[20px] pb-[40px]  rounded-lg shadow-lg relative">
        <h2 className="text-[2rem] font-medium text-center mb-4 dark:text-textColor-dark ">
          Add a quote sequence
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-[1.3rem] font-medium dark:text-textColor-dark">
              Email
            </label>

            <input
              type="text"
              className={`input focus:outline-none border-[#d5d7da] focus-within:outline-none dark:bg-[#333] dark:outline-none dark:border-[transparent]
                 dark:text-textColor-dark text-[1.3rem] w-full ${
                   errors.email
                     ? "border-red-900 dark:border-primary-dark"
                     : "border-gray-300"
                 }`}
              value={email}
              onInput={(e) => setEmail(e.target.value)}
              onFocus={() => handleFocus("email")}
            />

            {errors.email && (
              <span className="text-red-900 text-sm dark:text-primary-dark">
                {errors.email}
              </span>
            )}
          </div>

          {/* Sequence type Input */}
          <div className="flex items-center">
            <label className="block text-[1.3rem] font-medium dark:text-textColor-dark mr-[8px]">
              Sequence type
            </label>

            <CustomSelect
              value={typeoptions[0]}
              options={typeoptions}
              onSelect={setSequenceType}
            />
            {errors.sequenceType && (
              <span className="text-red-900 text-sm dark:text-primary-dark ml-[8px]">
                {errors.sequenceType}
              </span>
            )}
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-[1.3rem] font-medium mb-[4px] dark:text-textColor-dark">
              Tags
            </label>
            <TagsInput
              value={tags ? tags.split(",").map((tag) => tag.trim()) : []}
              className={`border-[#f5f3f1] focus:outline-[#f5f3f1] `}
              onChange={setTags}
              required={errors.tags}
              onFocusErrorRemove={() => handleFocus("tags")}
              readOnly={sequenceType === "daily"}
            />
            {errors.tags ? (
              <span className="text-red-900 text-sm dark:text-primary-dark">
                {errors.tags}
              </span>
            ) : null}
          </div>

          <div className="flex">
            <span className="text-[1.3rem] text-[#000] dark:text-textColor-dark">
              Match all?
            </span>
            <Checkbox
              className="w-[1.6rem] h-[1.6rem] rounded-[2px] border-[#000] dark:border-textColor-dark ml-[12px]"
              onCheckedChange={(checked) => setTagCheckbox(checked)}
              checked={tagCheckbox}
            />
          </div>

          {/* Timezone Input */}
          <div>
            <label className="block text-[1.3rem] font-medium dark:text-textColor-dark">
              Timezone
            </label>

            <input
              type="text"
              className={`input focus:outline-none border-[#d5d7da] focus-within:outline-none dark:bg-[#333] dark:outline-none dark:border-[transparent]
                 dark:text-textColor-dark text-[1.3rem] w-full read-only:opacity-[70%] ${
                   errors.timezone
                     ? "border-red-900 dark:border-primary-dark"
                     : "border-gray-300"
                 }`}
              value={timezone}
              onInput={(e) => setTimezone(e.target.value)}
              onFocus={() => handleFocus("timezone")}
              readOnly
            />

            {errors.timezone && (
              <span className="text-red-900 text-sm dark:text-primary-dark">
                {errors.timezone}
              </span>
            )}
          </div>

          {/* Send at Input */}
          <div className="flex items-center">
            <label className="block text-[1.3rem] font-medium dark:text-textColor-dark mr-[8px]">
              Send daily at
            </label>

            <input
              type="time"
              className={`input focus:outline-transparent focus:border-none outline-transparent border-none dark:text-textColor-dark dark:bg-[#333] dark:clock-dark text-[1.3rem] ${
                errors.sendAt ? "dark:border-primary-dark" : ""
              }`}
              value={sendAt}
              onChange={(e) => setSendAt(e.target.value)}
              onFocus={() => handleFocus("sendAt")}
            />

            {errors.sendAt && (
              <span className="text-red-900 text-sm dark:text-primary-dark ml-[8px]">
                {errors.sendAt}
              </span>
            )}
          </div>

          {/* Start sending Input */}
          <div className="flex items-center">
            <label className="block text-[1.3rem] font-medium dark:text-textColor-dark mr-[8px]">
              Start sending day
            </label>

            <input
              type="date"
              className={`input focus:outline-none text-[1.3rem] dark:bg-[#333] dark:text-textColor-dark `}
              value={startSendingDay}
              onChange={(e) => setStartSendingDay(e.target.value)}
              onFocus={() => handleFocus("startSendingDay")}
            />

            {errors.startSendingDay && (
              <span className="text-red-900 text-sm dark:text-primary-dark ml-[8px]">
                {errors.startSendingDay}
              </span>
            )}
          </div>

          {/* Last sending day Input */}
          <div className="flex items-center">
            <label className="block text-[1.3rem] font-medium dark:text-textColor-dark mr-[8px]">
              Last sending day
            </label>

            <input
              type="date"
              className={`input focus:outline-none text-[1.3rem] dark:bg-[#333] dark:text-textColor-dark `}
              value={lastSendingDay}
              onChange={(e) => setLastSendingDay(e.target.value)}
              onFocus={() => handleFocus("lastSendingDay")}
            />

            {errors.lastSendingDay && (
              <span className="text-red-900 text-sm dark:text-primary-dark ml-[8px]">
                {errors.lastSendingDay}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#4bc55e] text-white px-[16px] py-[6px] rounded-[8px] font-medium dark:bg-primary-dark"
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Adding..." : "Add a quote sequence"}
          </button>

          {/* Error Handling */}
          {error && showErrorToast && <ErrorToast message={error.error} />}
        </form>

        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-[20px]"
          onClick={handleClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default AddQuoteModal;
