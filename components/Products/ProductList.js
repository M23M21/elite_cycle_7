import { useEffect, useState } from 'react';
import { db } from "../../utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../components/Auth/AuthProvider";
import Link from "next/link";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.role === "admin") {
            const fetchProducts = async () => {
                try {
                    const productsList = [];
                    const categories = ["Mountain-Bike", "Road-Bike", "E-Bike"];
                    for (const category of categories) {
                        const productsRef = collection(db, `BikeCategories/${category}/bikes`);
                        const querySnapshot = await getDocs(productsRef);
                        querySnapshot.forEach((doc) => {
                            productsList.push({ id: doc.id, category, ...doc.data() });
                        });
                    }
                    setProducts(productsList);
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            };
            fetchProducts();
        } else {
            alert("You do not have permission to view products.");
        }
    }, [user]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">All Products</h1>
            {products.length > 0 ? (
                <ul>
                    {products.map((product) => (
                        <li key={product.id} className="mb-2">
                            {product.name} - £{product.price} ({product.category})
                            <Link href={`/admin/edit-product?id=${product.id}&category=${product.category}`}>
                                <a className="ml-2 text-blue-500 hover:underline">Edit</a>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No products available.</p>
            )}
        </div>
    );
};

export default ProductList;
