import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/canvalogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHeart, faMagnifyingGlass, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { CartContext } from "../Pages/CartContext";
import { useContext } from "react";
import { useAuth } from "../Pages/AuthContext";
import { useWishlist } from "../Pages/WishlistContext";

function Navbar() {
  const { wishlist } = useWishlist();
  const { cart } = useContext(CartContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative py-4">
        
        {/* Left Links */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          <Link to="/" className="text-gray-700 font-medium hover:text-indigo-600 transition" style={{ textDecoration: "none" }} >
            Home
          </Link>
          <Link to="/" className="text-gray-700 font-medium hover:text-indigo-600 transition" style={{ textDecoration: "none" }}>
            Catalog
          </Link>
        </div>

        {/* Center Logo */}
        <div className="flex justify-center flex-1">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="h-20 sm:h-24 md:h-28 lg:h-32 w-auto transition-all"
            />
          </Link>
        </div>

        {/* Right Icons + Login/Logout */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <Link to="/">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-700 text-lg hover:text-indigo-600 transition"/>
          </Link>
          <Link to="/wishlist" className="relative">
            <FontAwesomeIcon icon={faHeart} className="text-gray-700 text-lg hover:text-pink-500 transition"/>
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative">
            <FontAwesomeIcon icon={faCartShopping} className="text-gray-700 text-lg hover:text-indigo-600 transition"/>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
          {!user ? (
            <Link to="/login">
              <button className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                LogIn
              </button>
            </Link>
          ) : (
            <button
              className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

          {/* Hamburger Menu for Mobile */}
          <button className="md:hidden ml-2" onClick={() => setMenuOpen(!menuOpen)}>
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="text-gray-700 text-xl"/>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 flex flex-col gap-4">
          <Link to="/" className="text-gray-700 font-medium hover:text-indigo-600 transition" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/" className="text-gray-700 font-medium hover:text-indigo-600 transition" onClick={() => setMenuOpen(false)}>
            Catalog
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
