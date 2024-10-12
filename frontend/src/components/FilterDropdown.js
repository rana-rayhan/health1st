// FilterDropdown.js
import React from "react";
import { diseases } from "./blog/data";

const FilterDropdown = ({ onFilter, mobile }) => {
  const handleChange = (e) => {
    onFilter(e.target.value);
  };

  return (
    <div className={`${mobile ? "mt-3" : ""}`}>
      <select
        onChange={handleChange}
        className="w-full py-2 text-gray-500 bg-transparent rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
      >
        <option value="">Filter By Disease</option>
        {diseases.map((disease, index) => (
          <option key={index} value={disease.name}>
            {disease.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
