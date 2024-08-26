'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/utils/firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import Link from 'next/link';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const id = router.query?.id;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        if (user) {
          let q;
          if (user.role === 'admin') {
            
            q = query(collection(db, 'orders'));
          } else {
            
            q = query(collection(db, 'orders'), where('userId', '==', user.uid));
          }
          const querySnapshot = await getDocs(q);
          const ordersData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(ordersData);
        } else {
          setError(new Error('User not authenticated'));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{user && user.role === 'admin' ? 'All Orders' : 'Order History'}</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id} className="mb-4">
              <button
                className="block p-4 w-full text-left border rounded hover:bg-gray-100"
                onClick={() => setSelectedOrder(order)}
              >
                <p className="font-bold">Order {order.id}</p>
                <p>Total: £{order.total}</p>
                <p>Date: {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedOrder && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Order Details</h2>
          <p>Order ID: {selectedOrder.id}</p>
          <p>Created At: {new Date(selectedOrder.createdAt.seconds * 1000).toLocaleString()}</p>
          <p>Total: £{selectedOrder.total}</p>

          <h3 className="text-xl font-bold mt-4 mb-2">Order Items</h3>
          <ul>
            {selectedOrder.items.map(item => (
              <li key={item.productId}>
                <Link href={`/product/${item.productId}`}>
                  {item.name}
                </Link>{' '}
                {item.quantity} x £{item.price} = £{item.quantity * item.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Orders;
