"use client";

import React, { useContext, useState, useEffect } from "react";
import { SunMedium, Moon, User, Menu, X } from "lucide-react";
import { Theme } from "../Context/ThemeContext/ThemeContext";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

interface UserType {
  name: string;
  email: string;
}

const Navbar: React.FC = () => {
  const router = useRouter();
  const { SwitchTheme, handleTheme } = useContext(Theme);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [navOpen, setNavOpen] = useState<boolean>(false);

  const { data: session, status } = useSession();
  let user
  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/auth/login");
    return null;
  } else {
    user = session.user
  }


  const handleProfileClick = () => setProfileOpen((prev) => !prev);
  const toggleNavMenu = () => setNavOpen((prev) => !prev);

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
    router.push("/auth/login");
  };

  return (
    <nav
      className={`w-full shadow-md px-5 py-3 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 ${
        SwitchTheme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
   
      <div className="font-bold text-xl sm:text-2xl cursor-pointer select-none">
        🔒 LOCKR
      </div>

      <div className="flex items-center gap-3 relative">
     
        <button
          onClick={handleTheme}
          className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
            SwitchTheme === "dark"
              ? "hover:bg-gray-800"
              : "hover:bg-gray-200 text-gray-900"
          }`}
          aria-label="Toggle theme"
        >
          {SwitchTheme === "dark" ? (
            <SunMedium className="text-white" size={20} />
          ) : (
            <Moon className="text-gray-800" size={20} />
          )}
        </button>

        <div className="relative">
          <button
            onClick={handleProfileClick}
            className={`flex items-center gap-2 p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              SwitchTheme === "dark"
                ? "hover:bg-gray-800 text-white"
                : "hover:bg-gray-100 text-gray-900"
            }`}
            aria-haspopup="true"
            aria-expanded={profileOpen}
          >
            <User size={20} />
            <span>{user?.name || "Guest"}</span>
          </button>

          {profileOpen && (
            <div
              className={`absolute right-0 mt-2 w-44 shadow-lg rounded-md overflow-hidden z-50 ${
                SwitchTheme === "dark"
                  ? "bg-gray-900 border border-gray-700 text-gray-100"
                  : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              <button
                onClick={handleLogout}
                className={`w-full text-left px-4 py-2 transition-colors ${
                  SwitchTheme === "dark"
                    ? "hover:bg-gray-800 text-white"
                    : "hover:bg-gray-100 text-gray-900"
                }`}
              >
                Logout
              </button>
            </div>
          )}
        </div>

     
        <button
          onClick={toggleNavMenu}
          className={`md:hidden p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
            SwitchTheme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-200"
          }`}
          aria-label="Open menu"
          aria-expanded={navOpen}
        >
          {navOpen ? (
            <X
              size={22}
              className={
                SwitchTheme === "dark" ? "text-gray-200" : "text-gray-700"
              }
            />
          ) : (
            <Menu
              size={22}
              className={
                SwitchTheme === "dark" ? "text-gray-200" : "text-gray-700"
              }
            />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
