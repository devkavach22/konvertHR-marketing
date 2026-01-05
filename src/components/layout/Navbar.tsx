import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/img/konvertr hr-logo.png";
import { useAuth } from "../../context/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { userId, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Pricing", path: "/pricing" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 w-full z-50 h-[72px] flex items-center">
      <div className="container mx-auto px-4 lg:px-6 flex items-center justify-between h-full">
        {/* --- Logo --- */}
        <NavLink to="/" className="flex-shrink-0 z-50">
          <img
            src={logo}
            alt="KonvertHR Logo"
            className="w-32 md:w-36 lg:w-40 h-auto object-contain"
          />
        </NavLink>

        {/* --- Mobile Menu Toggle Button --- */}
        {/* Changed from md:hidden to lg:hidden to give more space on tablets */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-gray-700 text-2xl focus:outline-none p-2 z-50"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <i className="ti ti-x" /> // If you use icons, otherwise keep "✕"
          ) : (
            <i className="ti ti-menu-2" /> // If you use icons, otherwise keep "☰"
          )}
          {/* Fallback if no icon library */}
          <span className={isOpen ? "hidden" : "block"}>☰</span>
          <span className={isOpen ? "block" : "hidden"}>✕</span>
        </button>

        {/* --- Desktop Navigation (Links + Auth) --- */}
        {/* Changed from md:flex to lg:flex */}
        <div className="hidden lg:flex lg:items-center lg:justify-end flex-1 ml-8 gap-6">
          {/* Menu Links */}
          <div className="flex items-center space-x-6 xl:space-x-8 font-medium text-gray-800">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `transition-colors duration-300 text-sm xl:text-base whitespace-nowrap ${
                    isActive
                      ? "text-[#E42128] font-semibold"
                      : "hover:text-[#E42128]"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3 whitespace-nowrap">
            {userId ? (
              <button
                onClick={handleLogout}
                className="bg-[#E42128] text-white px-5 py-2 rounded-full hover:bg-red-700 transition-all duration-300 shadow-sm text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="border border-[#E42128] text-[#E42128] px-5 py-2 rounded-full hover:bg-[#E42128] hover:text-white transition-all duration-300 text-sm font-medium"
                >
                  Log In
                </NavLink>

                <NavLink
                  to="/register"
                  className="bg-[#E42128] text-white px-5 py-2 rounded-full hover:bg-red-700 transition-all duration-300 shadow-sm text-sm font-medium"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- Mobile Menu Overlay --- */}
      {/* Added transition and better positioning */}
      <div
        className={`fixed inset-x-0 top-[72px] bg-white shadow-lg lg:hidden transition-all duration-300 ease-in-out origin-top z-40 ${
          isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center py-6 space-y-4 px-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `text-lg font-medium w-full text-center py-2 ${
                  isActive ? "text-[#E42128]" : "text-gray-800"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <div className="w-full border-t border-gray-100 my-2"></div>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col w-full space-y-3 pt-2">
            {userId ? (
              <button
                onClick={handleLogout}
                className="w-full bg-[#E42128] text-white px-5 py-2.5 rounded-full hover:bg-red-700 transition-all duration-300 shadow-sm"
              >
                Logout
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center border border-[#E42128] text-[#E42128] px-5 py-2.5 rounded-full hover:bg-[#E42128] hover:text-white transition-all duration-300"
                >
                  Log In
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-[#E42128] text-white px-5 py-2.5 rounded-full hover:bg-red-700 transition-all duration-300 shadow-sm"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
