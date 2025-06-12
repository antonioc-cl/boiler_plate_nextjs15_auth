import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('initializes with default value of 0', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('initializes with custom initial value', () => {
    const { result } = renderHook(() => useCounter({ initialValue: 10 }))
    expect(result.current.count).toBe(10)
  })

  it('increments the count', () => {
    const { result } = renderHook(() => useCounter())

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toBe(1)
  })

  it('decrements the count', () => {
    const { result } = renderHook(() => useCounter({ initialValue: 5 }))

    act(() => {
      result.current.decrement()
    })

    expect(result.current.count).toBe(4)
  })

  it('resets to initial value', () => {
    const { result } = renderHook(() => useCounter({ initialValue: 10 }))

    act(() => {
      result.current.increment()
      result.current.increment()
    })

    expect(result.current.count).toBe(12)

    act(() => {
      result.current.reset()
    })

    expect(result.current.count).toBe(10)
  })

  it('sets count to specific value', () => {
    const { result } = renderHook(() => useCounter())

    act(() => {
      result.current.setCount(25)
    })

    expect(result.current.count).toBe(25)
  })

  it('respects maximum boundary', () => {
    const { result } = renderHook(() =>
      useCounter({ initialValue: 9, max: 10 })
    )

    act(() => {
      result.current.increment()
      result.current.increment() // This should not go beyond 10
    })

    expect(result.current.count).toBe(10)
  })

  it('respects minimum boundary', () => {
    const { result } = renderHook(() => useCounter({ initialValue: 1, min: 0 }))

    act(() => {
      result.current.decrement()
      result.current.decrement() // This should not go below 0
    })

    expect(result.current.count).toBe(0)
  })

  it('enforces bounds when setting count directly', () => {
    const { result } = renderHook(() => useCounter({ min: 0, max: 100 }))

    act(() => {
      result.current.setCount(150)
    })

    expect(result.current.count).toBe(100)

    act(() => {
      result.current.setCount(-50)
    })

    expect(result.current.count).toBe(0)
  })
})
