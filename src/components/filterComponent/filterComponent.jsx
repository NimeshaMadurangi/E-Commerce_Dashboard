import "./filterComponent.scss"
import { FiFilter } from "react-icons/fi"

function FilterComponent({ filters = {}, onChange = () => {} }) {
  return (
    <div className="filter-container">
      <div className="filter-header">
        <FiFilter className="filter-icon" />
        <span>Search & Filter</span>
      </div>

      <div className="filter-grid">
        <input
          type="text"
          placeholder="Search by name or description"
          value={filters.search || ""}
          onChange={e => onChange("search", e.target.value)}
        />

        <select
          value={filters.category || ""}
          onChange={e => onChange("category", e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
        </select>

        <select
          value={filters.stockStatus || ""}
          onChange={e => onChange("stockStatus", e.target.value)}
        >
          <option value="">All</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice || ""}
          onChange={e => onChange("minPrice", e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice || ""}
          onChange={e => onChange("maxPrice", e.target.value)}
        />
      </div>
    </div>
  )
}

export default FilterComponent
