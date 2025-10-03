import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const order = localStorage.getItem("pendingOrder");
    if (!order) {
      navigate("/");
      return;
    }

    // Simulate saving order to backend
    fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: order,
    })
      .then(() => {
        localStorage.removeItem("pendingOrder");
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold mb-4 text-green-600">Payment Successful!</h2>
      <p className="mb-4">Your order has been placed successfully.</p>
      <button
        onClick={() => navigate("/orders")}
        className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        View Orders
      </button>
    </div>
  );
}
