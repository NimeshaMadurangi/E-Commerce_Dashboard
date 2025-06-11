import { useState } from "react"

function useProductFilters(initialFilters = {}) {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    stockStatus: "",
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
