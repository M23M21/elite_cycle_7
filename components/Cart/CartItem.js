import React from 'react';
import { useCart } from '@/components/Cart/CartProvider';

const CartItem = ({ item }) => {
    const { removeItemFromCart, updateItemQuantity } = useCart();

    const handleIncrease = () => {
        updateItemQuantity(item.id, item.quantity + 1);
    };

    const handleDecrease = () => {
        if (item.quantity > 1) {
            updateItemQuantity(item.id, item.quantity - 1);
        } else {
            removeItemFromCart(item.id);
        }
    };

    return (
        <div className="cart-item flex items-center justify-between p-4 border-b">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
            <div className="item-details flex-1 ml-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">£{item.price?.toFixed(2)}</p>
                <div className="quantity-controls flex items-center mt-2">
                    <button onClick={handleDecrease} className="px-2 py-1 bg-gray-200 rounded">-</button>
                    <span className="mx-2">{item.quantity}</span>
                    <button onClick={handleIncrease} className="px-2 py-1 bg-gray-200 rounded">+</button>
                </div>
            </div>
            <button onClick={() => removeItemFromCart(item.id)} className="remove-button text-red-500">Remove</button>
        </div>
    );
};

export default CartItem;
