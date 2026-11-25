import { BaseElement, define } from '../../core/base-element.js'
import { css, html } from '../../core/css.js'
import { store } from '../../core/state.js'
import { play, playCry } from '../../core/audio.js'
import { t } from '../../core/i18n.js'
import { formatNumber } from '../../game/pokedex-data.js'
import { hintsLeft, isIgnored } from '../../game/rules.js'
import { game } from '../../game/round.js'

/**
 * The hidden name as letter tiles (click = hint) plus the info around it:
 * generation, number, types, rarity, hints left, timer and the "Play Cry" button.
 */
class PgTiles extends BaseElement {
  static template = html`
    <div class="name-container">
      <div class="letters"></div>
      <button type="button" class="cry-hint">Play Cry</button>
      <div class="gen-hint"></div>
      <div class="hint-hint"><span data-i18n="Guess.hints"></span> <span class="number"></span></div>
      <div class="index-hint"></div>
      <div class="type-hint"></div>
      <div class="counter-hint"><span>00</span><span>:</span><span class="seconds"></span></div>
      <div class="rarity-hint"></div>
    </div>
  `

  static styles = [
    css`
      :host {
        display: block;
        margin: auto;
      }

      .name-container {
        font-size: 20px;
        color: var(--theme-color);
        display: flex;
        margin: auto;
        position: relative;
        min-width: 210px;
        justify-content: center;

        @media (max-width: 720px) and (orientation: landscape) {
          position: fixed;
          bottom: 160px;
          left: 50%;
          transform: translateX(-50%);
        }

        @media (min-width: 720px) {
          font-size: 50px;
        }
      }

      .letters {
        display: flex;
        gap: 10px;

        @media (min-width: 720px) {
          gap: 15px;
        }
      }

      .letter {
        all: unset;
        display: block;
        position: relative;
        padding-bottom: 5px;
        width: 20px;
        text-align: center;
        text-transform: uppercase;
        overflow: hidden;
        transform: scale(1);
        transition: transform 0.25s ease;

        @media (min-width: 720px) {
          width: 55px;
        }

        &:not(.ignore)::before {
          content: '';
          display: block;
          height: 100%;
          width: 100%;
          background-color: var(--theme-color);
          position: absolute;
          bottom: 0;
          border-radius: 5px;
        }

        &.reveal {
          pointer-events: none;

          &::before {
            animation: bounce 1s forwards;
          }
        }
      }

      .hints .letter:not(.ignore) {
        &::after {
          color: var(--contrast-color);
          content: '?';
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, calc(-50% + 100%));
          transition:
            opacity 0.25s ease,
            transform 0.25s ease;
        }

        &:not(.reveal):hover,
        &:not(.reveal):focus-visible {
          cursor: pointer;
          transform: scale(1.1);

          &::after {
            transform: translate(-50%, -50%);
          }
        }
      }

      .gen-hint,
      .index-hint,
      .type-hint,
      .rarity-hint,
      .hint-hint,
      .counter-hint {
        position: absolute;
        font-size: 12px;
        white-space: nowrap;
      }

      .gen-hint {
        top: -25px;
        right: 0;

        @media (min-width: 720px) {
          font-size: 20px;
          right: -65px;
          top: 0;
        }
      }

      .index-hint {
        top: -25px;
        left: 0;

        @media (min-width: 720px) {
          font-size: 20px;
          left: -80px;
          top: 0;
        }
      }

      .hint-hint {
        top: 170px;
        right: 50%;
        transform: translateX(50%);

        @media (min-width: 325px) {
          top: 160px;
        }

        @media (min-width: 450px) {
          top: 180px;
        }

        @media (min-width: 720px) {
          font-size: 20px;
          right: -122px;
          top: 45px;
          transform: none;
        }

        @media (max-width: 720px) and (orientation: landscape) {
          top: -25px;
        }

        @media (min-width: 720px) {
          &.en {
            right: -85px;
          }
          &.fr {
            right: -105px;
          }
        }

        .number.last {
          animation: danger-fade 0.25s ease-in-out infinite;
        }
      }

      .cry-hint {
        background-color: var(--theme-color);
        color: var(--contrast-color);
        border: none;
        padding: 2px;
        border-radius: 10px;
        position: absolute;
        top: -25px;
        left: 0;
        font-size: 10px;
        display: none;

        @media (min-width: 720px) {
          display: block;
          padding: 5px 10px;
          font-size: 16px;
          left: -97px;
          top: 35px;
          cursor: pointer;
          transform: scale(1);
          transition: transform 0.25s ease-out;

          &:hover {
            transform: scale(1.05);
          }
        }
      }

      .counter-hint {
        top: -40px;
        left: 50%;
        text-transform: uppercase;
        transform: translateX(-50%);
        transition: color 0.25s ease-in-out;

        @media (min-width: 720px) {
          font-size: 30px;
          top: -85px;
        }

        &.short {
          color: #c22e28;
        }
      }

      .type-hint,
      .rarity-hint {
        top: -40px;
        text-transform: uppercase;

        @media (min-width: 720px) {
          font-size: 20px;
          top: -35px;
        }
      }

      .type-hint {
        left: 0;

        span:not(:last-child)::after {
          content: '/';
          margin: 0 3px;
        }
      }

      .rarity-hint {
        right: 0;
      }

      @keyframes bounce {
        0% {
          height: 100%;
        }
        15% {
          height: calc(100% + 10px);
        }
        100% {
          height: 5px;
        }
      }

      @keyframes danger-fade {
        50% {
          opacity: 0.5;
        }
      }
    `
  ]

