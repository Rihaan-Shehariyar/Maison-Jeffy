import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/canvalogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHeart, faMagnifyingGlass, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import axios from "axios";

function Navbar() {
  const { wishlist } = useWishlist();
  const { cart } = useContext(CartContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch products from JSON server
  useEffect(() => {
    axios.get("http://localhost:5000/products")
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const protectNavbar = (e, path) => {
    if (!user) {
      e.preventDefault();
      navigate("/login");
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query.trim()) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/home?search=${encodeURIComponent(searchQuery)}`);
      setSearch("");
      setShowSuggestions(false);
    }
  };

  return (
    <nav className="bg-black/70 backdrop-blur-md shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative py-3">

        {/* Left Links */}
        <div className="hidden md:flex items-center gap-8 flex-1">
          {["Home", "Catalog"].map((item, idx) => (
            <Link
              key={idx}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="relative text-white font-medium hover:text-indigo-600 transition group"
            style={{textDecoration: "none",color : "black"}}>
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-600 transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Center Logo */}
        <div className="flex justify-center flex-1">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="h-16 sm:h-20 md:h-24 w-auto drop-shadow-md hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        {/* Right Icons + Search + Login */}
        <div className="flex items-center gap-4 flex-1 justify-end relative">

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex items-center relative w-64 md:w-80 lg:w-96">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="border border-[#1e3a8a] rounded-full px-4 py-2 pr-10 focus:ring-2 focus:ring-[#3b82f6] shadow-sm w-full transition-all"

            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-indigo-600 transition"
              onClick={handleSearchSubmit}
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-[#0f172a] shadow-md rounded-md mt-1 z-50 max-h-64 overflow-y-auto">
                {suggestions.map(item => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-#333333 transition"
                    onClick={() => {
                      navigate(`/products/${item.id}`);
                      setSearch("");
                      setShowSuggestions(false);
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <span className="text-gray-800 font-medium">{item.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </form>

          {/* Wishlist */}
          <Link to="/wishlist" onClick={(e) => protectNavbar(e, "/wishlist")} className="relative group">
            <FontAwesomeIcon icon={faHeart} className="text-gray-700 text-lg group-hover:text-pink-500 transition"/>
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" onClick={(e)=> protectNavbar(e,"/cart")} className="relative group">
            <FontAwesomeIcon icon={faCartShopping} className="text-gray-700 text-lg group-hover:text-indigo-600 transition"/>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.reduce((totalQty,item)=>totalQty+item.qty,0)}
              </span>
            )}
          </Link>

          <Link to ="/orders" onClick={(e)=> protectNavbar(e,"/cart")}   className="relative text-white font-medium hover:text-indigo-600 transition group"
            style={{textDecoration: "none",color : "black"}}>
          Orders
          </Link>

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-2 ml-4">
              {user.avatar && (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover shadow-md"/>
              )}
              <span className="text-gray-700 font-semibold">{user.name}</span>
            </div>
          )}

         {/* Login/Logout Button */}
{!user ? (
  <Link to="/login">
    <button
      className="px-6 py-2 bg-gradient-to-r from-gray-900 via-gray-800 to-black
                 text-white font-bold rounded-lg shadow-md 
                 hover:shadow-[0_0_15px_#3b82f6] hover:text-blue-400 
                 hover:scale-105 transition-all duration-300 ease-in-out"
    >
      Log In
    </button>
  </Link>
) : (
  <button
    onClick={handleLogout}
    className="px-6 py-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black
               text-white font-bold rounded-lg shadow-md 
               hover:shadow-[0_0_15px_#64748b] hover:text-gray-300
               hover:scale-105 transition-all duration-300 ease-in-out"
  >
    Logout
  </button>
)}


          {/* Mobile Menu */}
          <button className="md:hidden ml-2" onClick={() => setMenuOpen(!menuOpen)}>
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="text-gray-700 text-xl"/>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md shadow-md px-6 py-4 flex flex-col gap-4 animate-slideDown">
          {["Home", "Catalog", "Orders"].map((item, idx) => (
            <Link
              key = {idx}
              to = {item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className = "text-gray-700 font-medium hover:text-indigo-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;