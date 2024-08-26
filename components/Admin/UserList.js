'use client';
import { useEffect, useState } from "react";
import { db } from "../../utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../components/Auth/AuthProvider";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.role === "admin") {
            const fetchUsers = async () => {
                try {
                    const usersList = [];
                    const usersRef = collection(db, "users");
                    const querySnapshot = await getDocs(usersRef);
                    querySnapshot.forEach((doc) => {
                        usersList.push({ id: doc.id, ...doc.data() });
                    });
                    setUsers(usersList);
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
            };
            fetchUsers();
        } else {
            alert("You do not have permission to view users.");
        }
    }, [user]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">All Users</h1>
            {users.length > 0 ? (
                <ul>
                    {users.map((user) => (
                        <li key={user.id} className="mb-2">
                            <p>User ID: {user.id}</p>
                            <p>Name: {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>Role: {user.role}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default UserList;
