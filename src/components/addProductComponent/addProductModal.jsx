import { Form, Field } from "react-final-form"
import useProducts from "../../hooks/useProducts"

function AddProductModal({ isOpen, onClose, initialValues }) {
  const { addProduct, updateProduct } = useProducts()

  if (!isOpen) return null

  const required = value => (value ? undefined : "Required")

  const validatePrice = value =>
    value && Number(value) < 0 ? "Price must be >= 0" : undefined

  const maxLength = max => value =>
    value && value.length > max
      ? `Must be at most ${max} characters`
      : undefined

  const handleSubmit = values => {
    const productData = {
      ...values,
      price: values.price ? parseFloat(values.price) : 0,
      description: values.description?.slice(0, 200) || "",
    }
    if (initialValues?.id) {
      updateProduct({ ...initialValues, ...productData })
    } else {
      addProduct({ ...productData, id: Date.now() })
    }
    onClose()
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
          initialValues={initialValues || {}}
          render={({ handleSubmit, submitting, form }) => (
            <form
              onSubmit={event => {
                handleSubmit(event)?.then(() => form.reset())
              }}
              noValidate
            >
              <div className="field-group">
                <label className="required" htmlFor="name">
                  Name
                </label>
                <Field name="name" validate={required}>
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
                <label htmlFor="description">Description</label>
                <Field
                  name="description"
                  validate={maxLength(200)}
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
                <label htmlFor="category">Category</label>
                <Field
                  name="category"
                  component="input"
                  placeholder="e.g., Electronics"
                  id="category"
                />
              </div>

              <div className="field-group">
                <label htmlFor="price">Price</label>
                <Field
                  name="price"
                  component="input"
                  type="number"
                  min="0"
                  step="0.01"
                  validate={validatePrice}
                  id="price"
                >
                  {({ input, meta }) => (
                    <>
                      <input {...input} placeholder="Price" />
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
                <button type="submit" disabled={submitting}>
                  {initialValues?.id ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    form.reset()
                    onClose()
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        />
      </div>
    </div>
  )
}

export default AddProductModal
