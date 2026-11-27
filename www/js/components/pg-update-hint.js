import { BaseElement, define } from '../core/base-element.js'
import { css, html } from '../core/css.js'
import { applyUpdate } from '../core/sw-client.js'

/** "An update is available" toast, shown when a new service worker is waiting. */
class PgUpdateHint extends BaseElement {
  static template = html`
    <div class="hint" role="status">
      <span data-i18n="App.updateAvailable"></span>
      <button type="button" data-i18n="App.update"></button>
    </div>
  `

  static styles = [
    css`
      .hint {
        position: fixed;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        background-color: var(--contrast-color);
        border: 2px solid var(--theme-color);
        padding: 20px;
        border-radius: 20px;
        color: var(--theme-color);
        width: max-content;
        max-width: calc(100vw - 30px);
      }

      button {
        background-color: var(--theme-color);
        padding: 10px;
        border: none;
        border-radius: 10px;
        color: var(--contrast-color);
        display: inline-block;
        margin-left: 10px;
        cursor: pointer;
      }
    `
  ]

  connected() {
    this.listen(this.$('button'), 'click', applyUpdate)
    this.watch(
      (s) => s.ui.updateAvailable,
      (show) => {
        this.hidden = !show
      }
    )
  }
}

define('pg-update-hint', PgUpdateHint)
