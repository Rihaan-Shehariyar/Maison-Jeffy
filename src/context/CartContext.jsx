import { createContext, useState, useContext } from "react";
import { useAuth } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Add to cart
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

  // Remove product
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Clear cart
  const clearCart = () => setCart([]);

  // ✅ Update quantity
  const updateQty = (id, newQty) => {
    setCart((prevCart) =>
      newQty <= 0
        ? prevCart.filter((item) => item.id !== id) // auto-remove if qty is 0
        : prevCart.map((item) =>
            item.id === id ? { ...item, qty: newQty } : item
          )
    );
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
