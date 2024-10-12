// SearchBar.js
import React, { useState } from "react";

const SearchBar = ({ onSearch, mobile }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className={`${mobile ? "mt-3" : ""}`}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleChange}
        className="w-full px-6 py-2 placeholder-gray-500 text-gray-500 bg-transparent rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
      />
    </div>
  );
};

export default SearchBar;
