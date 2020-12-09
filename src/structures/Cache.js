const cache = new Map();
const timeouts = new Map();

export default class Cache extends Map {
  static initCache(Class) {
    cache.set(Class, new Map());
  }

  static clear(Class, ...data) {
    const classCache = cache.get(Class);
    return classCache.clear(...data);
  }

  static delete(Class, ...data) {
    const classCache = cache.get(Class);
    return classCache.delete(...data);
  }

  static entries(Class, ...data) {
    const classCache = cache.get(Class);
    return classCache.entries(...data);
  }

  static forEach(Class, ...data) {
    const classCache = cache.get(Class);
    return classCache.forEach(...data);
  }

  static get(Class, ...data) {
    const classCache = cache.get(Class);
    return classCache.get(...data);
  }

  static has(Class, ...data) {
    const classCache = cache.get(Class);
    return classCache.has(...data);
  }

  static keys(Class, ...data) {
    const classCache = cache.get(Class);
    return classCache.keys(...data);
  }

  static set(Class, ...data) {
    const classCache = cache.get(Class);
    return classCache.set(...data);
  }

  static values(Class, ...data) {
    const classCache = cache.get(Class);
    return classCache.values(...data);
  }

  static timedRemove(Class, key, duration = 60000 * 10) {
    clearTimeout(timeouts.get(key));
    const timeout = setTimeout(() => {
      Cache.delete(Class, key);
    }, duration);
    timeouts.set(key, timeout);
  }

  static timedSet(Class, key, item, duration) {
    Cache.set(Class, key, item);
    Cache.timedRemove(Class, key, duration);
  }

  static sync(Class, item, duration) {
    const { _id } = item;
    Cache.timedSet(Class, _id, item, duration);
  }
}
