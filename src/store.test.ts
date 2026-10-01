import { describe, expect, it } from 'vitest'
import { config } from './config'
import { createMemoryStorage, createStore } from './store'

function setup() {
  const storage = createMemoryStorage()
  return { storage, store: createStore(storage, config.pies) }
}

describe('kiosk store', () => {
  it('starts with 10 berries and 10 lemon', () => {
    const { store } = setup()
    expect(store.getStock()).toEqual({ berries: 10, lemon: 10 })
  })

  it('"Ya pagué" decreases stock by one and logs a confirmed sale', () => {
    const { store } = setup()
    store.startPending('lemon', 1000)
    const sale = store.resolvePending('confirmed', 5000)
    expect(sale).toEqual({ time: 5000, pieId: 'lemon', price: 8000, status: 'confirmed' })
    expect(store.getStock()).toEqual({ berries: 10, lemon: 9 })
    expect(store.getPending()).toBeNull()
  })

  it('a timeout decreases stock by one and logs an unconfirmed sale', () => {
    const { store } = setup()
    store.startPending('berries', 0)
    store.resolvePending('unconfirmed', 120_000)
    expect(store.getStock().berries).toBe(9)
    expect(store.getSales().map((s) => s.status)).toEqual(['unconfirmed'])
  })

  it('resolving twice only counts one sale', () => {
    const { store } = setup()
    store.startPending('lemon', 0)
    store.resolvePending('confirmed', 1)
    expect(store.resolvePending('unconfirmed', 2)).toBeNull()
    expect(store.getStock().lemon).toBe(9)
    expect(store.getSales()).toHaveLength(1)
  })

  it('choosing a different pie does not change stock', () => {
    const { store } = setup()
    store.startPending('lemon', 0)
    store.cancelPending()
    expect(store.resolvePending('unconfirmed', 1)).toBeNull()
    expect(store.getStock()).toEqual({ berries: 10, lemon: 10 })
  })

  it('stock never goes below zero', () => {
    const { store } = setup()
    store.setStock('lemon', 0)
    store.startPending('lemon', 0)
    store.resolvePending('confirmed', 1)
    expect(store.getStock().lemon).toBe(0)
    expect(store.setStock('berries', -5).berries).toBe(0)
  })

  it('persists across store instances and resets to initial stock', () => {
    const { storage, store } = setup()
    store.setStock('berries', 3)
    store.startPending('lemon', 0)
    const reopened = createStore(storage, config.pies)
    expect(reopened.getStock().berries).toBe(3)
    expect(reopened.getPending()).toEqual({ pieId: 'lemon', startedAt: 0 })
    expect(reopened.resetStock()).toEqual({ berries: 10, lemon: 10 })
  })
})
