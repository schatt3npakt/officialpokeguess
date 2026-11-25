import { BaseElement, define } from '../core/base-element.js'
import { css, html } from '../core/css.js'
import { play } from '../core/audio.js'
import { icons } from './icons.js'

/**
 * Round floating button that opens/closes a layer. Shows its slotted icon (default: gear),
 * or a close icon while `active`. The host is the fixed-position element, so parents
 * position it with plain CSS on the tag (e.g. `pg-layer-trigger.options { left: 15px }`).
 */
class PgLayerTrigger extends BaseElement {
  static observedAttributes = ['active']

  static template = html`
    <button type="button">
      <span class="icon"><slot>${icons.gear}</slot></span>
      <span class="close">${icons.close}</span>
    </button>
  `

  static styles = [
    css`
      :host {
        position: fixed;
        bottom: 15px;
        right: 15px;
        z-index: 3;
        display: block;
        height: 35px;
        width: 35px;
        transform: scale(1);
        transition: transform 0.25s ease;

        @media (min-width: 720px) {
          height: 45px;
          width: 45px;
        }
      }

      :host(:hover) {
        transform: scale(1.05);
      }

      :host(:active) {
        transform: scale(0.9);
      }

      :host([hidden-away]) {
        transform: scale(0);
      }

      button {
        all: unset;
        background-color: var(--theme-color);
        border-radius: 54px;
        border: 1px solid var(--contrast-color);
        cursor: pointer;
        display: block;
        height: 100%;
        width: 100%;
        position: relative;
        box-sizing: border-box;
      }

      .icon,
      .close {
        position: absolute;
        inset: 25%;
        display: block;
      }

      svg,
      ::slotted(svg) {
        display: block;
        width: 100%;
        height: 100%;
        fill: var(--contrast-color);
      }

      .close,
      :host([active]) .icon {
        display: none;
      }

      :host([active]) .close {
        display: block;
      }
    `
  ]

  connected() {
    const button = this.$('button')
    this.listen(button, 'click', () => play(this.hasAttribute('active') ? 'minimize' : 'maximize'))
    this.listen(button, 'mouseenter', () => play('rollover'))
    this.update()
  }

  attributeChangedCallback() {
    if (this.isConnected) this.update()
  }

  update() {
    this.$('button').setAttribute('aria-expanded', String(this.hasAttribute('active')))
  }
}

define('pg-layer-trigger', PgLayerTrigger)
