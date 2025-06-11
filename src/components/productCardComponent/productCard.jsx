import "./productCard.scss"
import { BiEdit } from "react-icons/bi"
import { MdOutlineDeleteOutline } from "react-icons/md"

function ProductCard({ product, onDelete, onEdit }) {
  const { id, name, price, category, quantity, description, imageUrl } = product

  let stockStatus = "out-of-stock"
  if (quantity > 0 && quantity < 5) stockStatus = "low-stock"
  else if (quantity >= 5) stockStatus = "in-stock"

  return (
    <div className="product-card">
      <img
        src={imageUrl || "https://via.placeholder.com/250"}
        alt={name}
        className="product-img"
      />
      <div className="product-details">
        <div className="product-header">
          <h4>{name}</h4>
          <span className="price">${price}</span>
        </div>

        <div className="product-tags">
          <span className="category">{category || "-"}</span>
          <span className={`status-tag ${stockStatus}`}>
            {stockStatus === "in-stock"
              ? "In Stock"
              : stockStatus === "low-stock"
              ? "Low Stock"
              : "Out of Stock"}
          </span>
        </div>

        <p className="description">{description || "-"}</p>
        <p className="stock">Stock: {quantity ?? 0} Units</p>

        <div className="product-actions">
          <button
            className="btn-edit"
            onClick={() => onEdit(product)}
            aria-label={`Edit ${name}`}
          >
            <BiEdit />
          </button>
          <button
            className="btn-delete"
            onClick={() => onDelete(id)}
            aria-label={`Delete ${name}`}
          >
            <MdOutlineDeleteOutline />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
