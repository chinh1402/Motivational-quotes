import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTag } from "../../../../redux/slices/adminQuoteSlices"; // Assuming you have a deleteQuote action

import { resetError } from "../../../../redux/slices/adminQuoteSlices";
import ErrorToast from "../../../../components/Custom/Toasts/ErrorToast";

const DeleteTagModal = ({ isOpen, onClose, tagId }) => {
  const [showErrorToast, setShowErrorToast] = useState(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.admin); // Get loading and error from Redux state

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

  const handleDelete = async () => {
    try {
      await dispatch(deleteTag(tagId)).unwrap(); // Dispatch the deleteQuote action
      onClose(); // Close modal after successful deletion
    } catch (err) {
      console.error("Failed to delete Tag:", err);
    }
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-pageBg-light dark:bg-pageBg-dark w-[400px] px-[20px] pt-[20px] pb-[40px] rounded-lg shadow-lg relative">
        <h2 className="text-[2rem] font-medium text-center mb-4 dark:text-textColor-dark">
          Delete Tag
        </h2>
        <p className="text-[1.3rem] text-center mb-6 dark:text-textColor-dark">
          Are you sure you want to delete this Tag?
        </p>

        <div className="flex justify-around mt-4">
          {/* Cancel Button */}
          <button
            className="bg-gray-300 text-black px-[16px] py-[6px] rounded-[8px] font-medium"
            onClick={onClose}
          >
            Cancel
          </button>

          {/* Delete Button */}
          <button
            className="bg-red-600 dark:bg-primary-dark text-white px-[16px] py-[6px] rounded-[8px] font-medium"
            onClick={handleDelete}
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>

        {/* Error Handling */}
        {error && (
            showErrorToast && <ErrorToast message={error.error} />
          )}

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

export default DeleteTagModal;
