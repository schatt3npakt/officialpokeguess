import { BaseElement, define } from '../../core/base-element.js'
import { css, html } from '../../core/css.js'
import { store } from '../../core/state.js'
import { dataUrl } from '../../core/paths.js'
import { navigate } from '../../core/router.js'
import { applyGameMode } from '../../game/options.js'
import { game } from '../../game/round.js'
import { icons } from '../icons.js'

let modesPromise = null
const loadModes = () => {
  modesPromise ??= fetch(dataUrl('gameModes.json')).then((r) => r.json())
  return modesPromise
}

/** Predefined game modes (data/gameModes.json). Selecting one starts a new round. */
class PgModesView extends BaseElement {
  static template = html`<ul class="game-modes"></ul>`

  static styles = [
    css`
      :host {
        display: block;
        overflow: auto;
      }

      .game-modes {
        max-width: 1200px;
        list-style-type: none;
        padding: 15px;
        max-height: 80vh;
        overflow: auto;
        margin: 20px auto 0 auto;

        @media (min-width: 720px) {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
      }

      button {
        all: unset;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: 1fr 2fr;
        width: 100%;
        border: 3px solid var(--theme-color);
        color: var(--theme-color);
        border-radius: 10px;
        font-size: 20px;
        margin-bottom: 20px;
        text-align: left;
        cursor: pointer;
        transition: transform 0.25s ease-in-out;

        &:hover,
        &:focus-visible {
          transform: scale(1.025);
        }

        @media (min-width: 720px) {
          margin-bottom: 0;
          height: 100%;
        }
      }

      .icon {
        position: relative;

        svg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: auto;
          fill: var(--theme-color);
        }
      }

      .description {
        hyphens: auto;
        padding: 0 15px;
      }

      .title,
      .text {
        display: block;
        margin: 18px 0;
      }

      .title {
        font-size: 18px;
      }

      .text {
        font-size: 16px;
        hyphens: auto;
      }
    `
  ]

  async connected() {
    const modes = await loadModes()
    if (!this.isConnected) return
    const list = this.$('.game-modes')
    list.replaceChildren(
      ...modes.map((mode) => {
        const li = document.createElement('li')
        li.innerHTML = html` <button type="button">
          <span class="icon">${icons.pokeDex}</span>
          <span class="description">
            <strong class="title" data-i18n="GameModes.${mode.title}.title"></strong>
            <span class="text" data-i18n="GameModes.${mode.title}.description"></span>
          </span>
        </button>`
        this.listen(li.querySelector('button'), 'click', () => this.#select(mode))
        return li
      })
    )
    this.translate()
  }

  #select(mode) {
    store.update('options', (current) => applyGameMode(current, mode.gameOptions))
    game.reset(false)
    navigate('/')
  }
}

define('pg-modes-view', PgModesView)
