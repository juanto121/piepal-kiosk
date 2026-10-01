import type { Pie } from './config'

export type SaleStatus = 'confirmed' | 'unconfirmed'

export interface Sale {
  time: number
  pieId: string
  price: number
  status: SaleStatus
}

export interface PendingOrder {
  pieId: string
  startedAt: number
}

export type Stock = Record<string, number>

export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

const KEYS = {
  stock: 'piepal.stock.v1',
  pending: 'piepal.pending.v1',
  sales: 'piepal.sales.v1',
} as const

// Keeps the log from growing without bound in browser storage.
const MAX_SALES = 2000

function read<T>(storage: KeyValueStorage, key: string, fallback: T): T {
  try {
    const value = storage.getItem(key)
    return value === null ? fallback : (JSON.parse(value) as T)
  } catch {
    return fallback
  }
}

function write(storage: KeyValueStorage, key: string, value: unknown): void {
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or blocked: the kiosk keeps working for this session.
  }
}

function remove(storage: KeyValueStorage, key: string): void {
  try {
    storage.removeItem(key)
  } catch {
    // ignore
  }
}

export function createMemoryStorage(): KeyValueStorage {
  const data = new Map<string, string>()
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  }
}

export function getBrowserStorage(): KeyValueStorage {
  try {
    const probe = '__piepal_probe__'
    window.localStorage.setItem(probe, probe)
    window.localStorage.removeItem(probe)
    return window.localStorage
  } catch {
    return createMemoryStorage()
  }
}

export function createStore(storage: KeyValueStorage, pies: Pie[]) {
  function getStock(): Stock {
    const saved = read<Stock>(storage, KEYS.stock, {})
    const stock: Stock = {}
    for (const pie of pies) {
      const value = saved[pie.id]
      stock[pie.id] = typeof value === 'number' && value >= 0 ? value : pie.initialStock
    }
    return stock
  }

  function setStock(pieId: string, count: number): Stock {
    const stock = getStock()
    stock[pieId] = Math.max(0, Math.floor(count))
    write(storage, KEYS.stock, stock)
    return stock
  }

  function resetStock(): Stock {
    const stock = Object.fromEntries(pies.map((pie) => [pie.id, pie.initialStock]))
    write(storage, KEYS.stock, stock)
    return stock
  }

  function getPending(): PendingOrder | null {
    return read<PendingOrder | null>(storage, KEYS.pending, null)
  }

  function startPending(pieId: string, now: number): PendingOrder {
    const pending = { pieId, startedAt: now }
    write(storage, KEYS.pending, pending)
    return pending
  }

  function cancelPending(): void {
    remove(storage, KEYS.pending)
  }

  /**
   * Turns the pending order into a sale: stock −1 and a log entry.
   * Idempotent — a second call (e.g. timeout firing right after "Ya pagué") does nothing.
   */
  function resolvePending(status: SaleStatus, now: number): Sale | null {
    const pending = getPending()
    if (!pending) return null
    remove(storage, KEYS.pending)

    const pie = pies.find((p) => p.id === pending.pieId)
    if (!pie) return null

    setStock(pie.id, getStock()[pie.id] - 1)
    const sale: Sale = { time: now, pieId: pie.id, price: pie.price, status }
    write(storage, KEYS.sales, [...getSales(), sale].slice(-MAX_SALES))
    return sale
  }

  function getSales(): Sale[] {
    return read<Sale[]>(storage, KEYS.sales, [])
  }

  return { getStock, setStock, resetStock, getPending, startPending, cancelPending, resolvePending, getSales }
}

export type KioskStore = ReturnType<typeof createStore>
