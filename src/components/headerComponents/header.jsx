import "./header.scss"
import { IoMdAdd } from "react-icons/io"

function Header({ onOpenModal, total_count }) {
  return (
    <div className="header-container">
      <div className="header-left">
        <h2 className="title">Product Dashboard</h2>
        <p className="subtitle">{total_count} Products</p>
      </div>
      <div className="header-right">
        <button className="btn" onClick={onOpenModal}>
          <IoMdAdd />
          <span>Add Product</span>
        </button>
      </div>
    </div>
  )
}

export default Header
