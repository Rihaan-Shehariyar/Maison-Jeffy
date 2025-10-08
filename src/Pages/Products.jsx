import axios from "axios";
import React,  { useState,useEffect,useMemo,useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext"; 

const ProductCard = React.memo(({ product, isLiked, onWishlistToggle }) => (
  <div className="relative flex flex-col items-center text-center group  rounded-lg shadow hover:shadow-lg transition-shadow duration-300 p-4">
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
        onClick={() => onWishlistToggle(product)}
        className="absolute top-3 right-3 z-30 focus:outline-none p-0 bg-transparent border-none"
      >
        <span
          className={`text-3xl cursor-pointer transition-transform duration-300 ${
            isLiked ? "text-pink-500" : "text-gray-400 hover:text-pink-500 hover:scale-110"
          }`}
        >
          ♥
        </span>
      </button>
    </div>

     <Link to={`/products/${product.id}`} className="hover:text-indigo-600 transition-colors no-underline" style={{textDecoration: "none"}}>
      <h3 className="text-lg font-semibold text-gray-900 tracking-tight" s>{product.name}</h3>
    </Link>

    <p className="text-indigo-700 font-bold mt-2 text-lg">₹ {product.price}</p>
  </div>
));

export default function Products(){

     const [products, setProducts] = useState([]);
     const containerRef = useRef(null);
     const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
     const [loading, setLoading] = useState(true);
     const [selectedType, setSelectedType] = useState("All");
     const [sortOption, setSortOption] = useState("default");
     const {user} = useAuth();
     const navigate = useNavigate();
     const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
    const queryParams = new URLSearchParams(window.location.search);
    const searchQuery = queryParams.get("search") || "";
     

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


  useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const selectedElement = container.querySelector(
    `[data-type='${selectedType}']`
  );
  if (selectedElement) {
    setUnderlineStyle({
      left: selectedElement.offsetLeft,
      width: selectedElement.offsetWidth,
    });
  }
}, [selectedType]);


   const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  const handleWishlistToggle = (product) => {
    if (!user) return navigate("/login");
    isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
  };

   // useMemo for performance
    const filteredProducts = useMemo(() => {
      let result =  products.filter(
        (p) =>
          (selectedType === "All" || p.type === selectedType) &&
          [p.name, p.brand, p.type].some((field) =>
            field?.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    
    
      // Sorting
  if (sortOption === "price-asc") {
    result = result.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-desc") {
    result = result.sort((a, b) => b.price - a.price);
  } else if (sortOption === "name-asc") {
    result = result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "name-desc") {
    result = result.sort((a, b) => b.name.localeCompare(a.name));
  }

  return result;
}, [products, selectedType, searchQuery, sortOption]);

    
  
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen text-gray-600 font-sans">
          Loading products...
        </div>
      );
    }
    return(
        <div className="max-w-7xl mx-auto px-6 py-12"> <br></br>

        <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center tracking-tight">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Browse Our Collection"}
        </h2>
        <br></br>
               {/* Filter Buttons */}
     {/* Type Filter as Text with Underline */}
{!searchQuery && (
  <div className="relative flex justify-center gap-6 mb-8" ref={containerRef}>
    {["All", "Floral", "Fruity", "Woody", "Oriental", "Fresh"].map((type) => (
      <div
        key={type}
        data-type={type}
        onClick={() => setSelectedType(type)}
        className={`cursor-pointer font-semibold transition-colors ${
          selectedType === type
            ? "text-indigo-600"
            : "text-gray-300 hover:text-indigo-500"
        }`}
      >
        {type}
      </div>
      
    ))}

    {/* Sliding underline */}
    
    <span
      className="absolute bottom-0 h-1.5 bg-indigo-600 rounded-full transition-all duration-300"
      style={{ left: underlineStyle.left, width: underlineStyle.width }}
    ></span>
  </div>
)}


        <br></br>

        <div className="flex justify-end mb-6">
  <select
    value={sortOption}
    onChange={(e) => setSortOption(e.target.value)}
    className="border rounded px-3 py-2 focus:outline-none bg-black"
  >
    <option value="default">Sort By</option>
    <option value="price-asc">Price: Low to High</option>
    <option value="price-desc">Price: High to Low</option>
    <option value="name-asc">Name: A to Z</option>
    <option value="name-desc">Name: Z to A</option>
  </select>
</div>


        <br></br><br></br>

        

        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-10">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isLiked={isInWishlist(product.id)}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        )}
      </div>
    

    )


}
