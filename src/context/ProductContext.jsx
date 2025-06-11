import { createContext, useContext, useEffect, useState } from "react"

// 1. Create the context
const ProductContext = createContext()

// 2. Create the provider component
export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem("products")
    return stored ? JSON.parse(stored) : []
  })

  // 3. Sync to localStorage on change
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products))
  }, [products])

  // 4. Actions
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

  // 5. Provide value
  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  )
}

// 6. Custom hook to use the context
export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}
