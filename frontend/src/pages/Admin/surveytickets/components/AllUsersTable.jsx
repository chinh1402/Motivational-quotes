import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import formatDate from "../utils/formatDate";
import UpdateUsersModal from "./UpdateUsersModal";
import DeleteUsersModal from "./DeleteUsersModal";
import displayGender from "../utils/displayGender";
import displayRole from "../utils/displayRole";

function AllUsersTable({ className }) {
  const dispatch = useDispatch();

  // Select quotes and loading state from the Redux store
  const { users, loading, error } = useSelector(
    (state) => state.admin
  ); // Adjust according to your state shape

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const displayUsers = Array.isArray(users)
    ? users
    : [];

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setIsUpdateModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      {isUpdateModalOpen && selectedUser && (
        <UpdateUsersModal
          onClose={closeModal} // Pass close function to the modal
          user={selectedUser}
          isOpen={isUpdateModalOpen}
        />
      )}

      {isDeleteModalOpen && selectedUser && (
        <DeleteUsersModal
          onClose={closeModal} // Pass close function to the modal
          isOpen={isDeleteModalOpen}
          userId={selectedUser._id}
        />
      )}
      <table className="table">
        {/* head */}
        <thead className="bg-pageBg-light dark:bg-pageBg-dark sticky top-0">
          <tr className="font-medium text-[1.3rem] leading-[2.4rem] dark:text-textColor-dark border-[#C7C3BE]">
            <th></th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Country</th>
            <th>Timezone</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Gender</th>
            <th>Date of birth</th>
            <th>Avatar URL</th>
            <th>Role</th>
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
          ) : displayUsers.length > 0 ? (
            displayUsers.map((user, index) => (
              <tr
                className={`font-medium text-[1.3rem] leading-[2.4rem] h-[64px] dark:text-textColor-dark border-transparent ${
                  index % 2 !== 0 ? "bg-[#D0DDCA] dark:bg-[#33200A]" : ""
                }`}
                key={user.id}
              >
                <th>{index + 1}</th>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.country}</td>
                <td>{user.timezone}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{displayGender(user.gender)}</td>
                <td>{formatDate(user.birthDate)}</td>
                <td>{user.avatarURL}</td>
                <td>{displayRole(user.role)}</td>
                <td>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    onClick={() => handleEditClick(user)} // Handle edit click
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
                    onClick={() => handleDeleteClick(user)} // Handle edit click
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
              <td colSpan="4">No users available.</td>
            </tr>
          )}

          {displayUsers.length < 10 &&
            !loading &&
            !error &&
            Array.from({ length: 10 - displayUsers.length }).map(
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

export default AllUsersTable;
