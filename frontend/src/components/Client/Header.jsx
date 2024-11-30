import React, { useState } from "react";
import { Link } from "react-router-dom";
import Menu from "../ReactHamburgerMenus/Menu.jsx";
import HamburgerIcon from "../../assets/HamburgerMenu_icon.svg";
import XIcon from "../../assets/HamburgerMenuClose_icon.svg";
import DaisyUIToggle from "../DaisyUI/DaisyUICustomToggle.jsx";
import ProtectedRoutesAuthenticated from "../ProtectedRoutesAuthenticated.jsx";
import useAuthAuthenticated from "../../hooks/useAuthAuthenticated.jsx";

function ClientMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoading } = useAuthAuthenticated();
  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className="flex items-center w-full justify-between">
        <Link
          to={"/"}
          className="text-primary-light dark:text-primary-dark text-[1.8rem] font-extrabold leading-none place-items-center w-fit"
        >
          MQ.
        </Link>
        <div id="outer-container" className="col-start-3 relative">
          <Menu
            customBurgerIcon={<img src={HamburgerIcon} alt="Menu Icon" />}
            width={"100%"}
            outerContainerId={"outer-container"}
            noOverlay
            isOpen={menuOpen}
          >
            <div className="">
              <div className="p-[20px] min-h-[100vh] flex flex-col">
                <div>
                  <div className="flex">
                    <Link
                      to={"/"}
                      className="text-[#333] text-[1.8rem] font-extrabold leading-none place-items-center w-fit relative top-[1px] mr-auto"
                    >
                      MQ.
                    </Link>
                    <img
                      src={XIcon}
                      alt="Menu Icon"
                      className="cursor-pointer"
                      onClick={handleMenuClose}
                    />
                  </div>

                  <span className="h-[1px] w-full bg-[#374151] flex mt-[20px]"></span>

                  <ul className="text-[#374151] p-0 flex flex-col items-center mt-[40px]">
                    <Link
                      to={"/"}
                      className="text-[1.4rem] p-[16px] leading-[2.4rem] font-normal"
                    >
                      Quotes of the day
                    </Link>
                    <Link
                      to={"/"}
                      className="text-[1.4rem] p-[16px] leading-[2.4rem] font-normal mt-[12px]"
                    >
                      Get random quotes
                    </Link>
                    {/* neu user chua dang nhap, thi hien nut login sign in */}
                    {!user && (
                      <>
                        <Link
                          to={"/login"}
                          className="text-[1.4rem] p-[16px] leading-[2.4rem] font-normal mt-[12px]"
                        >
                          Login
                        </Link>
                        <Link
                          to={"/signup"}
                          className="text-[1.4rem] p-[16px] leading-[2.4rem] font-normal mt-[12px]"
                        >
                          Sign up
                        </Link>
                      </>
                    )}

                    <ProtectedRoutesAuthenticated>
                      <Link
                        to={"/"}
                        className="text-[1.4rem] p-[16px] leading-[2.4rem] font-normal mt-[12px]"
                      >
                        Quote gallery
                      </Link>
                      <Link
                        to={"/"}
                        className="text-[1.4rem] p-[16px] leading-[2.4rem] font-normal mt-[12px]"
                      >
                        Daily emails signup
                      </Link>
                      <Link
                        to={"/"}
                        className="text-[1.4rem] p-[16px] leading-[2.4rem] font-normal mt-[12px]"
                      >
                        Account details
                      </Link>
                      <Link
                        to={"/"}
                        className="text-[1.4rem] p-[16px] leading-[2.4rem] font-normal mt-[12px]"
                      >
                        Favorite quotes
                      </Link>
                      <Link
                        to={"/"}
                        className="text-[1.4rem] p-[16px] leading-[2.4rem] font-normal mt-[12px]"
                      >
                        Change password
                      </Link>
                      <Link
                        to={"/"}
                        className="text-[1.4rem] p-[16px] leading-[2.4rem] font-normal mt-[12px]"
                      >
                        Sign out
                      </Link>
                      <Link
                        to={"/"}
                        className="text-[1.4rem] p-[16px] leading-[2.4rem] font-normal mt-auto mb-[20px] text-[#7F1D1D]"
                      >
                        Delete Account
                      </Link>
                    </ProtectedRoutesAuthenticated>
                  </ul>
                </div>

                <div className="mt-auto">
                  <span className="h-[1px] w-full bg-[#374151] flex "></span>

                  <div className="flex items-center mt-[20px]">
                    <span className="leading-[2.4rem] text-[1.4rem] font-bold mr-auto text-[#374151]">
                      Web Appearance:
                    </span>
                    <DaisyUIToggle />
                  </div>

                  <span className="leading-[2.4rem] text-[1.6rem] text-[#374151] flex justify-center mt-[12px]">
                    Made with ❤️ by Ching
                  </span>
                </div>
              </div>
            </div>
          </Menu>
        </div>
      </header>
    </>
  );
}

export default ClientMenu;
