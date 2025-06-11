// useProductFilters.js
import { useState } from "react"

function useProductFilters(initialFilters = {}) {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    stockStatus: "", // fixed key from status -> stockStatus to match usage
    minPrice: "",
    maxPrice: "",
    ...initialFilters,
  })

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return {
    filters,
    updateFilter,
  }
}

export default useProductFilters
