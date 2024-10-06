import React from "react";
import { useLocation, Link } from "react-router-dom"; // Import Link

function AdminSidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="w-[80px] h-[1px] bg-[#C7C3BE]"></div>
      <ul className="">
        {[
          { name: "Dashboard", path: "/admin" },
          { name: "Quote", path: "/admin/quotes" },
          { name: "Quote Sequences", path: "/admin/quote-sequences" },
          { name: "Users", path: "/admin/users" },
          { name: "Survey Tickets", path: "/admin/survey-tickets" },
          { name: "Tags", path: "/admin/tags" },
        ].map((item) => (
          <li
            key={item.path}
            className={`mt-[20px] font-medium leading-[2.4rem] text-[1.6rem] 
              ${isActive(item.path) ? "text-primary-light dark:text-primary-dark" : "dark:text-textColor-dark text-[#000]"}`}
          >
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default AdminSidebar;
