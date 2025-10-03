import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const pending = localStorage.getItem("pendingOrder");
    if (pending) setOrder(JSON.parse(pending));
    else navigate("/"); // no pending order, redirect home
  }, [navigate]);

  if (!order) return null;

  const handlePayment = (success = true) => {
    if (success) {
      navigate("/payment-success");
    } else {
      navigate("/payment-failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Fake Payment Gateway</h2>
      <p className="mb-4">Total Amount: ₹{order.total}</p>

      {order.paymentMethod === "upi" ? (
        <div className="mb-6">
          <p className="mb-2 font-semibold">Scan this UPI QR to pay:</p>
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=fake@upi&pn=Fake+Merchant&am=100"
            alt="UPI QR Code"
            className="mx-auto"
          />
        </div>
      ) : (
        <div className="mb-6">
          <p className="mb-2 font-semibold">Enter Card Details:</p>
          <input type="text" placeholder="Card Number" className="border p-2 w-full mb-2" />
          <input type="text" placeholder="MM/YY" className="border p-2 w-full mb-2" />
          <input type="text" placeholder="CVV" className="border p-2 w-full" />
        </div>
      )}

      <div className="flex justify-around">
        <button
          onClick={() => handlePayment(true)}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Pay Now (Success)
        </button>
        <button
          onClick={() => handlePayment(false)}
          className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Fail Payment
        </button>
      </div>
    </div>
  );
}
