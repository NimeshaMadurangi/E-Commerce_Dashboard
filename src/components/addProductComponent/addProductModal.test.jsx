import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import AddProductModal from "./addProductModal"

// Mock the useProducts hook
const mockAddProduct = vi.fn()
const mockUpdateProduct = vi.fn()

vi.mock("../../hooks/useProducts", () => ({
  default: () => ({
    addProduct: mockAddProduct,
    updateProduct: mockUpdateProduct,
  }),
}))

// Mock SCSS import
vi.mock("./addProductModal.scss", () => ({}))

describe("AddProductModal", () => {
  const mockOnClose = vi.fn()

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    initialValues: null,
  }

  const editProps = {
    isOpen: true,
    onClose: mockOnClose,
    initialValues: {
      id: 1,
      name: "Test Product",
      price: 99.99,
      category: "Electronics",
      quantity: 10,
      description: "Test description",
      imageUrl: "https://example.com/image.jpg",
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should not render when isOpen is false", () => {
    render(<AddProductModal {...defaultProps} isOpen={false} />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("should render add product modal when isOpen is true", () => {
    render(<AddProductModal {...defaultProps} />)
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Add Product")).toBeInTheDocument()
  })

  it("should render edit product modal with initialValues", () => {
    render(<AddProductModal {...editProps} />)
    expect(screen.getByText("Edit Product")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Test Product")).toBeInTheDocument()
    expect(screen.getByDisplayValue("99.99")).toBeInTheDocument()
  })

  it("should call onClose when close button is clicked", async () => {
    const user = userEvent.setup()
    render(<AddProductModal {...defaultProps} />)

    const closeButton = screen.getByLabelText("Close modal")
    await user.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it("should show validation errors for required fields", async () => {
    const user = userEvent.setup()
    render(<AddProductModal {...defaultProps} />)

    const nameInput = screen.getByLabelText("Product Name")
    const priceInput = screen.getByLabelText("Price")
    const categorySelect = screen.getByLabelText("Category")
    const quantityInput = screen.getByLabelText("Stock Quantity")

    // Touch fields and blur to trigger validation
    await user.click(nameInput)
    await user.tab()
    await user.click(priceInput)
    await user.tab()
    await user.click(categorySelect)
    await user.tab()
    await user.click(quantityInput)
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText("Required")).toBeInTheDocument()
    })
  })

  it("should validate name length constraints", async () => {
    const user = userEvent.setup()
    render(<AddProductModal {...defaultProps} />)

    const nameInput = screen.getByLabelText("Product Name")

    // Test minimum length
    await user.type(nameInput, "ab")
    await user.tab()

    await waitFor(() => {
      expect(
        screen.getByText("Must be at least 3 characters")
      ).toBeInTheDocument()
    })

    // Test maximum length
    await user.clear(nameInput)
    await user.type(nameInput, "a".repeat(51))
    await user.tab()

    await waitFor(() => {
      expect(
        screen.getByText("Must be 50 characters or less")
      ).toBeInTheDocument()
    })
  })

  it("should update character counter for description", async () => {
    const user = userEvent.setup()
    render(<AddProductModal {...defaultProps} />)

    const descriptionTextarea = screen.getByLabelText("Description")
    await user.type(descriptionTextarea, "Test description")

    expect(screen.getByText("16/200")).toBeInTheDocument()
  })

  it("should submit form and add new product", async () => {
    const user = userEvent.setup()
    render(<AddProductModal {...defaultProps} />)

    // Fill out the form
    await user.type(screen.getByLabelText("Product Name"), "New Product")
    await user.type(screen.getByLabelText("Price"), "29.99")
    await user.selectOptions(screen.getByLabelText("Category"), "Electronics")
    await user.type(screen.getByLabelText("Stock Quantity"), "5")
    await user.type(screen.getByLabelText("Description"), "Test description")
    await user.type(
      screen.getByLabelText("Image URL"),
      "https://example.com/image.jpg"
    )

    const submitButton = screen.getByRole("button", { name: "Add" })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockAddProduct).toHaveBeenCalledWith({
        name: "New Product",
        price: 29.99,
        category: "Electronics",
        quantity: 5,
        description: "Test description",
        imageUrl: "https://example.com/image.jpg",
        id: expect.any(Number),
      })
    })

    expect(screen.getByText("Product added successfully!")).toBeInTheDocument()
  })

  it("should submit form and update existing product", async () => {
    const user = userEvent.setup()
    render(<AddProductModal {...editProps} />)

    // Modify the name
    const nameInput = screen.getByDisplayValue("Test Product")
    await user.clear(nameInput)
    await user.type(nameInput, "Updated Product")

    const submitButton = screen.getByRole("button", { name: "Update" })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockUpdateProduct).toHaveBeenCalledWith({
        id: 1,
        name: "Updated Product",
        price: 99.99,
        category: "Electronics",
        quantity: 10,
        description: "Test description",
        imageUrl: "https://example.com/image.jpg",
      })
    })

    expect(
      screen.getByText("Product updated successfully!")
    ).toBeInTheDocument()
  })

  it("should disable submit button when form is invalid", async () => {
    const user = userEvent.setup()
    render(<AddProductModal {...defaultProps} />)

    const submitButton = screen.getByRole("button", { name: "Add" })
    expect(submitButton).toBeDisabled()

    // Fill required fields
    await user.type(screen.getByLabelText("Product Name"), "Valid Product")
    await user.type(screen.getByLabelText("Price"), "29.99")
    await user.selectOptions(screen.getByLabelText("Category"), "Electronics")
    await user.type(screen.getByLabelText("Stock Quantity"), "5")

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  it("should use placeholder image when imageUrl is empty", async () => {
    const user = userEvent.setup()
    render(<AddProductModal {...defaultProps} />)

    // Fill required fields without image URL
    await user.type(screen.getByLabelText("Product Name"), "Test Product")
    await user.type(screen.getByLabelText("Price"), "29.99")
    await user.selectOptions(screen.getByLabelText("Category"), "Electronics")
    await user.type(screen.getByLabelText("Stock Quantity"), "5")

    const submitButton = screen.getByRole("button", { name: "Add" })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockAddProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          imageUrl: "https://via.placeholder.com/150",
        })
      )
    })
  })

  it("should close modal after successful submission", async () => {
    const user = userEvent.setup()
    render(<AddProductModal {...defaultProps} />)

    // Fill and submit form
    await user.type(screen.getByLabelText("Product Name"), "Test Product")
    await user.type(screen.getByLabelText("Price"), "29.99")
    await user.selectOptions(screen.getByLabelText("Category"), "Electronics")
    await user.type(screen.getByLabelText("Stock Quantity"), "5")

    const submitButton = screen.getByRole("button", { name: "Add" })
    await user.click(submitButton)

    // Wait for success message and then modal close
    await waitFor(() => {
      expect(
        screen.getByText("Product added successfully!")
      ).toBeInTheDocument()
    })

    await waitFor(
      () => {
        expect(mockOnClose).toHaveBeenCalled()
      },
      { timeout: 2000 }
    )
  })

  it("should have proper accessibility attributes", () => {
    render(<AddProductModal {...defaultProps} />)

    const modal = screen.getByRole("dialog")
    expect(modal).toHaveAttribute("aria-modal", "true")
    expect(modal).toHaveAttribute("aria-labelledby", "modal-title")

    const closeButton = screen.getByLabelText("Close modal")
    expect(closeButton).toBeInTheDocument()

    // Check for proper form labels
    expect(screen.getByLabelText("Product Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Price")).toBeInTheDocument()
    expect(screen.getByLabelText("Category")).toBeInTheDocument()
    expect(screen.getByLabelText("Stock Quantity")).toBeInTheDocument()
  })

  it("should truncate description to 200 characters", async () => {
    const user = userEvent.setup()
    render(<AddProductModal {...defaultProps} />)

    const longDescription = "a".repeat(250)

    // Fill form with long description
    await user.type(screen.getByLabelText("Product Name"), "Test Product")
    await user.type(screen.getByLabelText("Price"), "29.99")
    await user.selectOptions(screen.getByLabelText("Category"), "Electronics")
    await user.type(screen.getByLabelText("Stock Quantity"), "5")
    await user.type(screen.getByLabelText("Description"), longDescription)

    const submitButton = screen.getByRole("button", { name: "Add" })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockAddProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "a".repeat(200),
        })
      )
    })
  })
})
