import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const API = "http://localhost:5000/wishlist"; 

  
  useEffect(() => {
    if (user) {
      axios
        .get(`${API}?userId=${user.id}`)
        .then((res) => setWishlist(res.data))
        .catch((err) => console.error("Error loading wishlist:", err));
    } else {
      setWishlist([]); 
    }
  }, [user]);

  
  const addToWishlist = async (product) => {
    if (!user) {
      toast.info("Please login to add items to wishlist");
      return;
    }

   
    const exists = wishlist.find((item) => item.productId === product.id);
    if (exists) {
      await axios.delete(`${API}/${exists.id}`);
      setWishlist(wishlist.filter((item) => item.id !== exists.id));
      toast.info("Item removed from wishlist");
      return
    }

    try {
      const newItem = {
        userId: user.id,
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
      };

      const res = await axios.post(API, newItem);
      setWishlist([...wishlist, res.data]);
      toast.success("Item added to wishlist");
    } catch (err) {
      console.error("Error adding wishlist item:", err);
    }
  };

  
  const removeFromWishlist = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setWishlist(wishlist.filter((item) => item.id !== id));
      toast.info("Item removed from wishlist");
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  
  const clearWishlist = async () => {
    try {
      await Promise.all(wishlist.map((item) => axios.delete(`${API}/${item.id}`)));
      setWishlist([]);
      toast.info("Wishlist cleared");
    } catch (err) {
      console.error("Error clearing wishlist:", err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
