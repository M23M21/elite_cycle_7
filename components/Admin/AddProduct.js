'use client';
import { useState } from "react";
import { db } from "../../utils/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../../components/Auth/AuthProvider";

export default function AddProduct() {
  const [brand, setBrand] = useState("");
  const [colour, setColour] = useState("");
  const [image, setImage] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const { user } = useAuth();

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (user && user.role === "admin") {
      try {
        const productsRef = collection(db, `BikeCategories/${category}/bikes`);
        await addDoc(productsRef, {
          brand,
          colour,
          image,
          model,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          year,
        });
        console.log("Bike added successfully");
        setBrand("");
        setColour("");
        setImage("");
        setModel("");
        setPrice("");
        setQuantity("");
        setYear("");
        setCategory("");
      } catch (error) {
        console.error("Error adding bike:", error);
        alert("Failed to add bike. Please try again.");
      }
    } else {
      alert("You do not have permission to add bikes.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Add Bike</h1>
      <form onSubmit={handleAddProduct}>
        <div className="mb-4">
          <label htmlFor="category" className="block font-bold mb-2">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select a category</option>
            <option value="E-Bike">E-Bike</option>
            <option value="Mountain-Bike">Mountain Bike</option>
            <option value="Road-Bike">Road Bike</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brand">Brand</label>
          <input
            type="text"
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="colour">Colour</label>
          <input
            type="text"
            id="colour"
            value={colour}
            onChange={(e) => setColour(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Image URL</label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model">Model</label>
          <input
            type="text"
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">Year</label>
          <input
            type="text"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Bike
        </button>
      </form>
    </div>
  );
};
