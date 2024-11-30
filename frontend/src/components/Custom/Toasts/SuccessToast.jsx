import React, { useState, useEffect } from "react";

function SuccessToast({ message }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the toast when the component mounts
    setIsVisible(true);

    // Automatically hide the toast after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []); // Run effect on component mount

  return (
    <>
      <div
        className={`${
          isVisible
            ? "translate-y-0 opacity-100" // Visible: slide down and fully visible
            : "-translate-y-10 opacity-0" // Hidden: slide up and invisible
        } transition-all duration-500 ease-in-out bg-green-400 flex items-center rounded-[12px] text-[#fff] p-[16px] min-w-[max-content] fixed top-10 left-1/2 transform -translate-x-1/2 z-50`}
      >
        <icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#fff"
          >
            <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.25 8.891l-1.421-1.409-6.105 6.218-3.078-2.937-1.396 1.436 4.5 4.319 7.5-7.627z" />
          </svg>
        </icon>
        <span className="ml-[8px]">{message}</span>
      </div>
    </>
  );
}

export default SuccessToast;
