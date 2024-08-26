'use client';
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from "../../utils/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../../components/Auth/AuthProvider";
import { Suspense } from 'react';

const fetchProduct = async (category, productId) => {
    const productRef = doc(db, `BikeCategories/${category}/bikes`, productId);
    const productDoc = await getDoc(productRef);
    if (productDoc.exists()) {
        return productDoc.data();
    } else {
        throw new Error("No such product!");
    }
};

const EditProduct = () => {
    const [brand, setBrand] = useState("");
    const [colour, setColour] = useState("");
    const [image, setImage] = useState("");
    const [model, setModel] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [year, setYear] = useState("");
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const category = searchParams.get('category');

    useEffect(() => {
        if (id && category) {
            const fetchData = async () => {
                try {
                    const productData = await fetchProduct(category, id);
                    setBrand(productData.brand);
                    setColour(productData.colour);
                    setImage(productData.image);
                    setModel(productData.model);
                    setPrice(productData.price);
                    setQuantity(productData.quantity);
                    setYear(productData.year);
                } catch (err) {
                    console.error("Error fetching product:", err);
                }
            };
            fetchData();
        }
    }, [id, category]);

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        if (user && user.role === "admin") {
            try {
                const productRef = doc(db, `BikeCategories/${category}/bikes`, id);
                await updateDoc(productRef, {
                    brand,
                    colour,
                    image,
                    model,
                    price: parseFloat(price),
                    quantity: parseInt(quantity),
                    year,
                });
                console.log("Product updated successfully");
                router.push("/admin/product-list");
            } catch (error) {
                console.error("Error updating product:", error);
                alert("Failed to update product. Please try again.");
            }
        } else {
            alert("You do not have permission to edit products.");
        }
    };

    const handleDeleteProduct = async () => {
        if (user && user.role === "admin") {
            try {
                const productRef = doc(db, `BikeCategories/${category}/bikes`, id);
                await deleteDoc(productRef);
                console.log("Product deleted successfully");
                router.push("/admin/product-list"); 
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product. Please try again.");
            }
        } else {
            alert("You do not have permission to delete products.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Edit Product</h1>
            <form onSubmit={handleUpdateProduct}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brand">
                        Brand
                    </label>
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="colour">
                        Colour
                    </label>
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                        Image URL
                    </label>
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model">
                        Model
                    </label>
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                        Price
                    </label>
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                        Quantity
                    </label>
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
                        Year
                    </label>
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
                    Update Product
                </button>
                <button
                    type="button"
                    onClick={handleDeleteProduct}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
                >
                    Delete Product
                </button>
            </form>
        </div>
    );
};

export default function EditProductPage() {
    return <EditProductComponent />;
  }
