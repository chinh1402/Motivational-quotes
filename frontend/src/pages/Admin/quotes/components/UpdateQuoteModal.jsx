import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateQuote } from "../../../../redux/slices/adminQuoteSlices";
import TagsInput from "../../../../components/Custom/TagsInput";
import { resetError } from "../../../../redux/slices/adminQuoteSlices";
import ErrorToast from "../../../../components/Custom/Toasts/ErrorToast";

const UpdateQuoteModal = ({ isOpen, onClose, quote }) => {
  const [quoteNumberId, setQuoteNumberId] = useState(quote.quoteNumberId || "");
  const [author, setAuthor] = useState(quote.author || "");
  const [content, setContent] = useState(quote.content || "");
  const [tags, setTags] = useState(quote.tagNames || "");
  const [override, setOverride] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrorToast, setShowErrorToast] = useState(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.admin);

  const validateForm = () => {
    const newErrors = {};
    if (!author) newErrors.author = "Author is required";
    if (!content) newErrors.content = "Content is required";
    if (!tags) newErrors.tags = "Tags are required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const quoteData = { quoteNumberId, author, content, tags, override };
        console.log(quoteData)
        await dispatch(updateQuote(quoteData)).unwrap();
        onClose(); // Close modal after successful update
      } catch (err) {
        console.error("Failed to update quote:", err);
      }
    }
  };

  const handleFocus = (field) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: null, // Clear the error for the focused field
    }));
  };

  if (!isOpen) return null; // Don't render if modal is not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-pageBg-light dark:bg-pageBg-dark w-[400px] px-[20px] pt-[20px] pb-[40px]  rounded-lg shadow-lg relative">
        <h2 className="text-[2rem] font-medium text-center mb-4 dark:text-textColor-dark">
          Update a quote
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* QnID Input */}
          <div>
            <label className="block text-[1.3rem] font-medium dark:text-textColor-dark ">QnID</label>
            <input
              type="text"
              value={quoteNumberId}
              onChange={(e) => setQuoteNumberId(e.target.value)}
              className="w-full border-2 px-3 py-2 mt-1 rounded-md focus:outline-none border-gray-300 dark:bg-[#333] dark:outline-none dark:border-[transparent] dark:text-textColor-dark read-only:opacity-[70%]"
              readOnly // Disabled to prevent editing
            />
          </div>

          {/* Author Input */}
          <div>
          <label className="block text-[1.3rem] font-medium dark:text-textColor-dark">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`w-full border-2 px-3 py-2 mt-1 rounded-md focus:outline-none dark:bg-[#333] dark:outline-none dark:border-[transparent] dark:text-textColor-dark ${
                errors.author ? "border-red-900 dark:border-primary-dark" : "border-gray-300"
              }`}
              onFocus={() => handleFocus("author")}
            />
            {errors.author && (
              <span className="text-red-900 text-sm dark:text-primary-dark">{errors.author}</span>
            )}
          </div>

          {/* Content Input */}
          <div>
          <label className="block text-[1.3rem] font-medium dark:text-textColor-dark">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full border-2 px-3 py-2 mt-1 rounded-md focus:outline-none dark:bg-[#333] dark:outline-none dark:border-[transparent] dark:text-textColor-dark ${
                errors.content ? "border-red-900 dark:border-primary-dark" : "border-gray-300"
              }`}
              onFocus={() => handleFocus("content")}
              rows="3"
            />
            {errors.content && (
              <span className="text-red-900 text-sm dark:text-primary-dark">{errors.content}</span>
            )}
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-[1.3rem] font-medium mb-[4px] dark:text-textColor-dark">
              Tags
            </label>
            <TagsInput
              value={tags ? tags.split(",").map(tag => tag.trim()) : []}
              className={`border-[#f5f3f1] focus:outline-[#f5f3f1] `}
              onChange={setTags}
              onFocusErrorRemove={() => handleFocus("tags")}
              required={errors.tags}
            />
            {errors.tags ? (
              <span className="text-red-900 text-sm dark:text-primary-dark">{errors.tags}</span>
            ) : null}
          </div>

          {/* Date Fields */}
          <div className="text-[1rem] text-gray-600 dark:text-textColor-dark">
            <p>Added at: {quote.createdAt}</p>
            <p>Last modified at: {quote.updatedAt}</p>
          </div>

          {/* Override Content Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={override}
              onChange={(e) => setOverride(e.target.checked)}
              className="mr-2"
            />
            <label className="text-[1.3rem] font-medium dark:text-textColor-dark">Override content</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#4bc55e] text-white px-[16px] py-[6px] rounded-[8px] font-medium dark:bg-primary-dark"
            disabled={loading}
          >
            {loading ? "Updating..." : "Edit quote"}
          </button>

          {/* Error Handling */}
          {error && (
            error.error === "A similar quote already exists" 
            ? 
            showErrorToast && <ErrorToast message={error.error + ` with id ${error.similarQuote.quoteNumberId}`} />
            :
            showErrorToast && <ErrorToast message={error.error} />
          )}
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

export default UpdateQuoteModal;
