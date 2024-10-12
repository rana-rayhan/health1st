import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Menu } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addLoggedUser } from "../toolkit/userSlice";

const NavLinks = ({ mobile }) => (
  <div className={`${mobile ? "flex flex-col space-y-2" : "flex space-x-4"}`}>
    <Link to="/" className="text-gray-600 hover:text-indigo-600">
      Blogs
    </Link>
    <Link to="/about" className="text-gray-600 hover:text-indigo-600">
      About
    </Link>
    <Link to="/create-post" className="text-gray-600 hover:text-indigo-600">
      Create Post
    </Link>
    <Link to="/login" className="text-gray-600 hover:text-indigo-600">
      Login
    </Link>
  </div>
);
const NavBar = () => {
  const { loggedUser } = useSelector((state) => state.userPostData);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    dispatch(addLoggedUser(!!user));
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("loggedUser");
      await axios.post("https://health1st.onrender.com/api/auth/logout");
      dispatch(addLoggedUser(false));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="sticky top-0 bg-black shadow-lg z-50 border-b-2 border-b-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="font-bold text-white text-xl">Health1st</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <NavLinks /> */}
            <div className={`${"flex space-x-4"}`}>
              <Link to="/" className="text-gray-600 hover:text-indigo-600">
                Blogs
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-indigo-600">
                About
              </Link>
              <Link
                to="/create-post"
                className="text-gray-600 hover:text-indigo-600"
              >
                Create Post
              </Link>

              {loggedUser ? (
                <div
                  className="text-gray-600 hover:text-indigo-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLinks mobile />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
