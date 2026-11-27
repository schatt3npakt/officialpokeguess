import { BaseElement, define } from '../core/base-element.js'
import { css, html } from '../core/css.js'
import { store } from '../core/state.js'
import { play } from '../core/audio.js'
import { asset } from '../core/paths.js'
import { LANGUAGES } from '../core/i18n.js'
import { THEME_COLORS } from '../core/theme.js'
import { game } from '../game/round.js'
import { LAYER_TRANSITION_MS } from './pg-layer.js'
import './pg-toggle.js'

const FLAGS = { en: 'img/icons/en.svg', de: 'img/icons/de.svg', fr: 'img/icons/fr.png' }

/**
 * Player options (name, colour, Game Boy mode, audio, language). Native modal <dialog>,
 * opened automatically on the first visit. Saving (button, Enter or Esc) starts a new round.
 */
class PgOptionsDialog extends BaseElement {
  static template = html`
    <dialog aria-labelledby="headline">
      <pg-layer direction="rtl">
        <div class="headline" id="headline"></div>

        <div class="inner">
          <div class="name-wrapper">
            <label>
              <span class="label" data-i18n="Options.name"></span>
              <input
                type="text"
                name="name"
                autocomplete="nickname"
                data-i18n-placeholder="Options.namePlaceholder"
              />
            </label>
            <pg-toggle class="show-name" data-i18n-label="Options.showNameBelowClock"></pg-toggle>
          </div>

          <div>
            <p class="label" data-i18n="Options.favoriteColor"></p>
            <div class="color-picker">
              ${THEME_COLORS.map((c) => `<button type="button" data-color="${c}" style="background-color:${c}" aria-label="${c}"></button>`).join('')}
            </div>
          </div>

          <div class="toggle-container">
            <pg-toggle class="gameboy" data-i18n-label="Options.gameBoyMode"></pg-toggle>
            <pg-toggle class="audio" data-i18n-label="Options.enableAudio"></pg-toggle>
          </div>

          <div class="language-selects">
            <p class="label" data-i18n="Options.lang"></p>
            <div class="languages">
              ${LANGUAGES.map((l) => `<button type="button" data-lang="${l}" aria-label="${l}"><img src="${asset(FLAGS[l])}" alt=""></button>`).join('')}
            </div>
          </div>

          <button type="button" class="submit" data-i18n="Options.save"></button>

          <div class="disclaimer">
            <div>
              <span data-i18n="Options.disclaimer"></span><br /><br />
              <a href="https://twitter.com/thebitheart" target="_blank" rel="noopener noreferrer"
                >@bitheart</a
              >
            </div>
            <div>
              <a href="https://bitheart.de/imprint/" target="_blank" rel="noopener noreferrer">
                <img class="logo" src="${asset('img/logo.png')}" alt="bitheart" />
              </a>
            </div>
          </div>
        </div>
      </pg-layer>
    </dialog>
  `

  static styles = [
    css`
      dialog {
        border: none;
        padding: 0;
        margin: 0;
        background: transparent;
        max-width: none;
        max-height: none;
        width: 100vw;
        height: 100vh;
        overflow: visible;
        color: var(--theme-color);

        &::backdrop {
          background: transparent;
        }
      }

      .inner {
        max-width: 720px;
        margin: auto;

        > * {
          margin-bottom: 30px;

          @media (min-width: 720px) {
            margin-bottom: 60px;
          }
        }
      }

      .headline {
        color: var(--theme-color);
        font-size: 50px;
        line-height: 70px;
        margin-bottom: 80px;
        text-align: center;
        overflow-wrap: anywhere;

        @media (min-width: 720px) {
          font-size: 70px;
        }

        &.small {
          font-size: 35px;

          @media (min-width: 720px) {
            font-size: 60px;
          }
        }
      }

      .label {
        display: block;
        color: var(--theme-color);
        font-size: 16px;
        margin: 0 0 5px 0;

        @media (min-width: 720px) {
          margin-bottom: 10px;
        }
      }

      .name-wrapper {
        display: grid;
        grid-template-columns: 1fr;
        row-gap: 10px;

        @media (min-width: 720px) {
          grid-template-columns: 2fr 1fr;
        }
      }

      input {
        background-color: var(--theme-color);
        border: none;
        border-radius: 15px;
        color: var(--contrast-color);
        font-size: 18px;
        padding: 15px;
        width: 100%;
        transition: background-color 0.25s ease-out;

        &::placeholder {
          color: var(--contrast-color);
        }
      }

      .color-picker {
        display: flex;
        flex-flow: row wrap;
        gap: 10px;

        @media (min-width: 720px) {
          gap: 20px;
        }

        button {
          all: unset;
          cursor: pointer;
          display: block;
          height: 35px;
          width: 35px;
          border-radius: 5px;
          transition:
            transform 0.25s ease-out,
            opacity 0.25s ease-out;
          transform: scale(1);
          filter: var(--gb-filter);
          mix-blend-mode: var(--img-blend);

          @media (min-width: 720px) {
            border-radius: 10px;
            height: 50px;
            width: 50px;
          }

          &.active,
          &:hover,
          &:focus-visible {
            transform: scale(1.1);
          }
        }

        &:hover button:not(:hover),
        &:not(:hover) button:not(.active) {
          opacity: 0.5;
        }
      }

      .toggle-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }

      .languages {
        display: flex;
        justify-content: center;
        gap: 20px;

        @media (min-width: 720px) {
          gap: 50px;
        }

        button {
          all: unset;
          cursor: pointer;
          display: block;
          height: 28px;
          width: 28px;
          border-radius: 5px;
          overflow: hidden;
          transition:
            transform 0.25s ease-out,
            opacity 0.25s ease-out;
          transform: scale(1);
          opacity: 0.5;
          filter: var(--gb-filter);
          mix-blend-mode: var(--img-blend);

          @media (min-width: 720px) {
            border-radius: 10px;
            height: 50px;
            width: 50px;
          }

          &.active,
          &:hover,
          &:focus-visible {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &:hover button:not(:hover) {
          opacity: 0.5;
        }
      }

      .submit {
        cursor: pointer;
        background-color: var(--theme-color);
        border: none;
        border-radius: 15px;
        color: var(--contrast-color);
        font-size: 18px;
        padding: 15px;
        width: 100%;
        margin-top: 20px;
        transform: scale(0);
        animation: pop-in 0.25s ease forwards;
      }

      .disclaimer {
        display: grid;
        color: var(--theme-color);
        font-size: 18px;
        text-align: center;

        @media (min-width: 720px) {
          text-align: left;
          grid-template-columns: 1fr 1fr;
        }

        a {
          color: var(--theme-color);
        }
      }

      .logo {
        display: block;
        margin: auto;
        max-width: 100px;
        mix-blend-mode: var(--img-blend);
      }

      @keyframes pop-in {
        from {
          transform: scale(0);
        }
        to {
          transform: scale(1);
        }
      }
    `
  ]

