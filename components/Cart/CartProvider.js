'use client';
import React, { createContext, useState, useContext } from 'react';
import { db } from '@/utils/firebaseConfig';
import { collection, addDoc, updateDoc, doc, getDoc, runTransaction } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  const addItemToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItemFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
  };

  const updateItemQuantity = (itemId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const checkout = async () => {
    if (cartItems.length === 0) return;

    try {
      await runTransaction(db, async (transaction) => {
        let totalCost = 0;
        const orderItems = [];

        // Check stock and calculate total cost
        for (const item of cartItems) {
          const productRef = doc(db, `BikeCategories/${item.category}/bikes`, item.id);
          const productDoc = await transaction.get(productRef);
          if (!productDoc.exists()) {
            throw new Error(`Product ${item.id} does not exist`);
          }
          const productData = productDoc.data();
          if (productData.quantity < item.quantity) {
            throw new Error(`Insufficient stock for product: ${item.name}`);
          }
          totalCost += item.price * item.quantity;
          orderItems.push({
            productId: item.id,
            name: `${item.brand} ${item.model}`,
            price: item.price,
            quantity: item.quantity
          });
        }

        // Check user balance
        const userRef = doc(db, "users", user.uid);
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error('User does not exist');
        }
        const userData = userDoc.data();
        if (userData.balance < totalCost) {
          throw new Error('Insufficient balance');
        }

        // Update stock and user balance
        for (const item of cartItems) {
          const productRef = doc(db, `BikeCategories/${item.category}/bikes`, item.id);
          const productDoc = await transaction.get(productRef);
          const productData = productDoc.data();
          transaction.update(productRef, {
            quantity: productData.quantity - item.quantity
          });
        }
        transaction.update(userRef, {
          balance: userData.balance - totalCost
        });

        // Create order
        const ordersRef = collection(db, "orders");
        await addDoc(ordersRef, {
          userId: user.uid,
          items: orderItems,
          total: totalCost,
          createdAt: new Date()
        });
      });

      // Clear cart after successful transaction
      clearCart();
      alert("Checkout successful!");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
        getTotalPrice,
        checkout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
