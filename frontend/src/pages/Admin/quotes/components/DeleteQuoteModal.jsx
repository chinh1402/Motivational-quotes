import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteQuote } from "../../../../redux/slices/adminQuoteSlices"; // Assuming you have a deleteQuote action

const DeleteQuoteModal = ({ isOpen, onClose, quoteNumberId }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.admin); // Get loading and error from Redux state

  const handleDelete = async () => {
    try {
      await dispatch(deleteQuote(quoteNumberId)).unwrap(); // Dispatch the deleteQuote action
      onClose(); // Close modal after successful deletion
    } catch (err) {
      console.error("Failed to delete quote:", err);
    }
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-pageBg-light dark:bg-pageBg-dark w-[400px] px-[20px] pt-[20px] pb-[40px] rounded-lg shadow-lg relative">
        <h2 className="text-[2rem] font-medium text-center mb-4 dark:text-textColor-dark">
          Delete Quote
        </h2>
        <p className="text-[1.3rem] text-center mb-6 dark:text-textColor-dark">
          Are you sure you want to delete this quote?
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
          <p className="text-red-900 text-[13px] mt-4 text-center break-words">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </p>
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

export default DeleteQuoteModal;
