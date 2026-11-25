import { baseStyles } from './css.js'
import { store } from './state.js'
import { t } from './i18n.js'

const templates = new WeakMap()

function templateFor(ctor) {
  let tpl = templates.get(ctor)
  if (!tpl) {
    tpl = document.createElement('template')
    tpl.innerHTML = ctor.template ?? ''
    templates.set(ctor, tpl)
  }
  return tpl
}

/**
 * Base class for all components.
 *
 * - Renders `static template` (HTML string) into an open shadow root once, with
 *   `static styles` (CSSStyleSheet[]) adopted after the shared base styles.
 * - `watch(selector, cb)` subscribes to the store, `listen(target, type, fn)` adds event
 *   listeners and `later(fn, ms)` schedules timeouts. All of them are cleaned up
 *   automatically when the element is disconnected.
 * - Elements with `data-i18n="Ns.key"` get their text translated and kept in sync with the
 *   language setting (`data-i18n-placeholder` / `data-i18n-label` for attributes).
 *
 * Subclasses implement `connected()` / `disconnected()` instead of the native callbacks.
 */
export class BaseElement extends HTMLElement {
  static styles = []
  static template = ''

  #abort = null
  #timers = new Set()

  constructor() {
    super()
    const root = this.attachShadow({ mode: 'open' })
    root.adoptedStyleSheets = [baseStyles, ...this.constructor.styles]
    root.append(templateFor(this.constructor).content.cloneNode(true))
  }

  connectedCallback() {
    this.#abort = new AbortController()
    this.watch(
      (s) => s.settings.language,
      () => this.translate()
    )
    this.connected?.()
  }

  disconnectedCallback() {
    this.#abort?.abort()
    this.#abort = null
    for (const id of this.#timers) clearTimeout(id)
    this.#timers.clear()
    this.disconnected?.()
  }

  get signal() {
    return this.#abort?.signal
  }

  $(selector) {
    return this.shadowRoot.querySelector(selector)
  }

  $$(selector) {
    return [...this.shadowRoot.querySelectorAll(selector)]
  }

  watch(selector, callback, opts = {}) {
    return store.subscribe(selector, callback, { ...opts, signal: this.signal })
  }

  listen(target, type, handler, opts = {}) {
    target.addEventListener(type, handler, { ...opts, signal: this.signal })
  }

  later(fn, ms) {
    const id = setTimeout(() => {
      this.#timers.delete(id)
      fn()
    }, ms)
    this.#timers.add(id)
    return id
  }

  translate() {
    for (const el of this.shadowRoot.querySelectorAll('[data-i18n]')) {
      el.textContent = t(el.dataset.i18n)
    }
    for (const el of this.shadowRoot.querySelectorAll('[data-i18n-placeholder]')) {
      el.placeholder = t(el.dataset.i18nPlaceholder)
    }
    for (const el of this.shadowRoot.querySelectorAll('[data-i18n-label]')) {
      el.setAttribute('label', t(el.dataset.i18nLabel))
    }
  }
}

export function define(name, ctor) {
  if (!customElements.get(name)) customElements.define(name, ctor)
}
