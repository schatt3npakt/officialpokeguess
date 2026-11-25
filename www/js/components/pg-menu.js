import { BaseElement, define } from '../core/base-element.js'
import { css, html } from '../core/css.js'
import { store } from '../core/state.js'
import { play } from '../core/audio.js'
import { ROUTES } from '../core/router.js'
import { icons } from './icons.js'
import './pg-layer.js'
import './pg-layer-trigger.js'

const items = ROUTES.map(
  (r) => html`
    <li>
      <a href="#${r.path}" data-path="${r.path}">${icons[r.icon]}<span data-i18n="${r.label}"></span></a>
    </li>
  `
).join('')

/** Main navigation (hamburger bottom right). */
class PgMenu extends BaseElement {
  static template = html`
    <pg-layer-trigger class="trigger">${icons.hamburger}</pg-layer-trigger>
    <pg-layer direction="rtl">
      <nav>
        <ul>
          ${items}
          <li>
            <a href="#" class="options">${icons.gear}<span data-i18n="Menu.options"></span></a>
          </li>
        </ul>
      </nav>
    </pg-layer>
  `

  static styles = [
    css`
      :host {
        display: contents;
        color: var(--theme-color);
      }

      nav {
        color: var(--theme-color);
        font-size: 25px;
        height: 100%;
      }

      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;

        @media (min-width: 720px) {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
      }

      li {
        text-transform: uppercase;
        margin-bottom: 15px;
        position: relative;

        @media (min-width: 720px) {
          display: inline-block;
          text-align: center;
          margin: 0;
        }

        &:hover svg {
          transform: scale(1.1);
        }
      }

      nav svg {
        display: none;
        fill: var(--theme-color);

        @media (min-width: 720px) {
          display: block;
          margin: 0 auto 30px auto;
          width: 77px;
          height: 77px;
          transform: scale(1);
          transition: transform 0.25s ease-in-out;
        }
      }

      a {
        color: var(--theme-color);
        display: inline-block;
        text-transform: uppercase;
        margin-bottom: 15px;
        text-decoration: none;
        position: relative;
        cursor: pointer;

        @media (min-width: 720px) {
          margin: auto;
          text-align: center;
        }

        &::before {
          background-color: var(--theme-color);
          bottom: -5px;
          content: '';
          height: 5px;
          left: 0;
          position: absolute;
          transition: width 0.25s ease-out;
          width: 0;
        }

        &:hover::before,
        &.active::before {
          width: 100%;
        }

        &.active {
          animation: flash 0.25s 2;

          svg {
            transform: scale(1.1);
          }
        }
      }

      @keyframes flash {
        from {
          opacity: 1;
        }
        to {
          opacity: 0.5;
        }
      }
    `
  ]

  connected() {
    const trigger = this.$('.trigger')
    const layer = this.$('pg-layer')

    this.listen(trigger, 'click', () => {
      store.update('ui', (ui) => ({ ...ui, menuOpen: !ui.menuOpen }))
    })

    for (const link of this.$$('a')) {
      this.listen(link, 'mouseenter', () => play('rollover'))
    }
    for (const link of this.$$('a[data-path]')) {
      this.listen(link, 'click', () => store.update('ui', { menuOpen: false }))
    }
    this.listen(this.$('a.options'), 'click', (event) => {
      event.preventDefault()
      store.update('ui', { menuOpen: false, optionsOpen: true })
    })

    this.watch(
      (s) => s.ui.menuOpen,
      (open) => {
        layer.open = open
        trigger.toggleAttribute('active', open)
      }
    )
    this.watch(
      (s) => s.ui.gameOptionsOpen || s.ui.supportOpen,
      (hide) => {
        trigger.toggleAttribute('hidden-away', hide)
      }
    )
    this.watch(
      (s) => s.ui.route,
      (route) => {
        for (const link of this.$$('a[data-path]')) {
          const active = link.dataset.path === route
          link.classList.toggle('active', active)
          if (active) link.setAttribute('aria-current', 'page')
          else link.removeAttribute('aria-current')
        }
      }
    )
  }
}

define('pg-menu', PgMenu)
