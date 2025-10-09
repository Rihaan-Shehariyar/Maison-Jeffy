import axios from "axios";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { motion } from "framer-motion";

// ProductCard Component
const ProductCard = React.memo(({ product, isLiked, onWishlistToggle, delay = 0 }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`relative flex flex-col items-center text-center group 
                  rounded-xl shadow-md p-4 bg-gradient-to-b from-gray-900 to-black 
                  text-white transition-all duration-500 
                  hover:shadow-[0_0_25px_#1e3a8a] hover:scale-105 
                  ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      whileHover={{
        scale: 1.05,
        rotateX: 5,
        rotateY: 5,
        transition: { type: "spring", stiffness: 200, damping: 15 },
      }}
      whileTap={{ scale: 0.95 }}
      style={{ perspective: 1000, transitionDelay: `${delay * 100}ms` }}
    >
      {product.featured && (
        <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded z-10">
          FEATURED
        </span>
      )}

      <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded"
          />
        </Link>

        <button
          onClick={e => {
            e.stopPropagation();
            onWishlistToggle(product);
          }}
          className="absolute top-3 right-3 z-30 focus:outline-none p-0 bg-transparent border-none"
        >
          <span
            className={`text-3xl cursor-pointer transition-transform duration-300 ${
              isLiked ? "text-blue-400 animate-pop" : "text-gray-500 hover:text-blue-400 hover:scale-110"
            }`}
          >
            ♥
          </span>
        </button>
      </div>

      <Link
        to={`/products/${product.id}`}
        className="hover:text-blue-400 transition-colors no-underline"
        style={{ textDecoration: "none" }}
      >
        <h3 className="text-lg font-semibold tracking-tight">{product.name}</h3>
      </Link>
      <p className="text-blue-400 font-bold mt-2 text-lg">₹ {product.price}</p>
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
   const videos = ["/banner1.mp4", "/banner2.mp4","/banner4.mp4"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then(res => {
        const shuffled = res.data.sort(() => Math.random() - 0.5);
        setProducts(shuffled);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleWishlistToggle = product => {
    if (!user) return navigate("/login");
    wishlist.some(item => item.id === product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(
      p =>
        (selectedType === "All" || p.type === selectedType) &&
        [p.name, p.brand, p.type].some(field =>
          field?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [products, selectedType, searchQuery]);


  const handleVideoEnd = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400 font-sans">
        Loading products...
      </div>
    );
  }

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const cardVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <div className="min-h-screen font-sans bg-black text-white">
      {/* Hero Video Banner */}
      {!searchQuery && (
    <section className="w-full relative mb-12 h-[90vh] rounded-xl overflow-hidden shadow-lg">
  {/* Video */}
  <video
    key={videos[currentIndex]}
    autoPlay
    muted
    playsInline
    onEnded={handleVideoEnd}
    className="w-full h-full object-cover"
    src={videos[currentIndex]}
    initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 1 }}
  />

  {/* Overlay */}
  <div className="absolute inset-0 flex flex-col justify-end items-center z-10 px-4 pb-10">
  <motion.div
    animate={{ y: [0, -8, 0] }} // subtle floating motion
    transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
  >
 

  </motion.div>
</div>
<br></br>
</section>



      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        <br></br>
    
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold mb-10 text-center tracking-tight text-white"
        >
          {searchQuery ? `Search Results for "${searchQuery}"` : "Browse Our Collection"}
        </motion.h2>
        <br></br>

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
              .filter(p => p.featured)
              .map((product, idx) => (
                <motion.div key={product.id} variants={cardVariants}>
                  <ProductCard
                    product={product}
                    wishlist={wishlist}
                    onWishlistToggle={handleWishlistToggle}
                    delay={idx + 1}
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
