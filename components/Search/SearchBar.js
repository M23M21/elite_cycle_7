import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebaseConfig';
const SearchBar = ({ searchTerm }) => {
    const [results, setResults] = useState([]);
    useEffect(() => {
        const fetchResults = async () => {
            if (searchTerm) {
                console.log(`Searching for: ${searchTerm}`);

const results = [];
const categories = ["E-Bike", "Mountain-Bike","Road-Bike"];
for (const category of categories) {
    const q = query(
        collection(db, "BikeCategories", category,
"bikes"),
where("brand", "==", searchTerm),
                    );
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        results.push({ id: doc.id,
category, ...doc.data() });
}); }
                console.log('Products found:', results);
                setResults(results);
            } else {
                setResults([]);
            }
};
        fetchResults();
    }, [searchTerm]);
    return (
        <div>
            {results.length > 0 ? (
                <ul>
                    {results.map((product) => (
                        <li key={product.id}>
                            {product.brand} - {product.model}
</li> ))}
</ul> ):(
                <p>No results found</p>
            )}
</div> );
};
export default SearchBar;