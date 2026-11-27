import { BaseElement, define } from '../../core/base-element.js'
import { css, html } from '../../core/css.js'
import { store } from '../../core/state.js'
import { icons } from '../icons.js'
import '../pg-layer.js'
import '../pg-layer-trigger.js'

/** Support / imprint layer (heart, top right). */
class PgSupport extends BaseElement {
  static template = html`
    <pg-layer-trigger class="bubble">${icons.heart}</pg-layer-trigger>

    <pg-layer direction="ttb">
      <div class="content">
        <p data-i18n="Guess.supportlayer"></p>
        <p>
          <a href="https://bitheart.de/imprint/" target="_blank" rel="noopener noreferrer">bitheart imprint</a
          ><br />
          <a href="https://twitter.com/thebitheart" target="_blank" rel="noopener noreferrer">Twitter</a>
        </p>
      </div>
    </pg-layer>
  `

  static styles = [
    css`
      :host {
        display: contents;
      }

      .bubble {
        top: 15px;
        bottom: auto;
      }

      .content {
        color: var(--theme-color);
      }

      p {
        margin: 0 auto 15px auto;
        max-width: 400px;
        font-size: 18px;

        @media (min-width: 735px) {
          font-size: 22px;
          margin: 0 auto 30px auto;
        }
      }

      a {
        color: var(--theme-color);
      }
    `
  ]

  connected() {
    const trigger = this.$('.bubble')
    const layer = this.$('pg-layer')
    this.listen(trigger, 'click', () => store.update('ui', (ui) => ({ ...ui, supportOpen: !ui.supportOpen })))
    this.watch(
      (s) => s.ui.supportOpen,
      (open) => {
        layer.open = open
        trigger.toggleAttribute('active', open)
      }
    )
    this.watch(
      (s) => s.ui.menuOpen || s.ui.gameOptionsOpen,
      (hide) => trigger.toggleAttribute('hidden-away', hide)
    )
  }

  disconnected() {
    if (store.state.ui.supportOpen) store.update('ui', { supportOpen: false })
  }
}

define('pg-support', PgSupport)
