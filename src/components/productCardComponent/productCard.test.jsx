jest.mock("@/hooks/useProducts")

import { render, screen, fireEvent } from "@testing-library/react"
import ProductCard from "@/components/productCardComponent/productCard"

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
  test("should render product information correctly", () => {
    render(
      <ProductCard product={product} onDelete={jest.fn()} onEdit={jest.fn()} />
    )

    expect(screen.getByText("Sample Product")).toBeInTheDocument()
    expect(screen.getByText("$49.99")).toBeInTheDocument()
    expect(screen.getByText("Electronics")).toBeInTheDocument()
    expect(screen.getByText("Low Stock")).toBeInTheDocument()
    expect(screen.getByText("This is a sample product.")).toBeInTheDocument()
    expect(screen.getByText("Stock: 3 Units")).toBeInTheDocument()
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://example.com/sample.jpg"
    )
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

    render(
      <ProductCard
        product={emptyProduct}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
      />
    )

    expect(screen.getByText("-")).toBeInTheDocument() // category fallback
    expect(screen.getByText("Out of Stock")).toBeInTheDocument()
    expect(screen.getByText("Stock: 0 Units")).toBeInTheDocument()
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://via.placeholder.com/250"
    )
  })

  test("should trigger edit and delete callbacks", () => {
    const handleEdit = jest.fn()
    const handleDelete = jest.fn()

    render(
      <ProductCard
        product={product}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    )

    fireEvent.click(screen.getByLabelText("Edit Sample Product"))
    expect(handleEdit).toHaveBeenCalledWith(product)

    fireEvent.click(screen.getByLabelText("Delete Sample Product"))
    expect(handleDelete).toHaveBeenCalledWith(product.id)
  })

  test("should handle image loading error and fallback", () => {
    render(
      <ProductCard product={product} onDelete={jest.fn()} onEdit={jest.fn()} />
    )
    const image = screen.getByRole("img")
    fireEvent.error(image)
    expect(image).toBeInTheDocument()
  })
})
