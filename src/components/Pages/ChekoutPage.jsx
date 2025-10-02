import React, { useState, useContext } from "react";
import { CartContext } from "./CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function CheckoutPage() {
  const { cart, clearCart } = useContext(CartContext);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "cod",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!userId) {
      alert("Please login to place an order");
      navigate("/login");
      return;
    }

    if (!formData.name.trim() || !formData.address.trim() || !formData.phone.trim()) {
      alert("Please fill all fields");
      return;
    }

    // simple phone validation
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const newOrder = {
      id: Date.now(),
      userId,
      products: cart,
      total,
      date: new Date().toISOString(),
      shipping: formData,
      status: "Pending",
    };

    try {
      setLoading(true);
      await axios.post("http://localhost:3001/orders", newOrder);
      clearCart();
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      alert("Something went wrong. Please try again later.");
      console.error("Error placing order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        Your cart is empty. <br />
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md font-serif">
      <h2 className="text-4xl font-bold mb-8 text-center text-pink-700">
        Checkout
      </h2>

      {/* Shipping Form */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Shipping Details</h3>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={formData.name}
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="Full Address"
          className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={formData.address}
          onChange={handleChange}
        ></textarea>
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      {/* Payment */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Payment Method</h3>
        <select
          name="paymentMethod"
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="cod">Cash on Delivery</option>
          <option value="upi">UPI</option>
          <option value="card">Credit/Debit Card</option>
        </select>
      </div>

      {/* Order Summary */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
        <ul className="divide-y">
          {cart.map((item) => (
            <li
              key={item.id}
              className="flex justify-between py-2 text-gray-700"
            >
              <span>
                {item.name} × {item.qty}
              </span>
              <span>₹ {item.price * item.qty}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4 font-bold text-lg">
          <span>Total:</span>
          <span>
            ₹ {cart.reduce((sum, item) => sum + item.price * item.qty, 0)}
          </span>
        </div>
      </div>

      {/* Place Order */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
