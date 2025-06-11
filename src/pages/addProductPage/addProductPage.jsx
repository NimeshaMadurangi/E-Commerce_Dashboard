import "./AddProductPage.scss"
import { useState } from "react"
import Header from "../../components/headerComponents/header"
import FilterComponent from "../../components/filterComponent/filterComponent"
import AddProductModal from "../../components/addProductComponent/addProductModal"
import ProductCard from "../../components/productCardComponent/productCard"
import useProducts from "../../hooks/useProducts"

function AddProductPage() {
  const { products, deleteProduct } = useProducts()
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    stockStatus: "",
    minPrice: "",
    maxPrice: "",
  })

  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  const handleEditProduct = product => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleDeleteWithConfirmation = id => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    )
    if (confirmed) {
      deleteProduct(id)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const filteredProducts = products.filter(product => {
    const searchLower = filters.search.toLowerCase()
    const matchesSearch =
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)

    const matchesCategory =
      !filters.category || product.category === filters.category

    const stock = Number(product.stock)
    const matchesStockStatus =
      !filters.stockStatus ||
      (filters.stockStatus === "in-stock" && stock > 10) ||
      (filters.stockStatus === "low-stock" && stock > 0 && stock <= 10) ||
      (filters.stockStatus === "out-of-stock" && stock === 0)

    const matchesMinPrice =
      !filters.minPrice || product.price >= Number(filters.minPrice)

    const matchesMaxPrice =
      !filters.maxPrice || product.price <= Number(filters.maxPrice)

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStockStatus &&
      matchesMinPrice &&
      matchesMaxPrice
    )
  })

  return (
    <div className="add-product-page">
      <Header onOpenModal={handleOpenAddModal} total_count={products.length} />

      <AddProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialValues={editingProduct}
      />

      <FilterComponent filters={filters} onChange={handleFilterChange} />

      <div className="product-list">
        {filteredProducts.length === 0 && <p>No products found.</p>}
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={() => handleDeleteWithConfirmation(product.id)}
            onEdit={() => handleEditProduct(product)}
          />
        ))}
      </div>
    </div>
  )
}

export default AddProductPage
