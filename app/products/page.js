'use client';
import { useState } from 'react';
import useFetchProductsByCategory from "@/hooks/useFetchProductsByCategory";
import ProductCard from "@/components/Products/ProductCard";

const ProductList = () => {
  const [category, setCategory] = useState("Mountain-Bike");
  const { products, loading, error } = useFetchProductsByCategory(category);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      <div className="mb-4">
        <label htmlFor="category" className="block font-bold mb-2">Category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="Mountain-Bike">Mountain Bike</option>
          <option value="Road-Bike">Road Bike</option>
          <option value="E-Bike">E-Bike</option>
        </select>
      </div>
      <div className="product-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={{ ...product, category }} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
