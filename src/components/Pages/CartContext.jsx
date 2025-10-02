import { createContext, useState, useContext } from "react";
import { useAuth } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth(); // ✅ call at top level
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    if (!user) {
      alert("Please login to add products to cart");
      return;
    }

    const exist = cart.find((item) => item.id === product.id);
    alert(`${product.name} added`);

    if (exist) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
