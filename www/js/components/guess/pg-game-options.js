import { BaseElement, define } from '../../core/base-element.js'
import { css, html } from '../../core/css.js'
import { store } from '../../core/state.js'
import { GENS } from '../../game/gens.js'
import { toggleGen } from '../../game/options.js'
import { game } from '../../game/round.js'
import { LAYER_TRANSITION_MS } from '../pg-layer.js'
import '../pg-layer.js'
import '../pg-layer-trigger.js'
import '../pg-toggle.js'

/** Options that only take effect with a new Pokémon; changing them resets the round on close. */
const RESET_OPTIONS = new Set(['excludeGuessedPokemon', 'infiniteGuesses', 'oneGuessOnly', 'timerMode'])
/** Mutually exclusive difficulty options. */
const EXCLUSIVE = { infiniteGuesses: 'oneGuessOnly', oneGuessOnly: 'infiniteGuesses' }

const toggle = (option, label) =>
  `<li><pg-toggle data-option="${option}" data-i18n-label="Guess.${label}"></pg-toggle></li>`

/** In-game options layer (cog, bottom left). */
class PgGameOptions extends BaseElement {
  static template = html`
    <pg-layer-trigger class="bubble"></pg-layer-trigger>

    <pg-layer direction="ltr">
      <div class="layer">
        <p class="reset-notice" aria-live="polite">
          <span data-i18n="Guess.saving"></span>&nbsp;<span class="dot">.</span>&nbsp;<span class="dot"
            >.</span
          >&nbsp;<span class="dot">.</span>
        </p>

        <p class="title" data-i18n="Guess.options"></p>

        <div class="content">
          <section>
            <p data-i18n="Guess.pokemonGenerations"></p>
            <p class="reload-hint" data-i18n="Guess.reloadHint"></p>
            <ul class="gens">
              ${GENS.map((g) => `<li><pg-toggle data-gen="${g.id}" label="Gen ${g.id}"></pg-toggle></li>`).join('')}
            </ul>
          </section>

          <section>
            <p data-i18n="Guess.imageOptions"></p>
            <ul class="image-options">
              ${toggle('revealCaught', 'revealCaughtImage')} ${toggle('showPokeImage', 'showImage')}
              ${toggle('showPartOfImage', 'showPartOfImage')}
              ${toggle('showPokemonOnFlee', 'showPokemonOnFlee')}
            </ul>
          </section>

          <section>
            <p data-i18n="Guess.showHints"></p>
            <ul>
              ${toggle('hintsAllowed', 'letterHints')} ${toggle('showIndexHint', 'showIndex')}
              ${toggle('showTypeHint', 'showType')} ${toggle('showPokemonCry', 'showPokemonCry')}
            </ul>
          </section>

          <section>
            <p data-i18n="Guess.encounterOptions"></p>
            <p class="reload-hint" data-i18n="Guess.reloadHint"></p>
            <ul>
              ${toggle('excludeGuessedPokemon', 'onlyUncaughtPokemon')}
            </ul>
          </section>

          <section>
            <p data-i18n="Guess.keyboardOptions"></p>
            <ul>
              ${toggle('useAlphabeticalKeyboard', 'alphabeticalKeyboard')}
            </ul>
          </section>

          <section>
            <p data-i18n="Guess.difficulty"></p>
            <p class="reload-hint" data-i18n="Guess.reloadHint"></p>
            <ul>
              ${toggle('infiniteGuesses', 'infiniteGuesses')} ${toggle('oneGuessOnly', 'oneGuessOnly')}
              ${toggle('timerMode', 'timerModeActive')}
            </ul>
          </section>
        </div>
      </div>
    </pg-layer>
  `

