'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from "@/components/Cart/CartProvider";
import { useAuth } from "@/components/Auth/AuthProvider";
import CartItem from "@/components/Cart/CartItem";
import { db } from "@/utils/firebaseConfig";
import { doc, updateDoc, addDoc, collection, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const CartPage = () => {
    const { cartItems, clearCart, getTotalPrice } = useCart();
    const { user, balance, setBalance } = useAuth();
    const [totalPrice, setTotalPrice] = useState(0);
    const auth = getAuth();

    useEffect(() => {
        setTotalPrice(getTotalPrice());
    }, [cartItems]);

    const handleCheckout = async () => {
        try {
            const orderItems = [];
            for (const item of cartItems) {
                if (!item.category) {
                    throw new Error("Item category is undefined");
                }
                const productRef = doc(db, `BikeCategories/${item.category}/bikes`, item.id);
                const productDoc = await getDoc(productRef);
                if (!productDoc.exists()) {
                    throw new Error("Product does not exist");
                }
                const productData = productDoc.data();
                const newQuantity = productData.quantity - item.quantity;
                if (newQuantity < 0) {
                    throw new Error("Insufficient stock for product: " + item.name);
                }
                await updateDoc(productRef, {
                    quantity: newQuantity
                });
                orderItems.push({
                    productId: item.id,
                    name: `${item.brand} ${item.model}`,
                    price: item.price,
                    quantity: item.quantity
                });
            }

            const ordersRef = collection(db, "orders");
            await addDoc(ordersRef, {
                userId: user.uid,
                items: orderItems,
                total: totalPrice,
                createdAt: new Date()
            });

            
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                balance: balance - totalPrice
            });

          
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                setBalance(userDoc.data().balance);
            }

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
                        <h2 className="text-xl font-semibold">Total Price: £{totalPrice.toFixed(2)}</h2>
                        <h2 className="text-xl font-semibold">Your Balance: £{balance !== undefined ? balance.toFixed(2) : '0.00'}</h2>
                        <button onClick={handleCheckout} className="checkout-button mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
