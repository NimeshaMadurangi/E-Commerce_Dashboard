import { useState, useEffect } from "react"

export function useLocalStorage(key, initialValue, version = 1) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return initialValue

      const parsed = JSON.parse(item)
      if (parsed.version !== version) {
        return initialValue
      }

      return parsed.data
    } catch (error) {
      console.error("Error reading from localStorage", error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify({ data: storedValue, version }))
    } catch (error) {
      console.error("Error writing to localStorage", error)
    }
  }, [key, storedValue, version])

  return [storedValue, setStoredValue]
}
