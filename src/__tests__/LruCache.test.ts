import { describe, it, expect, beforeEach } from '@jest/globals'
import createLRUCache from '../app/utils/lruCache'

describe('LRU Cache', () => {
  let cache: ReturnType<typeof createLRUCache<string, number>>

  beforeEach(() => {
    cache = createLRUCache<string, number>(3) // Set max size to 3 for testing
  })

  it('should add and retrieve items correctly', () => {
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('c', 3)

    expect(cache.get('a')).toBe(1)
    expect(cache.get('b')).toBe(2)
    expect(cache.get('c')).toBe(3)
  })

  it('should return null for non-existing items', () => {
    expect(cache.get('nonexistent')).toBeNull()
  })

  it('should evict the least recently used item when cache size exceeds max size', () => {
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('c', 3)

    // Adding a new item should evict 'a' as it is the least recently used
    cache.set('d', 4)

    expect(cache.get('a')).toBeNull() // 'a' should be evicted
    expect(cache.get('b')).toBe(2)
    expect(cache.get('c')).toBe(3)
    expect(cache.get('d')).toBe(4)
  })

  it('should update an existing item and mark it as recently used', () => {
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('c', 3)

    // Access 'a' to make it recently used
    cache.get('a')

    // Adding a new item should not evict 'a'
    cache.set('d', 4)

    expect(cache.get('a')).toBe(1) // 'a' should still be in the cache
    expect(cache.get('b')).toBeNull() // 'b' should be evicted
    expect(cache.get('c')).toBe(3)
    expect(cache.get('d')).toBe(4)
  })
})
