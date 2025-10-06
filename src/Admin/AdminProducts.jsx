import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function AdminProducts(){
    const [products,setProducts] = useState("");
    const [loading,setLoading] = useState(true);
    const [newProduct, setNewProduct] = useState({ name: "", price: "", type: "", description: "", image: "" });
    const[adding,setAdding] = useState(false);


    useEffect(()=>{
        fetchProducts()
    },[])

    const fetchProducts = async () => {
        try{
            const res = await axios .get("http://localhost:5000/products");
            setProducts(res.data);
            setLoading(false)
        }
        catch (err) {
    console.error("Error fetching products:", err);
  }


  const handleAddProduct = async () => {
  try {
    await axios.post("http://localhost:5000/products", newProduct);
    setAdding(false);
    setNewProduct({ name: "", price: "", type: "", description: "", image: "" });
    fetchProducts();
  } catch (err) {
    console.error("Error adding product:", err);
  }
};


    }

    
    if (loading) return <p className="text-center mt-20">Loading products...</p>;

    return (
         <div className="p-4 flex flex-col gap-4">
      {/* Add New Product */}
      <div className="bg-white p-4 rounded shadow mb-4">
        {adding ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Type"
              value={newProduct.type}
              onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              className="border p-2 rounded"
            />
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="border p-2 rounded"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleAddProduct}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add Product
              </button>
              <button
                onClick={() => setAdding(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Add New Product
          </button>
        )}
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} fetchProducts={fetchProducts} />
        ))}
      </div>
    </div>
  
    )

}