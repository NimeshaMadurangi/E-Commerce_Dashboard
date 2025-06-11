export const required = value => (value ? undefined : "Required")

export const minLength = min => value =>
  value && value.length < min ? `Must be at least ${min} characters` : undefined

export const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined

export const positiveNumber = value =>
  value && (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) <= 0)
    ? "Must be a positive number with up to 2 decimals"
    : undefined

export const nonNegativeInteger = value =>
  value && (!/^\d+$/.test(value) || Number(value) < 0)
    ? "Must be a non-negative integer"
    : undefined

export const maxChars = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined

export const url = value => {
  if (!value) return undefined
  try {
    new URL(value)
    return undefined
  } catch {
    return "Invalid URL"
  }
}

// Custom quantity validator: required and > 0 integer
export const validateQuantity = value => {
  if (!value) return "Required"
  if (!/^\d+$/.test(value)) return "Quantity must be an integer"
  if (Number(value) < -1) return "Quantity must be greater than 0"
  return undefined
}
