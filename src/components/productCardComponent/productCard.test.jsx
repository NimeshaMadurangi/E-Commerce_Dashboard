import { describe, test, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import ProductCard from "@/components/productCardComponent/productCard"

import "@testing-library/jest-dom/vitest"

vi.mock("@/hooks/useProducts", () => ({
  default: vi.fn(() => ({
    products: [],
    loading: false,
    error: null,
  })),
}))

const product = {
  id: 1,
  name: "Sample Product",
  price: 49.99,
  category: "Electronics",
  quantity: 3,
  description: "This is a sample product.",
  imageUrl: "https://example.com/sample.jpg",
}

describe("ProductCard", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("should render product information correctly", () => {
    const handleEdit = vi.fn()
    const handleDelete = vi.fn()

    render(
      <ProductCard
        product={product}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    )

    expect(screen.getByText("Sample Product")).toBeInTheDocument()
    expect(screen.getByText("$49.99")).toBeInTheDocument()
    expect(screen.getByText("Electronics")).toBeInTheDocument()
    expect(screen.getByText("Low Stock")).toBeInTheDocument()
    expect(screen.getByText("This is a sample product.")).toBeInTheDocument()
    expect(screen.getByText("Stock: 3 Units")).toBeInTheDocument()

    const img = document.querySelector("img.product-img")
    expect(img).toHaveAttribute("src", "https://example.com/sample.jpg")
  })

  test("should handle empty state gracefully", () => {
    const emptyProduct = {
      id: 2,
      name: "",
      price: 0,
      category: "",
      quantity: 0,
      description: "",
      imageUrl: "",
    }

    const handleEdit = vi.fn()
    const handleDelete = vi.fn()

    render(
      <ProductCard
        product={emptyProduct}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    )

    const categoryElements = screen.getAllByText("-")
    expect(categoryElements.length).toBeGreaterThan(0)

    expect(screen.getByText("Out of Stock")).toBeInTheDocument()
    expect(screen.getByText("Stock: 0 Units")).toBeInTheDocument()

    const img = document.querySelector("img.product-img")
    expect(img).toHaveAttribute("src", "https://via.placeholder.com/250")
  })

  test("should trigger edit and delete callbacks", () => {
    const handleEdit = vi.fn()
    const handleDelete = vi.fn()

    render(
      <ProductCard
        product={product}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    )

    fireEvent.click(screen.getByLabelText("Edit Sample Product"))
    expect(handleEdit).toHaveBeenCalledWith(product)

    fireEvent.click(screen.getByLabelText("Delete Sample Product"))
    expect(handleDelete).toHaveBeenCalledWith(product.id)
  })

  test("should handle image loading error and fallback", () => {
    const handleEdit = vi.fn()
    const handleDelete = vi.fn()

    render(
      <ProductCard
        product={product}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    )

    const image = document.querySelector("img.product-img")
    fireEvent.error(image)
    expect(image).toBeInTheDocument()
  })
})
