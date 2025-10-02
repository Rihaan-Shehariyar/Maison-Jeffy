import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "./CartContext";
import { useAuth } from "./AuthContext";
import { useWishlist } from "./WishlistContext"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faCreditCard } from "@fortawesome/free-solid-svg-icons";

export default function ViewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ API URL from .env
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Check if product already in wishlist
  const isInWishlist = wishlist.some((item) => item.id === parseInt(id));

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`${API_URL}/products/${id}`) // <-- Using .env URL
      .then((res) => {
        console.log("Fetched product:", res.data);
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch product.");
        setLoading(false);
      });
  }, [id, API_URL]);

  if (loading) return <p className="text-center mt-20 text-gray-600">Loading product...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10">
      {/* Left: Image + Buttons */}
      <div className="md:w-1/2 flex flex-col gap-6">
        <div className="w-full rounded-lg overflow-hidden shadow-md">
          <img
            src={product.image || "https://via.placeholder.com/400"}
            alt={product.name}
            className="w-full h-96 object-contain bg-gray-50"
          />
        </div>

        <div className="flex flex-col gap-3">
          {/* Add to Cart */}
          <button
            onClick={() => addToCart(product)}
            disabled={!user}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-semibold transition ${
              user ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <FontAwesomeIcon icon={faCartShopping} /> Add to Cart
          </button>

          {/* Wishlist Heart Toggle */}
          <button
            onClick={() =>
              isInWishlist ? removeFromWishlist(product.id) : addToWishlist(product)
            }
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            {isInWishlist ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-pink-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            )}
            <span className="text-gray-700">
              {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </span>
          </button>

          {/* Buy Now */}
          <button
            onClick={() => navigate("/checkout", { state: { product } })}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
          >
            <FontAwesomeIcon icon={faCreditCard} /> Buy Now
          </button>
        </div>
      </div>

      {/* Right: Product Details */}
      <div className="md:w-1/2 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
          <p className="text-2xl font-bold text-blue-600 mb-4">₹{product.price}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="self-start px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
}
