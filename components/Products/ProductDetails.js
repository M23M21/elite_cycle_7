'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { db } from "../../utils/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const ProductDetails = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, `BikeCategories/${router.query.category}/bikes`, productId);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          setProduct(productDoc.data());
        } else {
          console.error("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router.query.category]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover mb-4" />
      <p className="text-gray-700 mb-2">Brand: {product.brand}</p>
      <p className="text-gray-700 mb-2">Colour: {product.colour}</p>
      <p className="text-gray-700 mb-2">Model: {product.model}</p>
      <p className="text-gray-700 mb-2">Price: £{product.price}</p>
      <p className="text-gray-700 mb-2">Quantity: {product.quantity}</p>
      <p className="text-gray-700 mb-2">Year: {product.year}</p>
    </div>
  );
};

export default ProductDetails;
