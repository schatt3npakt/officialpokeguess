import { BaseElement, define } from '../core/base-element.js'
import { css, html } from '../core/css.js'

/**
 * Collapsible section with a heading button.
 * Attributes: heading, open, show-on-desktop (stays collapsible on wide screens;
 * otherwise it is always expanded there).
 */
class PgCollapsible extends BaseElement {
  static observedAttributes = ['heading', 'open']

  static template = html`
    <button class="button" type="button" aria-expanded="false"></button>
    <div class="content"><slot></slot></div>
  `

  static styles = [
    css`
      :host {
        display: block;
        margin: 20px 0;
      }

      .button {
        all: unset;
        box-sizing: border-box;
        display: block;
        text-align: left;
        border-bottom: 2px solid var(--theme-color);
        font-size: 22px;
        cursor: pointer;
        color: var(--theme-color);
        width: 100%;
        position: relative;

        &::after,
        &::before {
          content: '';
          display: block;
          width: 15px;
          height: 3px;
          background-color: var(--theme-color);
          position: absolute;
          top: 50%;
          right: 0;
        }

        &::after {
          transform: rotate(90deg);
          transition: transform 0.5s ease-in-out;
        }
      }

      :host([open]) .button::after {
        transform: rotate(0);
      }

      .content {
        margin-top: 20px;
        max-height: 0;
        overflow: auto;
        transition: max-height 0.5s ease-in-out;
      }

      :host([open]) .content {
        max-height: 400px;
      }

      @media (min-width: 720px) {
        :host([open]) .content {
          max-height: none;
        }

        :host(:not([show-on-desktop])) {
          .button {
            border: none;
            font-size: 24px;
            margin-bottom: 15px;
            cursor: default;

            &::after,
            &::before {
              display: none;
            }
          }

          .content {
            max-height: none;
          }
        }

        :host([show-on-desktop][open]) .button {
          background-color: var(--contrast-color);
          position: sticky;
          top: 0;
          z-index: 4;
        }
      }
    `
  ]

  connected() {
    this.listen(this.$('.button'), 'click', () => {
      this.toggleAttribute('open')
      this.dispatchEvent(new Event('toggle'))
    })
    this.render()
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render()
  }

  render() {
    this.$('.button').textContent = this.getAttribute('heading') ?? ''
    this.$('.button').setAttribute('aria-expanded', String(this.hasAttribute('open')))
  }
}

define('pg-collapsible', PgCollapsible)
