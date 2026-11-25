import { BaseElement, define } from '../core/base-element.js'
import { css, html } from '../core/css.js'
import { store } from '../core/state.js'
import { routeFor } from '../core/router.js'
import './pg-notice.js'
import './pg-update-hint.js'
import './pg-options-dialog.js'
import './pg-clock.js'
import './pg-menu.js'
import './pg-toggle.js'

/** Application shell: global overlays, clock, router outlet, menu and day/night toggle. */
class PgApp extends BaseElement {
  static template = html`
    <div class="app">
      <pg-notice></pg-notice>
      <pg-update-hint hidden></pg-update-hint>
      <pg-options-dialog></pg-options-dialog>
      <pg-clock></pg-clock>
      <main class="outlet"></main>
      <pg-menu></pg-menu>
      <pg-toggle class="daytime" type="daytime"></pg-toggle>
    </div>
  `

  static styles = [
    css`
      :host {
        display: block;
      }

      .app {
        background-color: var(--contrast-color);
        display: flex;
        flex-direction: column;
        padding: 0 0 50px 0;
        height: 100vh;
        height: 100dvh;
        width: 100vw;
        transition: background-color 0.25s ease;
        box-shadow: var(--gb-shadow);
        overflow: hidden;
      }

      .outlet {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }

      .outlet > * {
        flex: 1;
        min-height: 0;
      }

      .daytime {
        position: fixed;
        top: 15px;
        left: 15px;
      }
    `
  ]

  #routeToken = 0

  connected() {
    const daytime = this.$('.daytime')
    this.listen(daytime, 'click', () => {
      store.update('settings', (s) => ({ ...s, isDay: !s.isDay }))
    })
    this.watch(
      (s) => s.settings.isDay,
      (isDay) => {
        daytime.on = isDay
      }
    )
    this.watch(
      (s) => s.ui.route,
      (route) => this.#show(route)
    )
  }

  async #show(path) {
    const token = ++this.#routeToken
    const route = routeFor(path)
    await route.load()
    if (token !== this.#routeToken) return // a newer navigation won
    const outlet = this.$('.outlet')
    if (outlet.firstElementChild?.localName === route.tag) return
    outlet.replaceChildren(document.createElement(route.tag))
  }
}

define('pg-app', PgApp)
