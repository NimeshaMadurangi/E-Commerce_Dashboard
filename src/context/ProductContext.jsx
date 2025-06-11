import { createContext, useContext, useEffect, useState } from "react"

const ProductContext = createContext()

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem("products")
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products))
  }, [products])

  const addProduct = product => {
    setProducts(prev => [...prev, product])
  }

  const updateProduct = updatedProduct => {
    setProducts(prev =>
      prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    )
  }

  const deleteProduct = productToDelete => {
    setProducts(prev => prev.filter(p => p.id !== productToDelete.id))
  }

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}