  static styles = [
    css`
      :host {
        display: contents;
      }

      .bubble {
        left: 15px;
        right: auto;
      }

      .layer {
        color: var(--theme-color);
        text-align: center;
        position: relative;
        min-height: 100%;
      }

      .reset-notice {
        pointer-events: none;
        position: fixed;
        top: 50%;
        left: 50%;
        font-size: 24px;
        opacity: 0;
        transform: translate(-50%, calc(-50% + 20px));
        transition:
          opacity 0.25s ease,
          transform 0.25s ease;
        z-index: 1;

        .dot {
          display: inline-block;
          opacity: 0;
          transition: opacity 0.25s ease;

          &:nth-of-type(2) {
            transition-delay: 0.25s;
          }
          &:nth-of-type(3) {
            transition-delay: 0.5s;
          }
          &:nth-of-type(4) {
            transition-delay: 0.75s;
          }
        }
      }

      .resetting {
        .content {
          pointer-events: none;
          opacity: 0.3;
        }

        .reset-notice {
          opacity: 1;
          transform: translate(-50%, -50%);

          .dot {
            opacity: 1;
          }
        }
      }

      .content {
        transition: opacity 0.25s ease-in-out;

        @media (min-width: 720px) {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(3, 1fr);
        }
      }

      p {
        margin: 0 auto 15px auto;
        max-width: 400px;
        font-size: 18px;

        @media (min-width: 735px) {
          font-size: 22px;
          margin: 0 auto 10px auto;
        }
      }

      .title {
        margin: 0 auto 30px auto;
      }

      .reload-hint {
        font-size: 13px;
        margin-top: -10px;
      }

      ul {
        list-style-type: none;
        padding: 0;
        margin-top: 0;
        margin-bottom: 30px;
      }

      li {
        display: inline-block;
        vertical-align: top;
        hyphens: auto;
        font-size: 12px;
        max-width: 110px;

        &:not(:last-child) {
          margin-right: 10px;
        }
      }

      .gens {
        display: flex;
        gap: 10px;
        max-width: 300px;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
        margin: 0 auto 20px auto;

        @media (min-width: 735px) {
          max-width: 370px;
        }

        li {
          margin-right: 0;
        }
      }

      .image-options li {
        margin-bottom: 15px;
      }
    `
  ]

  #needsReset = false

  connected() {
    const trigger = this.$('.bubble')
    const layer = this.$('pg-layer')

    this.listen(trigger, 'click', () => this.#toggleLayer())

    for (const el of this.$$('[data-gen]')) {
      this.listen(el, 'click', () => {
        const gen = Number(el.dataset.gen)
        store.update('options', (o) => ({ ...o, activeGens: toggleGen(o.activeGens, gen) }))
        this.#needsReset = true
      })
    }

    for (const el of this.$$('[data-option]')) {
      const option = el.dataset.option
      this.listen(el, 'click', () => {
        store.update('options', (o) => {
          const next = { ...o, [option]: !o[option] }
          if (next[option] && EXCLUSIVE[option]) next[EXCLUSIVE[option]] = false
          return next
        })
        if (RESET_OPTIONS.has(option)) this.#needsReset = true
      })
    }

    this.watch(
      (s) => s.options,
      (options) => {
        for (const el of this.$$('[data-gen]')) {
          el.on = options.activeGens.includes(Number(el.dataset.gen))
          el.toggleAttribute('disabled', options.activeGens.length === 1)
        }
        for (const el of this.$$('[data-option]')) el.on = options[el.dataset.option]
      }
    )

    this.watch(
      (s) => s.ui.gameOptionsOpen,
      (open) => {
        layer.open = open
        trigger.toggleAttribute('active', open)
      }
    )
    this.watch(
      (s) => s.ui.menuOpen || s.ui.supportOpen,
      (hide) => trigger.toggleAttribute('hidden-away', hide)
    )
  }

  disconnected() {
    if (store.state.ui.gameOptionsOpen) store.update('ui', { gameOptionsOpen: false })
  }

  #toggleLayer() {
    if (!store.state.ui.gameOptionsOpen) {
      store.update('ui', { gameOptionsOpen: true })
      return
    }
    if (!this.#needsReset) {
      store.update('ui', { gameOptionsOpen: false })
      return
    }
    // Show "saving…", start a new round with the new options, then close.
    const content = this.$('.layer')
    content.classList.add('resetting')
    game.quickReset()
    this.#needsReset = false
    this.later(() => {
      store.update('ui', { gameOptionsOpen: false })
      this.later(() => content.classList.remove('resetting'), LAYER_TRANSITION_MS)
    }, LAYER_TRANSITION_MS)
  }
}

define('pg-game-options', PgGameOptions)
