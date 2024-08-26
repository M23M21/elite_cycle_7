'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/Auth/AuthProvider';
import { useCart } from '@/components/Cart/CartProvider';
import { useRouter } from 'next/navigation';

export default function NavBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const { cartItems } = useCart();
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        console.log(`Search term submitted: ${searchTerm}`);
        if (searchTerm) {
            router.push(`/search?q=${searchTerm}`);
        }
    };
    return (
        <nav className="bg-gray-800 text-white p-4 fixed top-0 w-full z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/">
                    <span className="text-lg font-semibold cursor-pointer">Solent E Stores</span>
                </Link>
                <div className="flex items-center space-x-6">
                    {user && user.role !== 'admin' && (
                        <Link href="/products">
                            <span className="hover:text-gray-300 cursor-pointer">Products</span>
                        </Link>
                    )}
                    {user && user.role === 'admin' && (
                        <>
                            <Link href="/admin/add-product">
                                <span className="hover:text-gray-300 cursor-pointer">Add Bike</span>
                            </Link>
                            <Link href="/admin/edit-product">
                                <span className="hover:text-gray-300 cursor-pointer">Edit Products</span>
                            </Link>
                            <Link href="/admin/product-list">
                                <span className="hover:text-gray-300 cursor-pointer">All Products</span>
                            </Link>
                            <Link href="/admin/order-list">
                                <span className="hover:text-gray-300 cursor-pointer">All Orders</span>
                            </Link>
                            <Link href="/admin/users-list">
                                <span className="hover:text-gray-300 cursor-pointer">All Users</span>
                            </Link>
                        </>
                    )}
                    {user && user.role !== 'admin' && (
                        <>
                            <Link href="/cart">
                                <span className="hover:text-gray-300 cursor-pointer">Cart ({cartItems.length})</span>
                            </Link>
                            <Link href="/orders/orders">
                                <span className="hover:text-gray-300 cursor-pointer">Orders</span>
                            </Link>
                        </>
                    )}
                    {user ? (
                        <>
                            <span className="hover:text-gray-300 cursor-pointer">Welcome, {user.displayName}</span>
                            <button onClick={logout} className="hover:text-gray-300 cursor-pointer">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login">
                                <span className="hover:text-gray-300 cursor-pointer">Login</span>
                            </Link>
                            <Link href="/auth/register">
                                <span className="hover:text-gray-300 cursor-pointer">Sign Up</span>
                            </Link>
                        </>
                    )}
                    {user && user.role !== 'admin' && (
                        <form onSubmit={handleSearchSubmit} className="flex items-center">
                            <input
                                type="text"
                                placeholder="Search by Brand or Model"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="px-2 py-1 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            />
                            <button type="submit" className="bg-gray-600 px-4 py-1 rounded-r-md hover:bg-gray-500">
                                Search
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </nav>
    );
}
