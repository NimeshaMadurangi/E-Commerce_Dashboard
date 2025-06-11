// src/hooks/useProducts.js
import { useState, useEffect } from "react"

function useProducts() {
  const [products, setProducts] = useState(() => {
    // Optionally initialize from localStorage or empty
    const stored = localStorage.getItem("products")
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products))
  }, [products])

  function addProduct(product) {
    setProducts(prev => [...prev, product])
  }

  function updateProduct(updatedProduct) {
    setProducts(prev =>
      prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    )
  }

  function deleteProduct(id) {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  }
}

export default useProducts
