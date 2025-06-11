import { useReducer, useEffect } from "react"
import { productReducer, productInitialState } from "../reducers/productReducer"
import { useLocalStorage } from "./useLocalStorage"

export function useProducts() {
  const [localData, setLocalData] = useLocalStorage("products", [])
  const [state, dispatch] = useReducer(productReducer, {
    ...productInitialState,
    products: localData,
  })

  useEffect(() => {
    setLocalData(state.products)
  }, [state.products, setLocalData])

  const addProduct = product => {
    const newProduct = { ...product, id: Date.now() }
    dispatch({ type: "ADD_PRODUCT", payload: newProduct })
  }

  const deleteProduct = id => {
    dispatch({ type: "DELETE_PRODUCT", payload: id })
  }

  return {
    ...state,
    addProduct,
    deleteProduct,
  }
}
