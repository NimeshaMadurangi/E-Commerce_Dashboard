import { useState } from "react"

export function useProductFilters(initialFilters = {}) {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
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
