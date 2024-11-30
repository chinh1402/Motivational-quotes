import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addQuote } from "../../../../redux/slices/adminQuoteSlices";
import { resetError } from "../../../../redux/slices/adminQuoteSlices";
import ErrorToast from "../../../../components/Custom/Toasts/ErrorToast";
import TagsInput from "../../../../components/Custom/TagsInput";

const AddQuoteModal = ({ isOpen, onClose }) => {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.admin); // Get loading and error from Redux state
  const [showErrorToast, setShowErrorToast] = useState(false);

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
    if (!author) newErrors.author = "Author is required";
    if (!content) newErrors.content = "Content is required";
    if (!tags) newErrors.tags = "Tags are required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const quoteData = { author, content, tags };
        await dispatch(addQuote(quoteData)).unwrap(); // Dispatch the addQuote action
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

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-pageBg-light dark:bg-pageBg-dark w-[400px] px-[20px] pt-[20px] pb-[40px]  rounded-lg shadow-lg relative">
        <h2 className="text-[2rem] font-medium text-center mb-4 dark:text-textColor-dark ">
          Add a quote
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* Author Input */}
          <div>
            <label className="block text-[1.3rem] font-medium dark:text-textColor-dark">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`w-full border-2 px-3 py-2 mt-1 rounded-md focus:outline-none dark:bg-[#333] dark:outline-none dark:border-[transparent] dark:text-textColor-dark ${
                errors.author
                  ? "border-red-900 dark:border-primary-dark"
                  : "border-gray-300"
              }`}
              onFocus={() => handleFocus("author")}
            />
            {errors.author && (
              <span className="text-red-900 text-sm dark:text-primary-dark">
                {errors.author}
              </span>
            )}
          </div>

          {/* Content Input */}
          <div>
            <label className="block text-[1.3rem] font-medium dark:text-textColor-dark">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full border-2 px-3 py-2 mt-1 rounded-md focus:outline-none dark:bg-[#333] dark:outline-none dark:border-[transparent] dark:text-textColor-dark ${
                errors.content
                  ? "border-red-900 dark:border-primary-dark"
                  : "border-gray-300"
              }`}
              onFocus={() => handleFocus("content")}
              rows="3"
            />
            {errors.content && (
              <span className="text-red-900 text-sm dark:text-primary-dark">
                {errors.content}
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
              onFocusErrorRemove={() => handleFocus("tags")}
              required={errors.tags}
            />
            {errors.tags ? (
              <span className="text-red-900 text-sm dark:text-primary-dark">
                {errors.tags}
              </span>
            ) : null}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#4bc55e] text-white px-[16px] py-[6px] rounded-[8px] font-medium dark:bg-primary-dark"
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Adding..." : "Add a quote"}
          </button>

          {/* Error Handling */}
          {error &&
            (error.error === "A similar quote already exists"
              ? showErrorToast && (
                  <ErrorToast
                    message={
                      error.error +
                      ` with id ${error.similarQuote.quoteNumberId}`
                    }
                  />
                )
              : showErrorToast && <ErrorToast message={error.error} />)}
        </form>

        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-[20px]"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default AddQuoteModal;