  connected() {
    const dialog = this.$('dialog')
    const layer = this.$('pg-layer')
    const input = this.$('input')

    this.listen(input, 'input', () => this.#renderHeadline())
    this.listen(input, 'keyup', (event) => {
      if (event.key === 'Enter') this.#save()
      else play('typing')
    })
    this.listen(this.$('.submit'), 'click', () => this.#save())
    // Esc saves instead of discarding, so the dialog can never close without a name being set.
    this.listen(dialog, 'cancel', (event) => {
      event.preventDefault()
      this.#save()
    })

    this.listen(this.$('.show-name'), 'click', () => this.#toggleSetting('showNameBelowClock'))
    this.listen(this.$('.gameboy'), 'click', () => this.#toggleSetting('gameBoyMode'))
    this.listen(this.$('.audio'), 'click', () => this.#toggleSetting('audioEnabled'))

    for (const button of this.$$('[data-color]')) {
      this.listen(button, 'mouseenter', () => play('rollover'))
      this.listen(button, 'click', () => {
        store.update('settings', { themeColor: button.dataset.color, gameBoyMode: false })
        play('toggleOn')
      })
    }
    for (const button of this.$$('[data-lang]')) {
      this.listen(button, 'mouseenter', () => play('rollover'))
      this.listen(button, 'click', () => {
        store.update('settings', { language: button.dataset.lang })
        play('toggleOn')
      })
    }

    this.watch(
      (s) => s.settings,
      (settings) => {
        this.$('.show-name').on = settings.showNameBelowClock
        this.$('.gameboy').on = settings.gameBoyMode
        this.$('.audio').on = settings.audioEnabled
        for (const b of this.$$('[data-color]'))
          b.classList.toggle('active', b.dataset.color === settings.themeColor)
        for (const b of this.$$('[data-lang]'))
          b.classList.toggle('active', b.dataset.lang === settings.language)
      }
    )

    this.watch(
      (s) => s.ui.optionsOpen,
      (open) => {
        if (open) {
          input.value = store.state.settings.userName
          this.#renderHeadline()
          if (!dialog.open) dialog.showModal()
          layer.open = true
        } else if (dialog.open) {
          layer.open = false
          this.later(() => dialog.close(), LAYER_TRANSITION_MS)
        }
      }
    )
  }

  #toggleSetting(field) {
    store.update('settings', (s) => ({ ...s, [field]: !s[field] }))
  }

  #renderHeadline() {
    const name = this.$('input').value
    const el = this.$('.headline')
    el.textContent = name ? `Hi, ${name}!` : 'Hi!'
    el.classList.toggle('small', name.length >= 5)
  }

  #save() {
    if (!store.state.ui.optionsOpen) return
    store.update('settings', { userName: this.$('input').value })
    play('confirm')
    store.update('ui', { optionsOpen: false })
    game.reset(false)
  }
}

define('pg-options-dialog', PgOptionsDialog)
