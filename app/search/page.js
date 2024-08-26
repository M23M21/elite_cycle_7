'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/Search/SearchBar';

const SearchPage = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const q = query.get('q');
        if (q) {
            setSearchTerm(q);
        }
    }, [router]);

    return (
        <div>
            <h1>Search Page</h1>
            <SearchBar searchTerm={searchTerm} />
        </div>
    );
};

export default SearchPage;
