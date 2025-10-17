import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const API = "http://localhost:5000/cart"; // 🔹 your JSON server endpoint

  // ✅ Fetch user cart from JSON Server when logged in
  useEffect(() => {
    if (user) {
      axios
        .get(`${API}?userId=${user.id}`)
        .then((res) => setCart(res.data))
        .catch((err) => console.error("Error loading cart:", err));
    } else {
      setCart([]); // clear cart when user logs out
    }
  }, [user]);

  // ✅ Add to cart
  const addToCart = async (product) => {
    if (!user) {
      toast.info("Please login to add products to cart");
      return;
    }

    const existing = cart.find((item) => item.productId === product.id);

    if (existing) {
      const updatedItem = { ...existing, qty: existing.qty + 1 };
      await axios.put(`${API}/${existing.id}`, updatedItem);
      setCart(cart.map((i) => (i.id === existing.id ? updatedItem : i)));
    } else {
      const newItem = { userId: user.id, productId: product.id, ...product, qty: 1 };
      const res = await axios.post(API, newItem);
      setCart([...cart, res.data]);
    }

    toast.success(`${product.name} added to cart`);
  };

  // ✅ Remove from cart
  const removeFromCart = async (id) => {
    await axios.delete(`${API}/${id}`);
    setCart(cart.filter((item) => item.id !== id));
  };

  // ✅ Update quantity
  const updateQty = async (id, newQty) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    if (newQty <= 0) {
      await removeFromCart(id);
      return;
    }

    const updatedItem = { ...item, qty: newQty };
    await axios.put(`${API}/${id}`, updatedItem);
    setCart(cart.map((i) => (i.id === id ? updatedItem : i)));
  };

  // ✅ Clear cart (for that user)
  const clearCart = async () => {
    for (const item of cart) {
      await axios.delete(`${API}/${item.id}`);
    }
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateQty }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
