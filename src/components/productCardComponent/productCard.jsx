import "./productCard.scss"
import { BiEdit } from "react-icons/bi"
import { MdOutlineDeleteOutline } from "react-icons/md"

function ProductCard({ product, onDelete, onEdit }) {
  const {
    id,
    productName,
    price,
    category,
    stockQuantity,
    description,
    imageUrl,
    stockStatus,
  } = product

  return (
    <div className="product-card">
      <img
        src={imageUrl || "https://via.placeholder.com/250"}
        alt={productName}
        className="product-img"
      />
      <div className="product-details">
        <div className="product-header">
          <h4>{productName}</h4>
          <span className="price">${price}</span>
        </div>

        <div className="product-tags">
          <span className="category">{category}</span>
          <span
            className={`status-tag ${
              stockStatus === "in-stock" ? "in-stock" : "out-of-stock"
            }`}
          >
            {stockStatus === "in-stock" ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <p className="description">{description || "-"}</p>
        <p className="stock">Stock: {stockQuantity} Units</p>

        <div className="product-actions">
          <button className="btn-edit" onClick={() => onEdit(product)}>
            <BiEdit />
          </button>
          <button className="btn-delete" onClick={() => onDelete(id)}>
            <MdOutlineDeleteOutline />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
