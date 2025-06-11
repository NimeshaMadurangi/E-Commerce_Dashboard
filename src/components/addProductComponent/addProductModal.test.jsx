jest.mock("@/hooks/useProducts")

import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import AddProductModal from "@/components/addProductComponent/addProductModal"
import { ProductProvider } from "@/context/ProductContext"

function renderModal(props = {}) {
  return render(
    <ProductProvider>
      <AddProductModal isOpen={true} onClose={vi.fn()} {...props} />
    </ProductProvider>
  )
}

describe("Product Form - AddProductModal", () => {
  test("renders form with all required fields", () => {
    renderModal()
    expect(screen.getByLabelText(/Product Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Stock Quantity/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Image URL/i)).toBeInTheDocument()
  })

  test("shows validation errors for invalid inputs", async () => {
    renderModal()
    const submit = screen.getByRole("button", { name: /add/i })
    await userEvent.click(submit)
    expect(await screen.findAllByText("Required")).not.toHaveLength(0)
  })

  test("prevents submission with invalid data", async () => {
    const onClose = vi.fn()
    renderModal({ onClose })

    await userEvent.clear(screen.getByLabelText(/Product Name/i))
    await userEvent.clear(screen.getByLabelText(/Price/i))
    await userEvent.type(screen.getByLabelText(/Price/i), "-100")
    await userEvent.clear(screen.getByLabelText(/Stock Quantity/i))
    await userEvent.type(screen.getByLabelText(/Stock Quantity/i), "-1")

    const submit = screen.getByRole("button", { name: /add/i })
    await userEvent.click(submit)

    await waitFor(() => {
      expect(onClose).not.toHaveBeenCalled()
    })

    expect(screen.getByText("Required")).toBeInTheDocument()
  })

  test("successfully adds product with valid data", async () => {
    const onClose = vi.fn()
    renderModal({ onClose })

    await userEvent.type(screen.getByLabelText(/Product Name/i), "Test Product")
    await userEvent.type(screen.getByLabelText(/Description/i), "Test Desc")
    await userEvent.clear(screen.getByLabelText(/Price/i))
    await userEvent.type(screen.getByLabelText(/Price/i), "50")
    await userEvent.clear(screen.getByLabelText(/Stock Quantity/i))
    await userEvent.type(screen.getByLabelText(/Stock Quantity/i), "5")
    await userEvent.selectOptions(screen.getByLabelText(/Category/i), "Books")
    await userEvent.type(
      screen.getByLabelText(/Image URL/i),
      "http://img.com/pic.jpg"
    )

    await userEvent.click(screen.getByRole("button", { name: /add/i }))
    await waitFor(() => expect(onClose).toHaveBeenCalled(), { timeout: 2000 })
  })

  test("clears form after successful submission", async () => {
    const onClose = vi.fn()
    const { rerender } = renderModal({ onClose })

    await userEvent.type(
      screen.getByLabelText(/Product Name/i),
      "Clear Product"
    )
    await userEvent.clear(screen.getByLabelText(/Price/i))
    await userEvent.type(screen.getByLabelText(/Price/i), "25")
    await userEvent.clear(screen.getByLabelText(/Stock Quantity/i))
    await userEvent.type(screen.getByLabelText(/Stock Quantity/i), "2")

    await userEvent.click(screen.getByRole("button", { name: /add/i }))
    await waitFor(() => expect(onClose).toHaveBeenCalled(), { timeout: 2000 })

    rerender(
      <ProductProvider>
        <AddProductModal isOpen={true} onClose={vi.fn()} />
      </ProductProvider>
    )

    expect(screen.getByLabelText(/Product Name/i)).toHaveValue("")
    expect(screen.getByLabelText(/Price/i)).toHaveValue(null)
    expect(screen.getByLabelText(/Stock Quantity/i)).toHaveValue(null)
  })

  test("handles edit mode correctly", () => {
    const product = {
      id: 1,
      name: "Edit Product",
      description: "Edit Desc",
      price: 100,
      quantity: 10,
      category: "Clothing",
      imageUrl: "http://img.com/edit.jpg",
    }

    renderModal({ initialValues: product })

    expect(screen.getByLabelText(/Product Name/i)).toHaveValue(product.name)
    expect(screen.getByLabelText(/Description/i)).toHaveValue(
      product.description
    )
    expect(screen.getByLabelText(/Price/i)).toHaveValue(product.price)
    expect(screen.getByLabelText(/Stock Quantity/i)).toHaveValue(
      product.quantity
    )
    expect(screen.getByLabelText(/Category/i)).toHaveValue(product.category)
    expect(screen.getByLabelText(/Image URL/i)).toHaveValue(product.imageUrl)
  })
})
