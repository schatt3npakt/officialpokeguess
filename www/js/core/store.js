/**
 * Minimal reactive store.
 *
 * State is a plain object of immutable "slices" (settings, ui, player, options, round).
 * `update(slice, patch)` replaces a slice and notifies subscribers; `subscribe(selector, cb)`
 * only fires when the selected value changed (Object.is, or shallow equality for arrays/objects).
 */

function shallowEqual(a, b) {
  if (Object.is(a, b)) return true
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const ka = Object.keys(a)
  if (ka.length !== Object.keys(b).length) return false
  return ka.every((k) => Object.is(a[k], b[k]))
}

export class Store extends EventTarget {
  #state

  constructor(initial) {
    super()
    this.#state = initial
  }

  get state() {
    return this.#state
  }

  /**
   * @param {string} slice
   * @param {object|function(object):object} patch partial object to merge, or updater fn
   */
  update(slice, patch) {
    const prev = this.#state[slice]
    const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }
    if (next === prev) return
    this.#state = { ...this.#state, [slice]: next }
    this.dispatchEvent(new CustomEvent('change', { detail: { slice } }))
  }

  /**
   * @param {function(object):any} selector
   * @param {function(any, any):void} callback receives (value, previousValue)
   * @param {{signal?: AbortSignal, immediate?: boolean}} [opts]
   * @returns {function():void} unsubscribe
   */
  subscribe(selector, callback, { signal, immediate = true } = {}) {
    let last = selector(this.#state)
    const handler = () => {
      const value = selector(this.#state)
      if (shallowEqual(value, last)) return
      const prev = last
      last = value
      callback(value, prev)
    }
    this.addEventListener('change', handler, { signal })
    if (immediate) callback(last, undefined)
    return () => this.removeEventListener('change', handler)
  }
}
