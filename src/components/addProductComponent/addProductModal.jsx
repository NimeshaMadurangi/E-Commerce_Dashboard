import { useState } from "react"
import { Form, Field } from "react-final-form"
import {
  required,
  minLength,
  maxLength,
  positiveNumber,
  nonNegativeInteger,
  maxChars,
  url,
} from "../../validations/validations"
import "./AddProductModal.scss"

const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Home",
  "Sports",
  "Other",
]
const placeholderImage = "https://via.placeholder.com/150"

function AddProductModal({ isOpen, onClose, onAddProduct }) {
  const [successMsg, setSuccessMsg] = useState("")
  if (!isOpen) return null

  const onSubmit = (values, form) => {
    if (!values.imageUrl) values.imageUrl = placeholderImage
    onAddProduct(values)
    setSuccessMsg("Product added successfully!")
    form.reset()
    setTimeout(() => setSuccessMsg(""), 3000)
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button
          className="modal-close"
          onClick={onClose}
          data-tooltip="Close Form"
          title="Close Form"
        >
          ×
        </button>

        <h3>Add New Product</h3>

        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit} noValidate>
              <Field
                name="productName"
                validate={value =>
                  required(value) || minLength(3)(value) || maxLength(50)(value)
                }
              >
                {({ input, meta }) => (
                  <div className="field-group">
                    <label className="required">Product Name</label>
                    <input {...input} type="text" placeholder="Product Name" />
                    {meta.touched && meta.error && (
                      <span className="error">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>

              <Field
                name="price"
                validate={value => required(value) || positiveNumber(value)}
              >
                {({ input, meta }) => (
                  <div className="field-group">
                    <label className="required">Price</label>
                    <input {...input} type="text" placeholder="Price" />
                    {meta.touched && meta.error && (
                      <span className="error">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>

              <Field
                name="category"
                component="select"
                initialValue="Electronics"
              >
                {({ input }) => (
                  <div className="field-group">
                    <label>Category</label>
                    <select {...input}>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </Field>

              <Field
                name="stockQuantity"
                validate={value => required(value) || nonNegativeInteger(value)}
              >
                {({ input, meta }) => (
                  <div className="field-group">
                    <label className="required">Stock Quantity</label>
                    <input
                      {...input}
                      type="number"
                      min="0"
                      placeholder="Stock Quantity"
                    />
                    {meta.touched && meta.error && (
                      <span className="error">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>

              <Field name="description" validate={maxChars(200)}>
                {({ input, meta }) => (
                  <div className="field-group">
                    <label>Description (optional)</label>
                    <textarea
                      {...input}
                      maxLength={200}
                      placeholder="Description"
                    />
                    <div className="char-counter">
                      {input.value.length || 0}/200
                    </div>
                    {meta.touched && meta.error && (
                      <span className="error">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>

              <Field name="imageUrl" validate={url}>
                {({ input, meta }) => (
                  <div className="field-group">
                    <label>Image URL (optional)</label>
                    <input {...input} type="text" placeholder="Image URL" />
                    {meta.touched && meta.error && (
                      <span className="error">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>

              <div className="form-actions">
                <button type="submit" disabled={submitting}>
                  Add
                </button>
              </div>

              {successMsg && (
                <div className="success-message">{successMsg}</div>
              )}
            </form>
          )}
        />
      </div>
    </div>
  )
}

export default AddProductModal
