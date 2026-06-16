import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIdle } from '../hooks/useIdle'

describe('useIdle', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('starts not idle', () => {
    const { result } = renderHook(() => useIdle(1000))
    expect(result.current).toBe(false)
  })

  it('becomes idle after the timeout', () => {
    const { result } = renderHook(() => useIdle(1000))
    act(() => { vi.advanceTimersByTime(1100) })
    expect(result.current).toBe(true)
  })

  it('activity resets the timer', () => {
    const { result } = renderHook(() => useIdle(1000))
    act(() => { vi.advanceTimersByTime(600) })
    act(() => { window.dispatchEvent(new Event('pointerdown')) })
    act(() => { vi.advanceTimersByTime(600) })
    expect(result.current).toBe(false)
    act(() => { vi.advanceTimersByTime(500) })
    expect(result.current).toBe(true)
  })
})
