import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";

// ProductCard with reactive wishlist
// ProductCard with 3D tilt
const ProductCard = React.memo(({ product, wishlist, onWishlistToggle }) => {
  const isLiked = wishlist.some((item) => item.id === product.id);

  return (
    <motion.div
      className="relative flex flex-col items-center text-center group rounded-lg shadow p-4 bg-black cursor-pointer"
      whileHover={{
        scale: 1.05,
        rotateX: 5,
        rotateY: 5,
        transition: { type: "spring", stiffness: 200, damping: 15 },
      }}
      whileTap={{ scale: 0.95 }}
      style={{ perspective: 1000 }} // for 3D effect
    >
      {product.featured && (
        <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded z-10">
          FEATURED
        </span>
      )}

      <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(product);
          }}
          className="absolute top-3 right-3 z-30 focus:outline-none p-0 bg-transparent border-none"
        >
          <span
            className={`text-3xl cursor-pointer transition-transform duration-300 ${
              isLiked
                ? "text-pink-500 animate-pop"
                : "text-gray-400 hover:text-pink-500 hover:scale-110"
            }`}
          >
            ♥
          </span>
        </button>
      </div>

      <Link
        to={`/products/${product.id}`}
        className="hover:text-indigo-600 transition-colors no-underline"
        style={{ textDecoration: "none" }}
      >
        <h3 className="text-lg font-extrabold text-white tracking-tight">{product.name}</h3>
      </Link>

      <p className="text-indigo-400 font-bold mt-2 text-lg">₹ {product.price}</p>
    </motion.div>
  );
});


function Home() {
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("All");
  const queryParams = new URLSearchParams(window.location.search);
  const searchQuery = queryParams.get("search") || "";
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => {
        const shuffled = res.data.sort(() => Math.random() - 0.5);
        setProducts(shuffled);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleWishlistToggle = (product) => {
    if (!user) return navigate("/login");
    wishlist.some((item) => item.id === product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        (selectedType === "All" || p.type === selectedType) &&
        [p.name, p.brand, p.type].some((field) =>
          field?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [products, selectedType, searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400 font-sans">
        Loading products...
      </div>
    );
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen font-sans bg-black text-white">
      {/* Hero Banner */}
      {!searchQuery && (
        <section className="w-full mb-12">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop
            pagination={{ clickable: true }}
            className="w-full"
          >
            {["banner5.jpg", "banner3.jpg", "banner6.jpg"].map((img, idx) => (
              <SwiperSlide key={idx}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="w-full aspect-[16/9]"
                >
                  <img
                    src={`/${img}`}
                    alt={`Banner ${idx + 1}`}
                    className="w-full h-full object-contain object-center rounded-xl shadow-lg"
                    loading="lazy"
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold mb-10 text-center tracking-tight text-white"
        >
          {searchQuery ? `Search Results for "${searchQuery}"` : "Browse Our Collection"}
        </motion.h2>

        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-400 text-lg mt-10">No products found.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {filteredProducts
              .filter((p) => p.featured)
              .map((product) => (
                <motion.div key={product.id} variants={cardVariants}>
                  <ProductCard
                    product={product}
                    wishlist={wishlist}
                    onWishlistToggle={handleWishlistToggle}
                  />
                </motion.div>
              ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Home;
