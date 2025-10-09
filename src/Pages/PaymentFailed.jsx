import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTimesCircle } from "react-icons/fa";

export default function PaymentFailed() {
  const { state } = useLocation();
  const { order } = state || {};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        <FaTimesCircle className="text-red-500 text-7xl mb-4" />
      </motion.div>

      <h1 className="text-3xl font-bold text-red-700 mb-2">
        Payment Failed ❌
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Oops! Something went wrong with your payment. Please try again.
      </p>

      {order && (
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Info</h2>
          <p><span className="font-bold">Order ID:</span> {order.id}</p>
          <p><span className="font-bold">Total:</span> ₹{order.total}</p>
          <p><span className="font-bold">Payment Method:</span> {order.shipping?.paymentMethod}</p>
        </div>
      )}

       <div className="flex gap-4"> 
        {/* <Link
          to="/chekout"
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Retry Payment
        </Link>  */}
        <Link
          to="/"
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
