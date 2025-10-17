import { useWishlist } from "../context/WishlistContext";
import { useNavigate, Link } from "react-router-dom";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-600">Your wishlist is empty</p>
      ) : (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <li
                key={item.id}
                className="flex flex-col items-center bg-white p-4 rounded-lg shadow"
              >
                <Link to={`/products/${item.productId}`} className="block w-full h-48 mb-2 overflow-hidden rounded">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                </Link>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-900 font-semibold">₹ {item.price}</p>
                <button
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-end">
            <button
              className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={clearWishlist}
            >
              Clear Wishlist
            </button>
          </div>
        </>
      )}
    </div>
  );
}
