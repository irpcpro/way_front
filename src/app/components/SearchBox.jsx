import React, { useState, useEffect, useRef } from "react";
import SpinnerLoading from "./Spinner.jsx";

function SearchBox({ onSearch, placeholder = "جستجو...", searching = null, delayTime = 600 }) {
    const [query, setQuery] = useState("");
    const debounceTimeout = useRef(null);

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            onSearch(value);
        }, delayTime);
    };

    const handleClear = () => {
        setQuery("");
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        onSearch('');
    };

    useEffect(() => {
        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, []);

    return (
        <>
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={query}
                onChange={handleChange}
            />
        </>
    );
}

export default SearchBox;
