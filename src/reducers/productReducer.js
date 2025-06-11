export const productInitialState = {
  products: [],
  loading: false,
  error: null,
}

export function productReducer(state, action) {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload }
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.payload] }
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      }
    case "SET_LOADING":
      return { ...state, loading: true }
    case "SET_ERROR":
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}
