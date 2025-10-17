import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "./Modal";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("All");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    type: "",
    description: "",
    image: "",
  });
  const [adding, setAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

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

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleEditClick = (product) => setEditingProduct(product);

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`http://localhost:5000/products/${editingProduct.id}`, editingProduct);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  const filteredProducts =
    selectedType === "All"
      ? products
      : products.filter((p) => p.type === selectedType);

  if (loading) return <p className="text-center mt-20 text-white">Loading products...</p>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-5 flex flex-col gap-10">
  

      {/* Product Management */}
      <div>
        {/* Filter + Add Product */}
        <br></br>
        <div className="flex flex-wrap justify-center mb-6 gap-4">
          
          <div className="flex gap-6 flex-wrap justify-center">
            
            {["All", "Floral", "Fruity", "Woody", "Oriental", "Fresh"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`font-semibold transition-colors ${
                  selectedType === type
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-gray-300 hover:text-cyan-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {!adding && (
            <button
              onClick={() => setAdding(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
            >
               Add New Product
            </button>
          )}
        </div>

        {/* Add Product Form */}


        <Modal isOpen={adding} onClose={()=> setAdding(false)}>
            {["name", "price", "type", "image"].map((field) => (
              <input
                key={field}
                type={field === "price" ? "number" : "text"}
                placeholder={`Product ${field[0].toUpperCase() + field.slice(1)}`}
                value={newProduct[field]}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, [field]: e.target.value })
                }
                className="flex flex-col gap-3" 
              /> 
            ))}
  
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              className="bg-[#1e293b] border border-[#475569] text-white p-2 rounded focus:ring-2 focus:ring-cyan-500"
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddProduct}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                 disabled={
                         !newProduct.name || !newProduct.price || !newProduct.type || !newProduct.image || !newProduct.description
                        }
              >
                Add
              </button>
              <button
                onClick={() => setAdding(false)}
                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded text-white"
              >
                Cancel
              </button>
            </div>
            </Modal>
        <br></br>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-[#334155] text-white rounded-lg shadow-md p-3 flex flex-col border"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              {editingProduct?.id === p.id ? (
                <>
                  {["name", "price", "type", "image"].map((field) => (
                    <input
                      key={field}
                      type={field === "price" ? "number" : "text"}
                      value={editingProduct[field]}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          [field]: e.target.value,
                        })
                      }
                      className="bg-[#1e293b] border border-[#475569] text-white p-2 rounded mb-2"
                    />
                  ))}
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                    className="bg-[#1e293b] border border-[#475569] text-white p-2 rounded mb-2"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleUpdateProduct}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  <p className="text-gray-300 text-sm mb-1">{p.type}</p>
                  <p className="font-bold text-cyan-400 mb-2">₹ {p.price}</p>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {p.description}
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

