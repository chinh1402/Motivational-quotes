import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import formatDate from "../utils/formatDate";
import UpdateQuoteSequenceModal from "./UpdateQuoteSequenceModal";
import DeleteQuoteSequenceModal from "./DeleteQuoteSequenceModal";
import formatTime from "../utils/formatTime";

function AllQuoteSequencesTable({ className }) {
  const dispatch = useDispatch();

  // Select quotes and loading state from the Redux store
  const { quoteSequences, loading, error } = useSelector(
    (state) => state.admin
  ); // Adjust according to your state shape

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuoteSequence, setSelectedQuoteSequence] = useState(null);

  const displayQuoteSequences = Array.isArray(quoteSequences)
    ? quoteSequences
    : [];

  const handleEditClick = (quoteSequence) => {
    setSelectedQuoteSequence(quoteSequence);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (quoteSequence) => {
    setSelectedQuoteSequence(quoteSequence);
    setIsDeleteModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setIsUpdateModalOpen(false);
    setSelectedQuoteSequence(null);
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      {isUpdateModalOpen && selectedQuoteSequence && (
        <UpdateQuoteSequenceModal
          onClose={closeModal} // Pass close function to the modal
          quoteSequence={selectedQuoteSequence}
          isOpen={isUpdateModalOpen}
        />
      )}

      {isDeleteModalOpen && selectedQuoteSequence && (
        <DeleteQuoteSequenceModal
          onClose={closeModal} // Pass close function to the modal
          isOpen={isDeleteModalOpen}
          sequenceId={selectedQuoteSequence._id}
        />
      )}
      <table className="table">
        {/* head */}
        <thead className="bg-pageBg-light dark:bg-pageBg-dark sticky top-0">
          <tr className="font-medium text-[1.3rem] leading-[2.4rem] dark:text-textColor-dark border-[#C7C3BE]">
            <th></th>
            <th>Email</th>
            <th>Type</th>
            <th>Tags</th>
            <th>Timezone</th>
            <th>Send at</th>
            <th>Start sending day</th>
            <th>Last sending day</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr
              key={"Loading"}
              className="font-medium text-[1.3rem] leading-[2.4rem] h-[640px] dark:text-textColor-dark"
            >
              <td colSpan="4">Loading...</td>
            </tr>
          ) : displayQuoteSequences.length > 0 ? (
            displayQuoteSequences.map((quoteSequence, index) => (
              <tr
                className={`font-medium text-[1.3rem] leading-[2.4rem] h-[64px] dark:text-textColor-dark border-transparent ${
                  index % 2 !== 0 ? "bg-[#D0DDCA] dark:bg-[#33200A]" : ""
                }`}
                key={quoteSequence.id}
              >
                <th>{index + 1}</th>
                <td>{quoteSequence.email}</td>
                <td>{quoteSequence.sequenceType}</td>
                <td>{quoteSequence.tagNames}</td>
                <td>{quoteSequence.timezone}</td>
                <td>{formatTime(quoteSequence.sendAt)}</td>
                <td>{formatDate(quoteSequence.startSendingDay)}</td>
                <td>{formatDate(quoteSequence.lastSendingDay)}</td>
                <td>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    onClick={() => handleEditClick(quoteSequence)} // Handle edit click
                    className="cursor-pointer"
                  >
                    <path
                      d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z"
                      fill="currentColor"
                    />
                  </svg>
                </td>
                <td>
                  <svg
                    clipRule="evenodd"
                    fillRule="evenodd"
                    strokeLinejoin="round"
                    strokeMiterlimit="2"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => handleDeleteClick(quoteSequence)} // Handle edit click
                    className="cursor-pointer"
                  >
                    <path
                      d="m4.015 5.494h-.253c-.413 0-.747-.335-.747-.747s.334-.747.747-.747h5.253v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-.254v15.435c0 .591-.448 1.071-1 1.071-2.873 0-11.127 0-14 0-.552 0-1-.48-1-1.071zm14.5 0h-13v15.006h13zm-4.25 2.506c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm-4.5 0c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm3.75-4v-.5h-3v.5z"
                      fillRule="nonzero"
                      fill="currentColor"
                    />
                  </svg>
                </td>
              </tr>
            ))
          ) : (
            <tr
              key={"no_quotes"}
              className="h-[640px] dark:text-textColor-dark"
            >
              <td colSpan="4">No quotes sequences available.</td>
            </tr>
          )}

          {displayQuoteSequences.length < 10 &&
            !loading &&
            !error &&
            Array.from({ length: 10 - displayQuoteSequences.length }).map(
              (_, index) => (
                <tr
                  className="h-[64px] border-transparent"
                  key={`placeholder-${index}`}
                >
                  <td colSpan="8">&nbsp;</td>
                </tr>
              )
            )}
        </tbody>
      </table>
    </div>
  );
}

export default AllQuoteSequencesTable;
