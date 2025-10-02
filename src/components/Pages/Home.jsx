import axios from "axios";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useWishlist } from "./WishlistContext";

function Home() {
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 font-serif">
        Loading products...
      </div>
    );
  }

  const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  const handleWishlistToggle = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    isInWishlist(product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  return (
    <div className="bg-gradient-to-b from-pink-50 to-white min-h-screen font-serif">
      {/* Hero Banner */}
      <section className="w-full mb-12">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          pagination={{ clickable: true }}
          className="w-full"
        >
          <SwiperSlide>
            <div className="w-full aspect-[16/9]">
              <img
                src="/public/banner3.jpg"
                alt="Banner 1"
                className="w-full h-full object-contain object-center rounded-xl shadow-lg"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="w-full aspect-[16/9]">
              <img
                src="/public/banner5.jpg"
                alt="Banner 2"
                className="w-full h-full object-contain object-center rounded-xl shadow-lg"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="w-full aspect-[16/9]">
              <img
                src="/public/banner6.jpg"
                alt="Banner 3"
                className="w-full h-full object-contain object-center rounded-xl shadow-lg"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-extrabold text-pink-700 mb-10 text-center tracking-wide">
          Browse Our Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 overflow-hidden">
          {products.map((product) => {
            const liked = isInWishlist(product.id);
            return (
              <div
                key={product.id}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Product Image Container */}
                <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

                  {/* Heart inside image */}
                  <button
                    onClick={() => handleWishlistToggle(product)}
                    className="absolute top-3 right-3 z-30"
                  >
                    <span
                      className={`text-5xl cursor-pointer drop-shadow-lg ${
                        liked
                          ? "text-pink-500 animate-heart-bounce scale-100 hover:scale-125 transition-transform duration-300"
                          : "text-gray-300 hover:text-pink-500 hover:scale-125 transition-colors transition-transform duration-300"
                      }`}
                    >
                      ♥
                    </span>
                  </button>
                </div>

                {/* Product Name */}
                <Link
                  to={`/products/${product.id}`}
                  className="hover:text-indigo-600 transition-colors no-underline"
                  style={{ textDecoration: "none" }}
                >
                  <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                    {product.name}
                  </h3>
                </Link>

                {/* Price */}
                <p className="text-indigo-700 font-semibold mt-2 text-lg">
                  ₹ {product.price}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
