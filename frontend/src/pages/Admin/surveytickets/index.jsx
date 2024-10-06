import React from "react";
import DaisyUICustomToggle from "../../../components/DaisyUI/DaisyUICustomToggle";
import AdminHeader from "../../../components/Admin/AdminHeader";
import AdminSidebar from "../../../components/Admin/AdminSidebar";

function Dashboard() {
  return (
    <div className="py-[4rem] grid">
      <div className="mx-[12rem] grid grid-cols-12 gap-x-[3rem]">
        <AdminHeader />
        <span className="col-span-12 text-center font-medium text-[2.4rem] leading-[2.4rem] mt-[80px] mb-[8px] dark:text-textColor-dark">
          Dashboard
        </span>
        <div class="col-span-2">
          <AdminSidebar />
        </div>
        <div class="col-span-9">
          <p className="font-semibold text-[1.6rem] leading-[2.4rem] mt-[20px] dark:text-textColor-dark ">
            Coming soon...
          </p>
          
        </div>
        <div class="col-span-1"></div>

        <div class="absolute bottom-[80px]">
          <DaisyUICustomToggle />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
