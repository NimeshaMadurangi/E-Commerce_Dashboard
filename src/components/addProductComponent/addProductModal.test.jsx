import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import AddProductModal from "./AddProductModal"
import { ProductProvider } from "@/context/ProductContext"

function renderModal(props = {}) {
  return render(
    <ProductProvider>
      <AddProductModal
        isOpen={true}
        onClose={props.onClose || vi.fn()}
        {...props}
      />
    </ProductProvider>
  )
}

describe("AddProductModal - Product Form", () => {
  test("renders form with all required fields", () => {
    renderModal()
    expect(screen.getByLabelText(/Product Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Stock Quantity/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Image URL/i)).toBeInTheDocument()
  })

  test("shows validation errors for empty required fields", async () => {
    renderModal()
    const submitButton = screen.getByRole("button", { name: /add/i })
    await userEvent.click(submitButton)

    expect(await screen.findAllByText(/Required/)).toHaveLength(2) // name and category
  })

  test("prevents submission with invalid numeric values", async () => {
    const onClose = vi.fn()
    renderModal({ onClose })

    await userEvent.clear(screen.getByLabelText(/Product Name/i))
    await userEvent.type(screen.getByLabelText(/Price/i), "-10")
    await userEvent.type(screen.getByLabelText(/Stock Quantity/i), "-5")

    const submitButton = screen.getByRole("button", { name: /add/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(onClose).not.toHaveBeenCalled()
    })

    expect(screen.getByText(/Required/)).toBeInTheDocument()
    expect(screen.getByText(/Must be a positive number/)).toBeInTheDocument()
    expect(
      screen.getByText(/Must be a non-negative number/)
    ).toBeInTheDocument()
  })

  test("successfully adds product with valid data", async () => {
    const onClose = vi.fn()
    renderModal({ onClose })

    await userEvent.type(screen.getByLabelText(/Product Name/i), "Test Product")
    await userEvent.type(
      screen.getByLabelText(/Description/i),
      "Test Description"
    )
    await userEvent.clear(screen.getByLabelText(/Price/i))
    await userEvent.type(screen.getByLabelText(/Price/i), "100")
    await userEvent.clear(screen.getByLabelText(/Stock Quantity/i))
    await userEvent.type(screen.getByLabelText(/Stock Quantity/i), "10")
    await userEvent.selectOptions(
      screen.getByLabelText(/Category/i),
      "Electronics"
    )
    await userEvent.type(
      screen.getByLabelText(/Image URL/i),
      "http://example.com/image.jpg"
    )

    await userEvent.click(screen.getByRole("button", { name: /add/i }))

    await waitFor(
      () => {
        expect(onClose).toHaveBeenCalled()
      },
      { timeout: 2000 }
    )
  })

  test("clears form after successful submission", async () => {
    const onClose = vi.fn()
    const { rerender } = renderModal({ onClose })

    await userEvent.type(screen.getByLabelText(/Product Name/i), "Clear Me")
    await userEvent.clear(screen.getByLabelText(/Price/i))
    await userEvent.type(screen.getByLabelText(/Price/i), "50")
    await userEvent.clear(screen.getByLabelText(/Stock Quantity/i))
    await userEvent.type(screen.getByLabelText(/Stock Quantity/i), "5")

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

  test("handles edit mode correctly and pre-fills form", () => {
    const product = {
      id: 1,
      name: "Existing Product",
      description: "Existing description",
      price: 99.99,
      quantity: 3,
      category: "Books",
      imageUrl: "http://example.com/existing.jpg",
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
