jest.mock("@/hooks/useProducts")

import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import FilterComponent from "@/components/filterComponent/filterComponent"

describe("FilterComponent", () => {
  const setup = (filters = {}, onChange = jest.fn()) => {
    render(<FilterComponent filters={filters} onChange={onChange} />)
    return onChange
  }

  test("should filter products by search term", () => {
    const onChange = setup({ search: "phone" })
    const searchInput = screen.getByPlaceholderText(/search by name/i)
    fireEvent.change(searchInput, { target: { value: "laptop" } })
    expect(onChange).toHaveBeenCalledWith("search", "laptop")
  })

  test("should filter products by category", () => {
    const onChange = setup({ category: "Books" })
    const select = screen.getByDisplayValue("Books")
    fireEvent.change(select, { target: { value: "Electronics" } })
    expect(onChange).toHaveBeenCalledWith("category", "Electronics")
  })

  test("should filter products by price range", () => {
    const onChange = setup({ minPrice: "10", maxPrice: "100" })

    const minInput = screen.getByPlaceholderText("Min Price")
    fireEvent.change(minInput, { target: { value: "20" } })
    expect(onChange).toHaveBeenCalledWith("minPrice", "20")

    const maxInput = screen.getByPlaceholderText("Max Price")
    fireEvent.change(maxInput, { target: { value: "80" } })
    expect(onChange).toHaveBeenCalledWith("maxPrice", "80")
  })

  test("should filter products by stock status", () => {
    const onChange = setup({ stockStatus: "in-stock" })
    const select = screen.getByDisplayValue("In Stock")
    fireEvent.change(select, { target: { value: "low-stock" } })
    expect(onChange).toHaveBeenCalledWith("stockStatus", "low-stock")
  })

  test("should combine multiple filters correctly", () => {
    const filters = {
      search: "phone",
      category: "Electronics",
      stockStatus: "in-stock",
      minPrice: "100",
      maxPrice: "500",
    }
    setup(filters)

    expect(screen.getByDisplayValue("phone")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Electronics")).toBeInTheDocument()
    expect(screen.getByDisplayValue("In Stock")).toBeInTheDocument()
    expect(screen.getByDisplayValue("100")).toBeInTheDocument()
    expect(screen.getByDisplayValue("500")).toBeInTheDocument()
  })

  test("should show default values if filters are empty", () => {
    setup()

    expect(screen.getByPlaceholderText(/search/i)).toHaveValue("")
    expect(screen.getByDisplayValue("All Categories")).toBeInTheDocument()
    expect(screen.getByDisplayValue("All")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Min Price")).toHaveValue(null)
    expect(screen.getByPlaceholderText("Max Price")).toHaveValue(null)
  })
})
