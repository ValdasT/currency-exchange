type LRUCache<K, V> = {
  get: (key: K) => V | null
  set: (key: K, value: V) => void
}

/**
 * Creates an LRU Cache instance.
 * @param maxSize - The maximum number of items the cache can hold.
 * @returns An LRUCache instance with get and set methods.
 */
const createLRUCache = <K, V>(maxSize: number): LRUCache<K, V> => {
  const cache = new Map<K, V>()

  /**
   * Retrieves a value from the cache.
   * Moves the accessed item to the end (most recently used).
   * @param key - The key to retrieve.
   * @returns The value associated with the key, or null if not found.
   */
  const get = (key: K): V | null => {
    if (!cache.has(key)) {
      return null
    }
    // Move the accessed item to the end to mark it as recently used
    const value = cache.get(key)!
    cache.delete(key)
    cache.set(key, value)
    return value
  }

  /**
   * Adds or updates a value in the cache.
   * Removes the least recently used item if the cache exceeds the max size.
   * @param key - The key for the value to set.
   * @param value - The value to set.
   */
  const set = (key: K, value: V): void => {
    if (cache.size >= maxSize) {
      // Remove the least recently used (first) item
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }
    // Add the new item to the cache
    cache.set(key, value)
  }

  return { get, set }
}

export default createLRUCache
