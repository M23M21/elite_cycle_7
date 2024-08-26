'use client';
import React from 'react';
import { useCart } from '@/components/Cart/CartProvider';
import CartItem from '@/components/Cart/CartItem';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";

const Cart = () => {
    const { cartItems, getTotalPrice, clearCart } = useCart();

    const handleAddToCart = async (product) => {
      ș
        addItemToCart(product);

        
        const productRef = doc(db, `BikeCategories/${product.category}/bikes`, product.id);
        await updateDoc(productRef, {
            quantity: product.quantity - 1
        });
    };

    const handleCheckout = async () => {
        try {
            const orderItems = [];
            for (const item of cartItems) {
                if (!item.category) {
                    throw new Error("Item category is undefined");
                }
                const productRef = doc(db, `BikeCategories/${item.category}/bikes`, item.id);
                await updateDoc(productRef, {
                    stock: item.stock - item.quantity
                });
                orderItems.push({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                });
            }

            const ordersRef = collection(db, "orders");
            await addDoc(ordersRef, {
                items: orderItems,
                total: getTotalPrice(),
                createdAt: new Date()
            });

            clearCart();
            alert("Checkout successful!");
        } catch (error) {
            console.error("Error during checkout:", error);
            alert("Checkout failed. Please try again.");
        }
    };

    return (
        <div className="cart-page container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div>
                    {cartItems.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))}
                    <div className="total mt-4">
                        <h2 className="text-xl font-semibold">Total Price: £{getTotalPrice().toFixed(2)}</h2>
                        <button onClick={handleCheckout} className="checkout-button mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
