import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import axios from "axios";

const OrderContext = createContext();

// ✅ Get API URL from .env
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const { cart, clearCart } = useCart();

  // Fetch existing orders for logged-in user
  useEffect(() => {
    if (user) {
      axios
        .get(`${API_URL}/orders?userId=${user.id}`)
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("Error fetching orders:", err));
    } else {
      setOrders([]);
    }
  }, [user]);

  // Place Order
  const placeOrder = async (shipping, paymentMethod, navigate) => {
    if (!user) {
      alert("Please login to place an order");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const newOrder = {
      id: Date.now(),
      userId: user.id,
      items:  productsToCheckout,
      total:  productsToCheckout.reduce((sum, item) => sum + item.price * item.qty, 0),
      shipping,
      paymentMethod,
      status: "Pending",
      date: new Date().toISOString(),
    };

    try {
      await axios.post(`${API_URL}/orders`, newOrder);
      setOrders([...orders, newOrder]);
      clearCart();
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
