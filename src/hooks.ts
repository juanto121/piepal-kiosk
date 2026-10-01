import { useEffect, useRef, useState } from 'react'

/** Calls `onTimeout` after `ms` without a touch or key press. */
export function useInactivity(ms: number, onTimeout: () => void, enabled = true) {
  const callback = useRef(onTimeout)
  callback.current = onTimeout

  useEffect(() => {
    if (!enabled) return
    let timer = window.setTimeout(() => callback.current(), ms)
    const reset = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => callback.current(), ms)
    }
    window.addEventListener('pointerdown', reset)
    window.addEventListener('keydown', reset)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pointerdown', reset)
      window.removeEventListener('keydown', reset)
    }
  }, [ms, enabled])
}

/** Current time, refreshed every `intervalMs`. */
export function useNow(intervalMs = 250): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}

/** Calls `onTimeout` once after `ms`. */
export function useTimeout(ms: number, onTimeout: () => void) {
  const callback = useRef(onTimeout)
  callback.current = onTimeout
  useEffect(() => {
    const id = window.setTimeout(() => callback.current(), ms)
    return () => window.clearTimeout(id)
  }, [ms])
}
