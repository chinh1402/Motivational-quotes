import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/unregisteredSlices";

function AdminHeader() {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      dispatch(logout());
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };
  return (
    <>
      <a
        href="/admin"
        className="col-span-1 text-[2.4rem] font-bold leading-[4.8rem] dark:text-textColor-dark"
      >
        <span className="text-primary-light dark:text-primary-dark">MQ</span>
        Admin.
      </a>
      <div className="col-span-10"></div>
      <a
        href="/login"
        className="col-span-1 text-[1.6rem] font-light leading-[2.4rem] p-[12px] w-[100px] dark:text-textColor-dark"
        onClick={handleLogout}
      >
        Sign out
      </a>
    </>
  );
}

export default AdminHeader;
