import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"; // Import Link

function CustomPagination({ className, pagination, getFunction, searchQuery }) {
  if (!pagination) {
    return null; // Or a loading spinner/message
  }
  const dispatch = useDispatch();

  let { totalPages, currentPage } = pagination;

  // Helper function to generate the page numbers
  const generatePages = () => {
    const pages = [];

    if (totalPages <= 5) {
      // If there are 5 or fewer pages, show them all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // If total pages are greater than 5, show page numbers dynamically
      pages.push(1); // First page is always shown

      //   Weird ass bug patch, if I dont do parsing like this, it will convert to string.. Might have to look at that later
      currentPage = Number(currentPage);
      // Pages in the middle: when currentPage is greater than 3
      if (currentPage > 3) {
        pages.push("..."); // Ellipsis before the middle pages
      }

      //current page = 10 => start = 9, end = 11
      // Pages surrounding the current page

      const startPage = Math.max(2, currentPage - 1); // Ensure the pages start at 2 or higher
      const endPage = Math.min(totalPages - 1, currentPage + 1); // Ensure the pages end at totalPages-1 or lower
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Ellipsis after the middle pages when currentPage is less than totalPages - 2
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show the last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  const handlePagination = (page) => {
    dispatch(getFunction({ page: page, ...searchQuery }));
  };

  return (
    <div className={`flex justify-between ${className}`}>
      <button
        className={`px-2 py-1 flex ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed disabled:text-textColor-dark"
            : "text-primary-light dark:text-primary-dark"
        }`}
        disabled={currentPage === 1}
        onClick={() => handlePagination(currentPage - 1)}
      >
        <svg
          clipRule="evenodd"
          fillRule="evenodd"
          strokeLinejoin="round"
          strokeMiterlimit="2"
          viewBox="0 0 24 24"
          height="15"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m9.474 5.209s-4.501 4.505-6.254 6.259c-.147.146-.22.338-.22.53s.073.384.22.53c1.752 1.754 6.252 6.257 6.252 6.257.145.145.336.217.527.217.191-.001.383-.074.53-.221.293-.293.294-.766.004-1.057l-4.976-4.976h14.692c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-14.692l4.978-4.979c.289-.289.287-.761-.006-1.054-.147-.147-.339-.221-.53-.221-.191-.001-.38.071-.525.215z"
            fillRule="nonzero"
            fill="currentColor"
          />
        </svg>
        Previous page
      </button>

      <ul className="flex space-x-2 text-[13px]">
        {pages.map((page, index) => (
          <li key={index}>
            {typeof page === "number" ? (
              <Link
                to="#"
                className={`px-3 py-1 rounded transition-colors duration-200
          ${
            page == currentPage
              ? "text-primary-light dark:text-primary-dark"
              : "text-[#000] dark:text-textColor-dark"
          }`}
                onClick={() => handlePagination(page)}
              >
                {page}
              </Link>
            ) : (
              <span className="px-3 py-1">...</span>
            )}
          </li>
        ))}
      </ul>

      <button
        className={`px-2 py-1 flex ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed disabled:text-textColor-dark"
            : "text-primary-light dark:text-primary-dark"
        }`}
        disabled={currentPage === totalPages}
        onClick={() => handlePagination(currentPage + 1)}
      >
        Next page
        <svg
          clipRule="evenodd"
          fillRule="evenodd"
          strokeLinejoin="round"
          strokeMiterlimit="2"
          viewBox="0 0 24 24"
          height="15"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m14.523 18.787s4.501-4.505 6.255-6.26c.146-.146.219-.338.219-.53s-.073-.383-.219-.53c-1.753-1.754-6.255-6.258-6.255-6.258-.144-.145-.334-.217-.524-.217-.193 0-.385.074-.532.221-.293.292-.295.766-.004 1.056l4.978 4.978h-14.692c-.414 0-.75.336-.75.75s.336.75.75.75h14.692l-4.979 4.979c-.289.289-.286.762.006 1.054.148.148.341.222.533.222.19 0 .378-.072.522-.215z"
            fillRule="nonzero"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}

export default CustomPagination;
