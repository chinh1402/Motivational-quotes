import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <footer className="mt-auto w-full">
        <div className="flex">
          <Link
            to={"/"}
            className="text-[1.2rem] leading-[2.4rem] font-normal text-[#000] dark:text-textColor-dark"
          >
            Why MQ?
          </Link>
        </div>
        <div className="flex justify-between">
          <Link
            to={"/"}
            className="text-[1.2rem] leading-[2.4rem] font-normal text-[#000] dark:text-textColor-dark"
          >
            Privacy policy
          </Link>
          <Link
            to={"/"}
            className="text-[1.2rem] leading-[2.4rem] font-normal text-[#000] dark:text-textColor-dark"
          >
            Term & Conditions
          </Link>
        </div>
      </footer>
    </>
  );
}

export default Footer;
