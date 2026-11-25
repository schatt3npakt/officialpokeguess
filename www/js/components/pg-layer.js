import { BaseElement, define } from '../core/base-element.js'
import { css, html } from '../core/css.js'

export const LAYER_TRANSITION_MS = 800

/**
 * Full-screen panel with the sliding colour curtain.
 * Set the `open` property; closing plays the reverse curtain for LAYER_TRANSITION_MS.
 * Attributes: direction (rtl|ltr|ttb|btt), mobile-only (always visible inline on desktop).
 */
class PgLayer extends BaseElement {
  static template = html`
    <div class="layer" part="layer">
      <div class="inner" part="inner"><slot></slot></div>
      <div class="overlay"></div>
    </div>
  `

  static styles = [
    css`
      :host {
        display: contents;
      }

      .inner {
        position: fixed;
        inset: 0;
        height: 100vh;
        width: 100vw;
        background-color: var(--contrast-color);
        z-index: var(--layer-z, 2);
        overflow: auto;
        padding: var(--layer-padding, 40px 20px);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0s linear 0.25s;
        box-shadow: var(--gb-shadow);
      }

      .open .inner {
        opacity: 1;
        pointer-events: auto;
      }

      .closing .inner {
        opacity: 0;
        pointer-events: none;
      }

      .overlay {
        background-color: var(--theme-color);
        position: fixed;
        inset: 0;
        transform: translateY(-100vh);
        z-index: var(--layer-overlay-z, 6);
        pointer-events: none;
      }

      .open.rtl .overlay,
      .closing.ltr .overlay {
        animation: slide-rtl 0.75s ease;
      }
      .open.ltr .overlay,
      .closing.rtl .overlay {
        animation: slide-ltr 0.75s ease;
      }
      .open.ttb .overlay,
      .closing.btt .overlay {
        animation: slide-ttb 0.75s ease;
      }
      .open.btt .overlay,
      .closing.ttb .overlay {
        animation: slide-btt 0.75s ease;
      }

      :host([mobile-only]) .inner {
        box-shadow: none;
      }

      @media (min-width: 720px) {
        :host([mobile-only]) .inner {
          position: relative;
          inset: auto;
          opacity: 1;
          height: auto;
          width: auto;
          padding: 0;
          pointer-events: auto;
          z-index: auto;
          overflow: visible;
          background: none;
        }

        :host([mobile-only]) .overlay {
          display: none;
        }
      }

      @keyframes slide-rtl {
        0%,
        15% {
          transform: translateX(100vw);
        }
        85%,
        100% {
          transform: translateX(-100vw);
        }
      }

      @keyframes slide-ltr {
        0%,
        15% {
          transform: translateX(-100vw);
        }
        85%,
        100% {
          transform: translateX(100vw);
        }
      }

      @keyframes slide-ttb {
        0%,
        15% {
          transform: translateY(-100vh);
        }
        85%,
        100% {
          transform: translateY(100vh);
        }
      }

      @keyframes slide-btt {
        0%,
        15% {
          transform: translateY(100vh);
        }
        85%,
        100% {
          transform: translateY(-100vh);
        }
      }
    `
  ]

  #open = false
  #closeTimer = null

  connected() {
    this.$('.layer').classList.add(this.getAttribute('direction') || 'rtl')
  }

  get open() {
    return this.#open
  }

  set open(value) {
    value = Boolean(value)
    if (value === this.#open) return
    this.#open = value
    const layer = this.$('.layer')
    clearTimeout(this.#closeTimer)
    layer.classList.toggle('open', value)
    layer.classList.toggle('closing', !value)
    if (!value) {
      this.#closeTimer = setTimeout(() => layer.classList.remove('closing'), LAYER_TRANSITION_MS)
    }
  }
}

define('pg-layer', PgLayer)
