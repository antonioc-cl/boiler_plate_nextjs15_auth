import { useState, useCallback } from 'react'

interface UseCounterOptions {
  initialValue?: number
  min?: number
  max?: number
}

interface UseCounterReturn {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  setCount: (value: number) => void
}

export function useCounter({
  initialValue = 0,
  min = -Infinity,
  max = Infinity,
}: UseCounterOptions = {}): UseCounterReturn {
  const [count, setCount] = useState(initialValue)

  const increment = useCallback(() => {
    setCount((prev) => {
      const newValue = prev + 1
      return newValue > max ? max : newValue
    })
  }, [max])

  const decrement = useCallback(() => {
    setCount((prev) => {
      const newValue = prev - 1
      return newValue < min ? min : newValue
    })
  }, [min])

  const reset = useCallback(() => {
    setCount(initialValue)
  }, [initialValue])

  const setCountWithBounds = useCallback(
    (value: number) => {
      if (value > max) {
        setCount(max)
      } else if (value < min) {
        setCount(min)
      } else {
        setCount(value)
      }
    },
    [min, max]
  )

  return {
    count,
    increment,
    decrement,
    reset,
    setCount: setCountWithBounds,
  }
}
