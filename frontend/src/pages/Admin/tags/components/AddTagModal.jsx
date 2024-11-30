import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTag } from "../../../../redux/slices/adminQuoteSlices";
import { resetError } from "../../../../redux/slices/adminQuoteSlices";
import ErrorToast from "../../../../components/Custom/Toasts/ErrorToast";
import TagsInput from "../../../../components/Custom/TagsInput";

// name, description, relatedTags, color, icon; name is required
const AddUsersModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [relatedTags, setRelatedTags] = useState("");
  const [color, setColor] = useState("");
  const [icon, setIcon] = useState("");

  const [errors, setErrors] = useState({});
  const [showErrorToast, setShowErrorToast] = useState(false);


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
    if (!name) newErrors.name = "name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const inputData = {
          name,
          description,
          relatedTags,
          color,
          icon,
        };

        const getTags = Object.keys(inputData).reduce((acc, key) => {
          const value = inputData[key];
          if (value !== "") {
            // Only add non-empty values
            acc[key] = typeof value === "string" ? value.trim() : value;
          }
          return acc;
        }, {});

        await dispatch(addTag(getTags)).unwrap(); // Dispatch the addQuote action
        onClose(); // Close modal after successful submission
      } catch (err) {
        console.error("Failed to add user:", err);
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
    onClose();
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 scroll">
      <div className="bg-pageBg-light dark:bg-pageBg-dark w-[400px] px-[20px] pt-[20px] pb-[40px]  rounded-lg shadow-lg relative overflow-y-auto max-h-[80vh]">
        <h2 className="text-[2rem] font-medium text-center mb-4 dark:text-textColor-dark ">
          Add a Tag
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-[1.3rem] font-medium dark:text-textColor-dark">
              Name
            </label>

            <input
              type="text"
              className={`input focus:outline-none border-[#d5d7da] focus-within:outline-none dark:bg-[#333] dark:outline-none dark:border-[transparent]
                 dark:text-textColor-dark text-[1.3rem] w-full ${
                   errors.name
                     ? "border-red-900 dark:border-primary-dark"
                     : "border-gray-300"
                 }`}
              value={name}
              onInput={(e) => setName(e.target.value)}
              onFocus={() => handleFocus("name")}
            />

            {errors.name && (
              <span className="text-red-900 text-sm dark:text-primary-dark">
                {errors.name}
              </span>
            )}
          </div>
          {/* Description Input */}
          <div>
            <label className="block text-[1.3rem] font-medium dark:text-textColor-dark">
              Description
            </label>

            <input
              type="text"
              className={`input focus:outline-none border-[#d5d7da] focus-within:outline-none dark:bg-[#333] dark:outline-none dark:border-[transparent]
                 dark:text-textColor-dark text-[1.3rem] w-full ${
                   errors.description
                     ? "border-red-900 dark:border-primary-dark"
                     : "border-gray-300"
                 }`}
              value={description}
              onInput={(e) => setDescription(e.target.value)}
              onFocus={() => handleFocus("description")}
            />

            {errors.description && (
              <span className="text-red-900 text-sm dark:text-primary-dark">
                {errors.description}
              </span>
            )}
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-[1.3rem] font-medium mb-[4px] dark:text-textColor-dark">
              Related Tags
            </label>
            <TagsInput
              value={relatedTags ? relatedTags.split(",").map(tag => tag.trim()) : []}
              className={`border-[#f5f3f1] focus:outline-[#f5f3f1] `}
              onChange={setRelatedTags}
              onFocusErrorRemove={() => handleFocus("relatedTags")}
            />
            {errors.relatedTags ? (
              <span className="text-red-900 text-sm dark:text-primary-dark">
                {errors.relatedTags}
              </span>
            ) : null}
          </div>

          <div>
            <label className="block text-[1.3rem] font-medium dark:text-textColor-dark">
              Color
            </label>

            <input
              type="text"
              className={`input focus:outline-none border-[#d5d7da] focus-within:outline-none dark:bg-[#333] dark:outline-none dark:border-[transparent]
                 dark:text-textColor-dark text-[1.3rem] w-full ${
                   errors.color
                     ? "border-red-900 dark:border-primary-dark"
                     : "border-gray-300"
                 }`}
              value={color}
              onInput={(e) => setColor(e.target.value)}
              onFocus={() => handleFocus("color")}
            />

            {errors.color && (
              <span className="text-red-900 text-sm dark:text-primary-dark">
                {errors.color}
              </span>
            )}

            <span className="mt-[20px] flex dark:text-textColor-dark">
              Sample:
              <span
                className="ml-[8px]"
                style={{ color: color }} // Apply dynamic color here
              >
                Hello world!!!
              </span>
            </span>

            <span className="mt-[12px] flex dark:text-textColor-dark">Example: #fff, rgba(229, 196, 115, 0.26), hsla(10, 100%, 50%, 0.5), blue</span>
          </div>

          <div>
            <label className="block text-[1.3rem] font-medium dark:text-textColor-dark">
              Icon
            </label>

            <input
              type="text"
              className={`input focus:outline-none border-[#d5d7da] focus-within:outline-none dark:bg-[#333] dark:outline-none dark:border-[transparent]
                 dark:text-textColor-dark text-[1.3rem] w-full ${
                   errors.icon
                     ? "border-red-900 dark:border-primary-dark"
                     : "border-gray-300"
                 }`}
              value={icon}
              onInput={(e) => setIcon(e.target.value)}
              onFocus={() => handleFocus("icon")}
            />

            {errors.icon && (
              <span className="text-red-900 text-sm dark:text-primary-dark">
                {errors.icon}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#4bc55e] text-white px-[16px] py-[6px] rounded-[8px] font-medium dark:bg-primary-dark"
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Adding..." : "Add a tag"}
          </button>

          {/* Error Handling */}
          {error && (
            showErrorToast && <ErrorToast message={error.error} />
          )}
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

export default AddUsersModal;
