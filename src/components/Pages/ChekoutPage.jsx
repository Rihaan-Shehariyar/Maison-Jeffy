import React, { useState, useContext } from "react";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { useLocation } from "react-router-dom";


export default function CheckoutPage() {
  const location = useLocation();
   const buyNowProduct = location.state?.buyNowProduct;
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  
  const navigate = useNavigate();


  const productsToCheckout = buyNowProduct
     ? [{...buyNowProduct,qty : 1}] : cart

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "cod",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

 const handlePlaceOrder = async () => {
  if (!user) return alert("Please login to place order");

  if (!formData.name || !formData.address || !formData.phone)
    return alert("Fill all fields");

  // Save order temporarily before payment
  const total = productsToCheckout.reduce((sum, item) => sum + item.price * item.qty, 0);

  const newOrder = {
    id: Date.now(),
    userId: user.id,
    products: productsToCheckout,
    total,
    shipping: formData,
    status: "Pending",
    paymentMethod: formData.paymentMethod,
    date: new Date().toISOString(),
  };

  // Save order in localStorage (simulate backend order pending)
  localStorage.setItem("pendingOrder", JSON.stringify(newOrder));

  if (formData.paymentMethod === "cod") {
    // Place order directly for COD
    try {
      await axios.post("http://localhost:5000/orders", newOrder);
      clearCart();
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  } else {
    // Redirect to fake payment page for UPI or Card
    navigate("/payment");
  }
};


  if (productsToCheckout.length === 0)
    return (
      <div className="text-center py-20 text-gray-700">
        Your cart is empty.
        <br />
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go Shopping
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900 tracking-tight text-center">
        Checkout
      </h2>

      {/* Shipping Form */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-400 outline-none font-sans"
          value={formData.name}
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="Full Address"
          className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-400 outline-none font-sans"
          value={formData.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-400 outline-none font-sans"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      {/* Payment */}
      <div className="mb-6">
        <select
          name="paymentMethod"
          className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-400 outline-none font-sans"
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
        <ul className="divide-y">
          {productsToCheckout.map((item) => (
            <li
              key={item.id}
              className="flex justify-between py-2 text-gray-800 font-semibold"
            >
              <span>
                {item.name} × {item.qty}
              </span>
              <span>₹ {item.price * item.qty}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4 font-bold text-lg text-gray-900">
          <span>Total:</span>
          <span>₹ {productsToCheckout.reduce((sum, item) => sum + item.price * item.qty, 0)}</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
      >
        Place Order
      </button>
    </div>
  );
}