  #pokeId = null

  connected() {
    const letters = this.$('.letters')

    this.listen(letters, 'click', (event) => {
      const tile = event.target.closest('.letter')
      if (tile) game.hint(Number(tile.dataset.index))
    })
    this.listen(letters, 'mouseover', (event) => {
      const tile = event.target.closest('.letter')
      if (tile && !tile.contains(event.relatedTarget) && store.state.options.hintsAllowed) play('rollover')
    })
    this.listen(this.$('.cry-hint'), 'click', () => playCry(store.state.round?.pokeId))
    this.listen(this.$('.cry-hint'), 'mouseenter', () => play('rollover'))

    this.watch(
      (s) => s.round,
      (round) => this.#renderRound(round)
    )
    this.watch(
      ({ round, options, settings }) => ({
        round,
        language: settings.language,
        audio: settings.audioEnabled,
        hintsAllowed: options.hintsAllowed,
        showGenHint: options.showGenHint,
        showIndexHint: options.showIndexHint,
        showTypeHint: options.showTypeHint,
        showPokemonCry: options.showPokemonCry,
        timerMode: options.timerMode
      }),
      (s) => this.#renderInfo(s)
    )
    this.watch(
      (s) => s.game.counter,
      (counter) => {
        this.$('.seconds').textContent = String(counter).padStart(2, '0')
        this.$('.counter-hint').classList.toggle('short', counter <= 10)
      }
    )
  }

  #renderRound(round) {
    const letters = this.$('.letters')
    if (!round) {
      letters.replaceChildren()
      this.#pokeId = null
      return
    }
    if (round.pokeId !== this.#pokeId || letters.children.length !== round.tiles.length) {
      this.#pokeId = round.pokeId
      const fragment = document.createDocumentFragment()
      round.tiles.forEach((char, i) => {
        const ignored = isIgnored(char)
        const tile = document.createElement(ignored ? 'span' : 'button')
        tile.className = ignored ? 'letter ignore' : 'letter'
        tile.dataset.index = i
        tile.textContent = char
        if (!ignored) tile.type = 'button'
        fragment.append(tile)
      })
      letters.replaceChildren(fragment)
    }
    round.revealed.forEach((revealed, i) => {
      const tile = letters.children[i]
      tile.classList.toggle('reveal', revealed)
      if (tile.localName === 'button') {
        tile.setAttribute('aria-label', revealed ? tile.textContent : '?')
      }
    })
  }

  #renderInfo(s) {
    const round = s.round
    const left = round ? hintsLeft(round) : 0
    this.$('.name-container').classList.toggle('hints', Boolean(round && s.hintsAllowed && left >= 1))

    const gen = this.$('.gen-hint')
    gen.hidden = !s.showGenHint || !round
    gen.textContent = round ? `Gen ${round.gen}` : ''

    const index = this.$('.index-hint')
    index.hidden = !s.showIndexHint || !round
    index.textContent = round ? `Nr. ${formatNumber(round.pokeId)}` : ''

    const types = this.$('.type-hint')
    types.hidden = !s.showTypeHint || !round
    types.replaceChildren(
      ...(round?.types ?? []).map((type) => {
        const span = document.createElement('span')
        span.textContent = t(`Guess.types.${type}`)
        return span
      })
    )

    const hint = this.$('.hint-hint')
    hint.hidden = !s.hintsAllowed
    hint.classList.toggle('en', s.language === 'en')
    hint.classList.toggle('fr', s.language === 'fr')
    const number = this.$('.number')
    number.textContent = String(left)
    number.classList.toggle('last', left === 1)

    this.$('.cry-hint').hidden = !(s.audio && s.showPokemonCry)
    this.$('.counter-hint').hidden = !s.timerMode

    const rarity = this.$('.rarity-hint')
    rarity.textContent = round?.special ? t(`Guess.${round.special}`) : ''
  }
}

define('pg-tiles', PgTiles)
