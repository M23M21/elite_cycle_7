'use client';
import { useEffect, useState } from "react";
import { db } from "../../utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../components/Auth/AuthProvider";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.role === "admin") {
            const fetchOrders = async () => {
                try {
                    const ordersList = [];
                    const ordersRef = collection(db, "orders");
                    const querySnapshot = await getDocs(ordersRef);
                    querySnapshot.forEach((doc) => {
                        ordersList.push({ id: doc.id, ...doc.data() });
                    });
                    setOrders(ordersList);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                }
            };
            fetchOrders();
        } else {
            alert("You do not have permission to view orders.");
        }
    }, [user]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">All Orders</h1>
            {orders.length > 0 ? (
                <ul>
                    {orders.map((order) => (
                        <li key={order.id} className="mb-2">
                            <p>Order ID: {order.id}</p>
                            <p>Total: £{order.total}</p>
                            <p>Date: {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</p>
                            <ul>
                                {order.items.map((item, index) => (
                                    <li key={index}>
                                        {item.name} - {item.quantity} x £{item.price} = £{item.quantity * item.price}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default OrderList;
