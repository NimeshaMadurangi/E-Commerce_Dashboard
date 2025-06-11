export const productInitialState = {
  products: [],
  loading: false,
  error: null,
}

export function productReducer(state, action) {
  switch (action.type) {
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.payload] }
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      }
    case "SET_PRODUCTS":
      return { ...state, products: action.payload }
    default:
      return state
  }
}
