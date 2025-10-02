import { useContext } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate
import { CartContext } from "./CartContext"; 

function CartPage() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate(); // ✅ initialize navigate

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map(item => (
              <li key={item.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p>₹ {item.price} × {item.qty}</p>
                  </div>
                </div>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Total: ₹ {total}</h3>
            <div>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-4"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <button
                onClick={() => navigate("/chekout")} // ✅ corrected path
                className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
  