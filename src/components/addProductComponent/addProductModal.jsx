import "./addProductModal.scss"
import { Form, Field } from "react-final-form"
import useProducts from "../../hooks/useProducts"
import {
  required,
  minLength,
  maxLength,
  positiveNumber,
  url,
  validateQuantity,
} from "../../validations/validations"
import { useState } from "react"

function AddProductModal({ isOpen, onClose, initialValues }) {
  const { addProduct, updateProduct } = useProducts()
  const [successMessage, setSuccessMessage] = useState("")

  if (!isOpen) return null

  const validateName = value => {
    if (required(value)) return "Required"
    if (minLength(3)(value)) return "Must be at least 3 characters"
    if (maxLength(50)(value)) return "Must be 50 characters or less"
    return undefined
  }

  const validateDescription = maxLength(200)
  const validateCategory = required

  const handleSubmit = values => {
    const productData = {
      ...values,
      price: parseFloat(values.price),
      description: values.description?.slice(0, 200) || "",
      imageUrl: values.imageUrl || "https://via.placeholder.com/150",
      quantity: Number(values.quantity),
    }

    if (initialValues?.id) {
      updateProduct({ ...initialValues, ...productData })
      setSuccessMessage("Product updated successfully!")
    } else {
      addProduct({ ...productData, id: Date.now() })
      setSuccessMessage("Product added successfully!")
    }

    setTimeout(() => {
      setSuccessMessage("")
      onClose()
    }, 1500)
  }

  return (
    <div className="modal-overlay">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          ×
        </button>

        <h2 id="modal-title">
          {initialValues?.id ? "Edit Product" : "Add Product"}
        </h2>

        <Form
          onSubmit={handleSubmit}
          initialValues={initialValues || { category: "Electronics" }}
          enableReinitialize={true}
          render={({ handleSubmit, submitting, pristine, invalid, form }) => (
            <form
              onSubmit={event => {
                event.preventDefault()
                if (!invalid) {
                  handleSubmit(event)?.then(() => form.reset())
                }
              }}
              noValidate
            >
              <div className="field-group">
                <label className="required" htmlFor="name">
                  Product Name
                </label>
                <Field name="name" validate={validateName}>
                  {({ input, meta }) => (
                    <>
                      <input
                        {...input}
                        type="text"
                        placeholder="Product name"
                        id="name"
                        autoFocus
                      />
                      {meta.touched && meta.error && (
                        <div className="error" role="alert">
                          {meta.error}
                        </div>
                      )}
                    </>
                  )}
                </Field>
              </div>

              <div className="field-group">
                <label className="required" htmlFor="price">
                  Price
                </label>
                <Field
                  name="price"
                  validate={value => required(value) || positiveNumber(value)}
                >
                  {({ input, meta }) => (
                    <>
                      <input
                        {...input}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Price"
                        id="price"
                      />
                      {meta.touched && meta.error && (
                        <div className="error" role="alert">
                          {meta.error}
                        </div>
                      )}
                    </>
                  )}
                </Field>
              </div>

              <div className="field-group">
                <label className="required" htmlFor="category">
                  Category
                </label>
                <Field
                  name="category"
                  component="select"
                  validate={validateCategory}
                >
                  {({ input, meta }) => (
                    <>
                      <select {...input} id="category">
                        <option value="">Select category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Books">Books</option>
                        <option value="Home">Home</option>
                        <option value="Sports">Sports</option>
                        <option value="Other">Other</option>
                      </select>
                      {meta.touched && meta.error && (
                        <div className="error" role="alert">
                          {meta.error}
                        </div>
                      )}
                    </>
                  )}
                </Field>
              </div>

              <div className="field-group">
                <label className="required" htmlFor="quantity">
                  Stock Quantity
                </label>
                <Field name="quantity" validate={validateQuantity}>
                  {({ input, meta }) => (
                    <>
                      <input
                        {...input}
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Stock quantity"
                        id="quantity"
                      />
                      {meta.touched && meta.error && (
                        <div className="error" role="alert">
                          {meta.error}
                        </div>
                      )}
                    </>
                  )}
                </Field>
              </div>

              <div className="field-group">
                <label htmlFor="description">Description</label>
                <Field
                  name="description"
                  validate={validateDescription}
                  subscription={{ value: true, touched: true, error: true }}
                >
                  {({ input, meta }) => (
                    <>
                      <textarea
                        {...input}
                        rows={3}
                        placeholder="Short description"
                        id="description"
                        maxLength={200}
                      />
                      <div className="char-counter">
                        {input.value?.length || 0}/200
                      </div>
                      {meta.touched && meta.error && (
                        <div className="error" role="alert">
                          {meta.error}
                        </div>
                      )}
                    </>
                  )}
                </Field>
              </div>

              <div className="field-group">
                <label htmlFor="imageUrl">Image URL</label>
                <Field name="imageUrl" validate={url} id="imageUrl">
                  {({ input, meta }) => (
                    <>
                      <input
                        {...input}
                        type="url"
                        placeholder="https://example.com/image.jpg"
                      />
                      {meta.touched && meta.error && (
                        <div className="error" role="alert">
                          {meta.error}
                        </div>
                      )}
                    </>
                  )}
                </Field>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={submitting || pristine || invalid}
                >
                  {initialValues?.id ? "Update" : "Add"}
                </button>
              </div>

              {/* Success message */}
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
            </form>
          )}
        />
      </div>
    </div>
  )
}

export default AddProductModal
