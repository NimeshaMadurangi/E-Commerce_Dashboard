import "./AddProductPage.scss"
import { useState } from "react"
import Header from "../../components/headerComponents/header"
import FilterComponent from "../../components/filterComponent/filterComponent"
import AddProductModal from "../../components/addProductComponent/addProductModal"
import ProductCard from "../../components/productCardComponent/productCard"

function AddProductPage() {
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)

  const handleAddProduct = product => {
    const newProduct = {
      id: Date.now(),
      ...product,
    }
    setProducts(prev => [...prev, newProduct])
    setShowModal(false)
  }

  const handleDeleteWithConfirmation = (id, onDelete) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    )
    if (confirmed) {
      onDelete(id)
    }
  }

  return (
    <div className="add-product-page">
      <Header
        onOpenModal={() => setShowModal(true)}
        total_count={products.length}
      />

      <AddProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAddProduct={handleAddProduct}
      />

      <FilterComponent />

      <div className="product-list">
        {products.length === 0 && <p>No products added yet.</p>}
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={handleDeleteWithConfirmation}
          />
        ))}
      </div>
    </div>
  )
}

export default AddProductPage
