import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { orders } = useOrder();
  const navigate = useNavigate();

const order = orders.find((o) => String(o.id) === String(id));

  if (!order) {
    return (
      <div className="text-center py-20">
        Order not found.
        <br />
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }
  console.log("Order details:", order);


  return (
    <div className="max-w-4xl mx-auto p-8 bg-black rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>

      <div className="mb-4">
        <span className="font-semibold">Order ID:</span> {order.id}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Date:</span>{" "}
        {order.date ? new Date(order.date).toLocaleString() : "N/A"}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Status:</span> {order.status || "N/A"}
      </div>

      <h3 className="text-xl font-semibold mb-2">Items</h3>
      <ul className="divide-y">
        {order.products && order.products.length > 0 ? (
        
          order.products.map((item) => (
            <li key={item.id} className="flex justify-between py-2 text-gray-800">
              <span>
                {console.log(item)}
                {item.name} × {item.qty}
              </span>
              <span>₹ {item.price * item.qty}</span>
            </li>
          ))
        ) : (
          <li className="py-2 text-gray-500">No items in this order.</li>
        )}
      </ul>

      <div className="flex justify-between mt-4 font-bold text-gray-900">
        <span>Total:</span>
        <span>₹ {order.total || 0}</span>
      </div>

      <div className="mt-4 text-gray-700">
        <h3 className="font-semibold">Shipping Info</h3>
        <p>{order.shipping?.name || "N/A"}</p>
        <p>{order.shipping?.address || "N/A"}</p>
        <p>{order.shipping?.phone || "N/A"}</p>
      </div>

      <div className="mt-4 text-gray-700">
        <h3 className="font-semibold">Payment Method</h3>
        <p>{order.paymentMethod || "N/A"}</p>
      </div>

      <button
        onClick={() => navigate("/orders")}
        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Back to Orders
      </button>
    </div>
  );
}
