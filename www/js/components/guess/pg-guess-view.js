import { BaseElement, define } from '../../core/base-element.js'
import { css, html } from '../../core/css.js'
import { play } from '../../core/audio.js'
import { store } from '../../core/state.js'
import { asset } from '../../core/paths.js'
import { t } from '../../core/i18n.js'
import { getName } from '../../game/pokedex-data.js'
import { game } from '../../game/round.js'
import { icons } from '../icons.js'
import './pg-poke-image.js'
import './pg-lives.js'
import './pg-tiles.js'
import './pg-keyboard.js'
import './pg-game-options.js'
import './pg-support.js'

/** The guessing game screen. */
class PgGuessView extends BaseElement {
  static template = html`
    <div class="wrapper">
      <div class="reset-layer"></div>

      <div class="nopokemon" hidden>
        <p data-i18n="Guess.noPokemon"></p>
        <p data-i18n="Guess.checkGameOptions"></p>
      </div>

      <div class="content">
        <button type="button" class="skip">Skip</button>

        <div class="pokeball-overlay" aria-hidden="true">
          <span class="top">${icons.ballTop}</span>
          <span class="bottom">${icons.ballBottom}</span>
        </div>

        <pg-lives></pg-lives>
        <pg-poke-image></pg-poke-image>
        <pg-tiles></pg-tiles>
        <pg-keyboard></pg-keyboard>

        <div class="feedback" role="status" aria-live="polite"></div>
      </div>
    </div>

    <pg-game-options></pg-game-options>
    <pg-support></pg-support>
  `

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
      }

      .wrapper {
        position: relative;
        margin-top: auto;
      }

      .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .nopokemon {
        max-width: 480px;
        margin: auto;
        color: var(--theme-color);
        text-align: center;
        font-size: 24px;
      }

      .loading {
        .content {
          opacity: 0.5;
          pointer-events: none;
        }

        &::after {
          position: fixed;
          top: 50%;
          left: 50%;
          content: '';
          display: block;
          width: 64px;
          height: 64px;
          margin: 8px;
          border-radius: 50%;
          border: 6px solid var(--theme-color);
          border-color: var(--theme-color) transparent var(--theme-color) transparent;
          animation: dual-ring 1.2s linear infinite;
          transform-origin: top left;
        }
      }

      .skip {
        border: none;
        background-color: var(--theme-color);
        color: var(--contrast-color);
        padding: 5px;
        position: fixed;
        top: 55px;
        left: 15px;
        border-radius: 50px;
        font-size: 10px;
        cursor: pointer;
        min-width: 50px;
        transform: scale(1);
        transition: transform 0.25s ease-out;

        &:hover {
          transform: scale(1.05);
        }

        @media (min-width: 720px) {
          top: 75px;
          padding: 8px;
          font-size: 14px;
          min-width: 60px;
        }
      }

      .reset-layer {
        display: none;
      }

      .resetting .reset-layer {
        animation: fade-left 2s ease-in-out forwards;
        display: block;
        position: fixed;
        top: 75px;
        left: 0;
        background-color: var(--theme-color);
        height: 100vh;
        width: 100vw;
        z-index: 2;
        overflow: hidden;

        @media (min-width: 720px) {
          top: 150px;
        }

        &::after {
          animation: pokefade 2s ease-in-out infinite;
          background-color: var(--contrast-color);
          mask: var(--loader) center / 100% 100% no-repeat;
          display: block;
          position: fixed;
          top: 50%;
          left: 50%;
          content: '';
          height: 100px;
          width: 100px;
          transform: translate(-50%, -50%);
          z-index: 4;
        }
      }

      .pokeball-overlay {
        width: 200px;
        height: 200px;
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
        top: 120px;
        pointer-events: none;

        @media (max-width: 720px) and (orientation: landscape) {
          left: 100px;
          width: 180px;
          height: 180px;
        }

        @media (min-width: 720px) {
          top: 180px;
          width: 150px;
          height: 150px;
        }

        @media (min-width: 1200px) {
          width: 200px;
          height: 200px;
        }

        @media (min-width: 1700px) {
          width: 300px;
          height: 300px;
        }

        .top,
        .bottom {
          opacity: 0;
          position: absolute;
          top: 0;
          left: 50%;
          width: 100%;
          transition:
            transform 0.25s ease 0.25s,
            opacity 0.25s ease;
        }

        .bottom {
          transform: translateX(-50%) translateY(10%);
        }

        .top {
          transform: translateX(-50%) translateY(-10%);
        }

        &.revealed {
          .top,
          .bottom {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        svg {
          display: block;
          width: 100%;
          height: auto;
          fill: var(--theme-color);
        }
      }

      .feedback {
        position: fixed;
        bottom: 15px;
        font-size: 15px;
        left: 50%;
        color: var(--theme-color);
        z-index: 2;
        transform: translateX(-50%) translateY(100px);
        text-align: center;
        padding: 10px 0;
        width: 100vw;
        pointer-events: none;

        &.show {
          animation: fade-in-from-bottom 2.5s ease-in-out forwards;
        }

        @media (min-width: 720px) {
          font-size: 22px;
        }
      }

      @keyframes dual-ring {
        0% {
          transform: rotate(0deg) translate(-50%, -50%);
        }
        100% {
          transform: rotate(360deg) translate(-50%, -50%);
        }
      }

      @keyframes fade-in-from-bottom {
        0%,
        100% {
          transform: translateX(-50%) translateY(100px);
        }
        15%,
        85% {
          transform: translateX(-50%) translateY(0);
        }
      }

      @keyframes pokefade {
        0% {
          transform: translate(calc(100vw - 50%), -50%);
        }
        15%,
        85% {
          transform: scale(1) translate(-50%, -50%);
        }
        100% {
          transform: rotate(360deg) translate(calc(-100vw - 50%), -50%);
        }
      }

      @keyframes fade-left {
        0% {
          transform: translateX(-100vw);
        }
        15%,
        85% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(100vw);
        }
      }
    `
  ]

  connected() {
    const wrapper = this.$('.wrapper')
    wrapper.style.setProperty('--loader', `url("${asset('img/icons/pokeloader-white.svg')}")`)

    const skip = this.$('.skip')
    this.listen(skip, 'click', () => game.skip())
    this.listen(skip, 'mouseenter', () => play('rollover'))
    this.listen(this, 'pg-image-loading', (event) => wrapper.classList.toggle('loading', event.detail))

    this.watch(
      (s) => s.game.noPokemon,
      (none) => {
        this.$('.nopokemon').hidden = !none
        this.$('.content').hidden = none
      }
    )
    this.watch(
      (s) => s.game.resetting,
      (on) => wrapper.classList.toggle('resetting', on)
    )
    this.watch(
      (s) => s.game.celebrate,
      (on) => this.$('.pokeball-overlay').classList.toggle('revealed', on)
    )
    this.watch(
      (s) => [s.game.feedback, s.settings.language],
      ([feedback], prev) => {
        const el = this.$('.feedback')
        el.textContent = feedbackText(feedback)
        // Restart the slide-in animation for every new message (not on language change).
        if (feedback && feedback !== prev?.[0]) {
          el.classList.remove('show')
          void el.offsetWidth
          el.classList.add('show')
        } else if (!feedback) {
          el.classList.remove('show')
        }
      }
    )

    game.attach()
  }

  disconnected() {
    game.detach()
  }
}

function feedbackText(feedback) {
  if (!feedback) return ''
  const base = 'Guess.feedbackOptions'
  switch (feedback.kind) {
    case 'right':
    case 'wrong':
      return t(`${base}.${feedback.kind}.${feedback.n}`)
    case 'win':
    case 'perfect':
    case 'failReveal':
      return getName(feedback.id, store.state.settings.language) + t(`${base}.${feedback.kind}`)
    default:
      return t(`${base}.${feedback.kind}`)
  }
}

define('pg-guess-view', PgGuessView)
