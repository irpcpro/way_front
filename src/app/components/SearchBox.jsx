import React, { useState, useEffect, useRef } from "react";
import SpinnerLoading from "./Spinner.jsx";

function SearchBox({ onSearch, placeholder = "جستجو...", searching = null, delayTime = 600 }) {
    const [query, setQuery] = useState("");
    const debounceTimeout = useRef(null);

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        // پاک کردن debounce قبلی
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        // ست کردن debounce جدید
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
        // پاکسازی تایمر هنگام unmount
        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, []);

    return (
        <div className="search-box d-flex align-items-center position-relative">
            <input
                type="text"
                className="form-control"
                placeholder={placeholder}
                value={query}
                onChange={handleChange}
            />
            {
                query ? (
                    <button
                        type="button"
                        className="btn btn-searchbar position-absolute start-0 me-2"
                        onClick={handleClear}
                        style={{ background: "transparent", border: "none" }}
                    >
                        {
                            searching !== null && searching === true ? (
                                <SpinnerLoading/>
                            ) : (
                                <i className="bi bi-x-lg"></i>
                            )
                        }
                    </button>
                ): (
                    <button
                        type="button"
                        className="btn btn-searchbar position-absolute start-0 me-2"
                        style={{background: "transparent", border: "none"}}
                    >
                        <i className="bi bi-search"></i>
                    </button>
                )
            }
        </div>
    );
}

export default SearchBox;
