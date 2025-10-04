import React from "react";
import { useOrder } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";

export default function OrdersPage() {
  const { orders } = useOrder();
  const navigate = useNavigate();

  // If no orders exist
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-20 text-gray-700">
        You have no orders yet.
        <br />
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      <ul className="divide-y">
        {orders.map((order) => (
          <li
            key={order.id}
            className="flex justify-between items-center py-3 hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            <div>
              <div className="font-semibold">Order ID: {order.id}</div>
              <div className="text-gray-500 text-sm">
                Date: {order.date ? new Date(order.date).toLocaleString() : "N/A"}
              </div>
              <div className="text-gray-500 text-sm">
                Status: {order.status || "Pending"}
              </div>
              <div className="text-gray-500 text-sm">
                Items: {order.items ? order.items.length : 0}
              </div>
            </div>
            <div className="text-gray-800 font-semibold">₹ {order.total || 0}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
