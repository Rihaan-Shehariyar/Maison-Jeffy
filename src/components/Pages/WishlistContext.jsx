import { createContext, useState, useContext } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth(); // get logged-in user
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (product) => {
    if (!user) {
      // Optional: you can redirect to login or just silently ignore
      return;
    }

    const exists = wishlist.find((item) => item.id === product.id);
    if (!exists) {
      setWishlist([...wishlist, product]);
    }
    // Do nothing if already exists
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
