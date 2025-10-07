import React, { useState } from "react";
import axios from "axios";
import DoughnutChart from "./DoughnutChart";

export default function ProductCard({ product, admin = false, fetchProducts }) {
  const [editing, setEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);

  // Delete product
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/products/${product.id}`);
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  // Update product
  const handleUpdate = async () => {
    if (!editedProduct.name || !editedProduct.price) {
      alert("Name and price are required!");
      return;
    }
    try {
      await axios.put(`http://localhost:5000/products/${product.id}`, editedProduct);
      setEditing(false);
      fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // Handle image file upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEditedProduct({ ...editedProduct, image: reader.result }); // base64 image
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
    <DoughnutChart />
    
    <div className="bg-white p-4 rounded shadow flex flex-col gap-2">
        
      {editing ? (
        <>
          <input
            type="text"
            value={editedProduct.name}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, name: e.target.value })
            }
            className="border p-2 rounded"
            placeholder="Product Name"
          />
          <input
            type="number"
            value={editedProduct.price}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, price: e.target.value })
            }
            className="border p-2 rounded"
            placeholder="Price"
          />
          <input
            type="text"
            value={editedProduct.type}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, type: e.target.value })
            }
            className="border p-2 rounded"
            placeholder="Type"
          />

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2"
          />
          {editedProduct.image && (
            <img
              src={editedProduct.image}
              alt="Preview"
              className="w-full h-32 object-cover rounded mt-2 border"
            />
          )}

          <textarea
            value={editedProduct.description}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, description: e.target.value })
            }
            className="border p-2 rounded"
            placeholder="Description"
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded"
          />
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-700">₹{product.price}</p>
          <p className="text-sm text-gray-500">{product.type}</p>
          <p className="text-sm text-gray-600">{product.description}</p>

          {admin && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setEditing(true)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
    </>
  );
}
