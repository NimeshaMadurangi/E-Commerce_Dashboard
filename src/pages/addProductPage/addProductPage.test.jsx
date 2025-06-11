jest.mock("@/hooks/useProducts")

import "@testing-library/jest-dom"
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react"
import AddProductPage from "@/pages/addProductPage/AddProductPage"
import * as useProductsHook from "@/hooks/useProducts"

const mockProducts = [
  {
    id: "1",
    name: "Laptop",
    price: 1000,
    category: "Electronics",
    quantity: 20,
    description: "High-end laptop",
    imageUrl: "",
  },
]

describe("AddProductPage - CRUD Operations", () => {
  let mockDeleteProduct, mockUpdateProduct

  beforeEach(() => {
    mockDeleteProduct = jest.fn()
    mockUpdateProduct = jest.fn()

    jest.spyOn(useProductsHook, "default").mockReturnValue({
      products: mockProducts,
      deleteProduct: mockDeleteProduct,
      updateProduct: mockUpdateProduct,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test("should delete product with confirmation", async () => {
    window.confirm = jest.fn(() => true)

    render(<AddProductPage />)

    const deleteButton = screen.getByLabelText("Delete Laptop")
    fireEvent.click(deleteButton)

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this product?"
    )
    expect(mockDeleteProduct).toHaveBeenCalledWith("1")
  })

  test("should not delete product if confirmation is cancelled", () => {
    window.confirm = jest.fn(() => false)

    render(<AddProductPage />)

    const deleteButton = screen.getByLabelText("Delete Laptop")
    fireEvent.click(deleteButton)

    expect(mockDeleteProduct).not.toHaveBeenCalled()
  })

  test("should update product successfully", async () => {
    render(<AddProductPage />)

    const editButton = screen.getByLabelText("Edit Laptop")
    fireEvent.click(editButton)

    const modalTitle = await screen.findByText(/edit product/i)
    expect(modalTitle).toBeInTheDocument()

    const nameInput = screen.getByLabelText(/name/i)
    fireEvent.change(nameInput, { target: { value: "Laptop Pro" } })

    const saveButton = screen.getByRole("button", { name: /save/i })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockUpdateProduct).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Laptop Pro" })
      )
    })
  })

  test("should handle localStorage operations", () => {
    const spySetItem = jest.spyOn(Storage.prototype, "setItem")
    const spyGetItem = jest.spyOn(Storage.prototype, "getItem")

    render(<AddProductPage />)

    expect(spyGetItem).toHaveBeenCalled()
    expect(spySetItem).toHaveBeenCalled()
  })

  test("should maintain data integrity across operations", async () => {
    render(<AddProductPage />)

    expect(screen.getByText("Laptop")).toBeInTheDocument()

    window.confirm = () => true
    fireEvent.click(screen.getByLabelText("Delete Laptop"))

    expect(mockDeleteProduct).toHaveBeenCalledWith("1")
  })
})
