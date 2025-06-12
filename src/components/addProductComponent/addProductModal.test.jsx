import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import AddProductModal from "./addProductModal"
import useProducts from "../../hooks/useProducts"

jest.mock("../../hooks/useProducts")

describe("AddProductModal", () => {
  const mockAddProduct = jest.fn(() => true)
  const mockUpdateProduct = jest.fn(() => true)

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    initialValues: null,
  }

  beforeEach(() => {
    useProducts.mockReturnValue({
      addProduct: mockAddProduct,
      updateProduct: mockUpdateProduct,
    })
    jest.clearAllMocks()
  })

  it("renders the modal with empty form when adding", () => {
    render(<AddProductModal {...defaultProps} />)

    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/stock quantity/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/image url/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /add/i })).toBeDisabled()
  })

  it("submits form and calls addProduct", async () => {
    render(<AddProductModal {...defaultProps} />)

    fireEvent.change(screen.getByLabelText(/product name/i), {
      target: { value: "Test Product" },
    })
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "9.99" },
    })
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "Books" },
    })
    fireEvent.change(screen.getByLabelText(/stock quantity/i), {
      target: { value: "5" },
    })

    fireEvent.click(screen.getByRole("button", { name: /add/i }))

    await waitFor(() => {
      expect(mockAddProduct).toHaveBeenCalled()
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })

  it("renders with initialValues when editing", () => {
    const props = {
      ...defaultProps,
      initialValues: {
        id: 123,
        name: "Existing Product",
        price: 19.99,
        category: "Electronics",
        quantity: 10,
        description: "Sample description",
        imageUrl: "https://example.com/image.jpg",
      },
    }

    render(<AddProductModal {...props} />)

    expect(screen.getByDisplayValue(/existing product/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument()
  })

  it("submits updated product", async () => {
    const props = {
      ...defaultProps,
      initialValues: {
        id: 123,
        name: "Old Name",
        price: 10,
        category: "Books",
        quantity: 1,
        imageUrl: "",
      },
    }

    render(<AddProductModal {...props} />)

    fireEvent.change(screen.getByLabelText(/product name/i), {
      target: { value: "Updated Name" },
    })

    fireEvent.click(screen.getByRole("button", { name: /update/i }))

    await waitFor(() => {
      expect(mockUpdateProduct).toHaveBeenCalled()
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })

  it("closes modal on close button click", () => {
    render(<AddProductModal {...defaultProps} />)

    const closeButton = screen.getByRole("button", { name: /close modal/i })
    fireEvent.click(closeButton)

    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it("does not render if isOpen is false", () => {
    const { container } = render(
      <AddProductModal {...defaultProps} isOpen={false} />
    )
    expect(container.firstChild).toBeNull()
  })
})
