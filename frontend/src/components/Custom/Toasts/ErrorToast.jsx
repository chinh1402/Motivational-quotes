import React from "react";

function ErrorToast({ message }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the toast when the component mounts
    setIsVisible(true);

    // Automatically hide the toast after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []); // Run effect on component mount

  return (
    <>
      <div className={`${
          isVisible
            ? 'translate-y-0 opacity-100'  // Visible: slide down and fully visible
            : '-translate-y-10 opacity-0'  // Hidden: slide up and invisible
        } transition-all duration-500 ease-in-out bg-red-400 flex items-center rounded-[12px] text-[#fff] p-[16px] min-w-[max-content] absolute top-10 left-1/2 transform -translate-x-1/2 z-50`}>
        <icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <path fill="#fff" d="M16.142 2l5.858 5.858v8.284l-5.858 5.858h-8.284l-5.858-5.858v-8.284l5.858-5.858h8.284zm.829-2h-9.942l-7.029 7.029v9.941l7.029 7.03h9.941l7.03-7.029v-9.942l-7.029-7.029zm-8.482 16.992l3.518-3.568 3.554 3.521 1.431-1.43-3.566-3.523 3.535-3.568-1.431-1.432-3.539 3.583-3.581-3.457-1.418 1.418 3.585 3.473-3.507 3.566 1.419 1.417z" />
          </svg>
        </icon>
        <span className="ml-[8px]">{message}</span>
      </div>
    </>
  );
}

export default ErrorToast;
