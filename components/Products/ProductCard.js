import React from 'react';
import { useCart } from '../../components/Cart/CartProvider';

const ProductCard = ({ product }) => {
  const { addItemToCart } = useCart();

  const handleAddToCart = () => {
    addItemToCart(product);
  };

  return (
    <div className="product-card border p-4 rounded flex flex-col items-center">
      <div className="image-wrapper flex justify-center items-center w-full h-48 overflow-hidden">
        <img src={product.image} alt={product.model} className="object-contain w-full h-full" />
      </div>
      <h2 className="text-xl font-bold mb-2">{product.model}</h2>
      <p className="text-gray-700 mb-2">Brand: {product.brand}</p>
      <p className="text-gray-700 mb-2">Color: {product.colour}</p>
      <p className="text-gray-700 mb-2">Year: {product.year}</p>
      <p className="text-gray-700 mb-2">Price: £{product.price}</p>
      <p className="text-gray-700 mb-2">Quantity: {product.quantity}</p>
      <button
        onClick={handleAddToCart}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
