import { useReducer, useEffect, useCallback } from "react"
import { useLocalStorage } from "./useLocalStorage" // named import here

const ACTIONS = {
  ADD: "ADD_PRODUCT",
  DELETE: "DELETE_PRODUCT",
  BULK_DELETE: "BULK_DELETE_PRODUCTS",
  UNDO_DELETE: "UNDO_DELETE",
  LOAD: "LOAD_PRODUCTS",
  ERROR: "ERROR_STATE",
}

const initialState = {
  products: [],
  deleted: [],
  loading: true,
  error: null,
}

function productReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD:
      return {
        ...state,
        products: action.payload || [],
        loading: false,
        error: null,
      }
    case ACTIONS.ADD:
      return {
        ...state,
        products: [...state.products, action.payload],
      }
    case ACTIONS.DELETE:
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload.id),
        deleted: [...state.deleted, action.payload],
      }
    case ACTIONS.BULK_DELETE: {
      const itemsToDelete = Array.isArray(action.payload) ? action.payload : []
      const idsToDelete = new Set(itemsToDelete.map(p => p.id))
      return {
        ...state,
        products: state.products.filter(p => !idsToDelete.has(p.id)),
        deleted: [...state.deleted, ...itemsToDelete],
      }
    }
    case ACTIONS.UNDO_DELETE:
      return {
        ...state,
        products: [...state.products, ...state.deleted],
        deleted: [],
      }
    case ACTIONS.ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload || "Unknown error",
      }
    default:
      return state
  }
}

export default function useProducts() {
  const [storedProducts, setStoredProducts] = useLocalStorage("products", [])
  const [state, dispatch] = useReducer(productReducer, {
    ...initialState,
    products: storedProducts,
    loading: false,
  })

  useEffect(() => {
    try {
      setStoredProducts(state.products)
    } catch {
      dispatch({
        type: ACTIONS.ERROR,
        payload: "Failed to save to localStorage",
      })
    }
  }, [state.products, setStoredProducts])

  const addProduct = useCallback(product => {
    dispatch({ type: ACTIONS.ADD, payload: product })
  }, [])

  const deleteProduct = useCallback(product => {
    dispatch({ type: ACTIONS.DELETE, payload: product })
  }, [])

  const bulkDeleteProducts = useCallback(products => {
    dispatch({ type: ACTIONS.BULK_DELETE, payload: products })
  }, [])

  const undoDelete = useCallback(() => {
    dispatch({ type: ACTIONS.UNDO_DELETE })
  }, [])

  return {
    products: state.products,
    deletedProducts: state.deleted,
    loading: state.loading,
    addProduct,
    deleteProduct,
    bulkDeleteProducts,
    undoDelete,
  }
}
