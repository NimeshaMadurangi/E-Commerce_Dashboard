// src/pages/AddProductPage.jsx
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

  // Open modal in Add mode
  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  // Open modal in Edit mode
  const handleEditProduct = product => {
    setEditingProduct(product)
    setShowModal(true)
  }

  // Confirm and delete
  const handleDeleteWithConfirmation = id => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    )
    if (confirmed) {
      deleteProduct(id)
    }
  }

  return (
    <div className="add-product-page">
      <Header onOpenModal={handleOpenAddModal} total_count={products.length} />

      <AddProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialValues={editingProduct}
      />

      <FilterComponent />

      <div className="product-list">
        {products.length === 0 && <p>No products added yet.</p>}
        {products.map(product => (
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
