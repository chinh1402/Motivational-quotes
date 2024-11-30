import React, { useState } from "react";
import Header from "../../../components/Client/Header.jsx";
import Footer from "../../../components/Client/Footer.jsx";
import GoogleIcon from "../../../assets/Google.svg";

const LoginPage = () => {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState({});

  const handleGoogleSignup = () => {
    // Redirect directly to the backend to initiate Google OAuth
    window.location.href = "http://localhost:3000/api/google";
  };

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

  return (
    <>
      <div className={`p-[20px] flex flex-col items-start min-h-full`}>
        <Header />
        <h1 className="text-[2rem] leading-[3rem] font-normal self-center dark:text-textColor-dark text-[#000] text-center mt-[3.4rem]">
          Login to Motivational Quote
        </h1>
        <button
          onClick={handleGoogleSignup}
          className="self-center flex items-center px-[28px] py-[8px] border-solid border-[1px] rounded-[30px] border-[#000] min-w-[210px] dark:border-textColor-dark mt-[16px] "
        >
          <div>
            <img src={GoogleIcon} alt="Google Icon" />
          </div>
          <span className="text-[1.4rem] font-normal leading-[2.4rem] dark:text-textColor-dark text-[#000] ml-[12px] ">
            Login with Google
          </span>
        </button>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col mt-[24px] w-full justify-center"
        >
          <div className="mx-[15px]">
            <label className="block text-[1.4rem] font-normal leading-[2rem] text-[#000] dark:text-textColor-dark">
              Username or email
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`w-full border-2 p-[8px] mt-[8px] rounded-[8px] focus:outline-none text-[#000] bg-[#fff] dark:bg-[#333] dark:outline-none dark:border-[transparent] dark:text-textColor-dark  ${
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

          <div className="mx-[15px] mt-[28px]">
            <label className="block text-[1.4rem] font-normal leading-[2rem] text-[#000] dark:text-textColor-dark">
              Password
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`w-full border-2 p-[8px] mt-[8px] rounded-[8px] focus:outline-none text-[#000] bg-[#fff] dark:bg-[#333] dark:outline-none dark:border-[transparent] dark:text-textColor-dark  ${
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

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#4bc55e] text-white px-[12px] py-[6px] rounded-[8px] dark:bg-[#9B7041] w-fit text-[1.4rem] leading-[2rem] font-normal mt-[28px] self-center"
          >
            Login
          </button>
        </form>
        <span className="font-normal text-[10px] leading-[20px] dark:text-textColor-dark text-[#000] self-center mt-[32px]">
          Haven’t signed up yet?
        </span>

        <button
          type="button"
          className="bg-[#09B928] text-white px-[12px] py-[6px] rounded-[8px] w-fit text-[1.4rem] leading-[2rem] font-normal mt-[12px] self-center"
        >
          Sign up for an account
        </button>
        <Footer />
      </div>
    </>
  );
};

export default LoginPage;
