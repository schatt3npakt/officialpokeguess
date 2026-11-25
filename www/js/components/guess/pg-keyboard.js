import { BaseElement, define } from '../../core/base-element.js'
import { css, html } from '../../core/css.js'
import { anyLayerOpen, store } from '../../core/state.js'
import { play } from '../../core/audio.js'
import { game } from '../../game/round.js'
import { letterIndexes } from '../../game/rules.js'

export const KEYBOARDS = Object.freeze({
  alphabetical: ['abcdefghij', 'klmnopqrs', 'tuvwxyz'],
  qwertz: ['qwertzuiop', 'asdfghjkl', 'yxcvbnm'],
  qwerty: ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
})

export const layoutFor = (alphabetical, language) =>
  alphabetical ? 'alphabetical' : language === 'en' ? 'qwerty' : 'qwertz'

/** On-screen keyboard; also handles the physical keyboard while the guess view is shown. */
class PgKeyboard extends BaseElement {
  static template = html`<div class="keyboard" role="group" aria-label="Keyboard"></div>`

  static styles = [
    css`
      :host {
        display: block;
        margin-top: 20px;
        width: 100%;

        @media (max-width: 720px) and (orientation: landscape) {
          bottom: 50px;
          left: 50%;
          position: fixed;
          transform: translateX(-50%);
          margin: unset;
        }
      }

      .row {
        display: flex;
        justify-content: center;
        flex-flow: row wrap;
        gap: 10px;
        margin-bottom: 10px;

        @media (max-width: 720px) and (orientation: landscape) {
          gap: 8px;
        }
      }

      .key {
        text-transform: uppercase;
        cursor: pointer;
        text-align: center;
        background: var(--theme-color);
        border-radius: 5px;
        font-size: 10px;
        color: var(--contrast-color);
        border: none;
        padding: 0;
        width: 22px;
        height: 28px;
        transition:
          opacity 0.25s ease,
          transform 0.25s ease;
        transform: scale(1);

        @media (min-width: 450px) {
          font-size: 16px;
          width: 30px;
          height: 30px;
        }

        @media (min-width: 720px) {
          font-size: 20px;
          width: 40px;
          height: 40px;
        }

        @media (max-width: 720px) and (orientation: landscape) {
          height: 26px;
          width: 26px;
        }

        &:not(:disabled):hover {
          transform: scale(1.1);
        }

        &:disabled {
          pointer-events: none;
          cursor: not-allowed;
          transform: scale(0.9);
          opacity: 0.5;
        }

        &.false {
          filter: grayscale(1);
        }
      }
    `
  ]

  #keys = new Map()

  connected() {
    const keyboard = this.$('.keyboard')
    this.listen(keyboard, 'click', (event) => {
      const key = event.target.closest('.key')
      if (key && !key.disabled) game.guess(key.dataset.key)
    })
    this.listen(keyboard, 'mouseover', (event) => {
      const key = event.target.closest('.key')
      if (key && !key.contains(event.relatedTarget)) play('rollover')
    })
    this.listen(document, 'keydown', (event) => this.#onKeydown(event))

    this.watch(
      (s) => layoutFor(s.options.useAlphabeticalKeyboard, s.settings.language),
      (layout) => {
        this.#build(layout)
        this.#update()
      }
    )
    this.watch(
      (s) => s.round,
      () => this.#update()
    )
  }

  #build(layout) {
    this.#keys.clear()
    const rows = KEYBOARDS[layout].map((letters) => {
      const row = document.createElement('div')
      row.className = 'row'
      for (const letter of letters) {
        const key = document.createElement('button')
        key.type = 'button'
        key.className = 'key'
        key.dataset.key = letter
        key.textContent = letter
        this.#keys.set(letter, key)
        row.append(key)
      }
      return row
    })
    this.$('.keyboard').replaceChildren(...rows)
  }

  #update() {
    const round = store.state.round
    const playing = round?.phase === 'playing'
    for (const [letter, key] of this.#keys) {
      const guessed = round?.guessed.includes(letter) ?? false
      key.disabled = !playing || guessed
      key.classList.toggle('false', guessed && letterIndexes(round.tiles, letter).length === 0)
    }
  }

  #onKeydown(event) {
    if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return
    if (anyLayerOpen(store.state)) return
    const target = event.composedPath()[0]
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return
    const letter = event.key?.toLowerCase()
    const key = this.#keys.get(letter)
    if (!key || key.disabled) return
    event.preventDefault()
    game.guess(letter)
  }
}

define('pg-keyboard', PgKeyboard)
