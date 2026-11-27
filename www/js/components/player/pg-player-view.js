import { BaseElement, define } from '../../core/base-element.js'
import { css, html } from '../../core/css.js'
import { store } from '../../core/state.js'
import { t } from '../../core/i18n.js'
import { emptyPlayer } from '../../core/persist.js'
import { getName } from '../../game/pokedex-data.js'
import { stats } from '../../game/player.js'
import '../pg-collapsible.js'

const ROWS = [
  ['lastCaughtPokemon', 'last'],
  ['pokemonSeen', 'seen'],
  ['pokemonCaught', 'caught'],
  ['pokemonPerfectlyCaught', 'perfect'],
  ['legendaryPokemonCaught', 'legendary'],
  ['mythicalPokemonCaught', 'mythical'],
  ['pokemonStreak', 'streak']
]

/** Collector profile: statistics and resetting the saved progress. */
class PgPlayerView extends BaseElement {
  static template = html`
    <div class="player-data">
      <div class="inner">
        <pg-collapsible class="stats">
          <table>
            ${ROWS.map(([label, key]) => `<tr><td data-i18n="PlayerData.${label}"></td><td data-stat="${key}"></td></tr>`).join('')}
          </table>
        </pg-collapsible>
      </div>

      <button type="button" class="button reset" data-i18n="PlayerData.resetData"></button>

      <div class="reset-notice" hidden>
        <p data-i18n="PlayerData.resetDataQuestion"></p>
        <button type="button" class="button confirm" data-i18n="PlayerData.reallyResetData"></button>
      </div>
    </div>
  `

  static styles = [
    css`
      :host {
        display: block;
        overflow: auto;
      }

      .player-data {
        padding: 20px;
      }

      .inner {
        max-width: 400px;
        margin: auto;
      }

      table {
        border-collapse: collapse;
        color: var(--theme-color);
        width: 100%;
      }

      td {
        font-size: 18px;
        padding: 10px;

        &:last-child {
          text-align: center;
        }
      }

      .button {
        display: block;
        cursor: pointer;
        background-color: var(--theme-color);
        border: none;
        border-radius: 15px;
        color: var(--contrast-color);
        font-size: 18px;
        padding: 15px;
        width: 100%;
        max-width: 480px;
        margin: 20px auto 0 auto;
      }

      .reset-notice {
        color: var(--theme-color);
        width: 100%;
        max-width: 400px;
        margin: auto;
        padding-top: 20px;
      }
    `
  ]

  connected() {
    this.listen(this.$('.reset'), 'click', () => {
      this.$('.reset-notice').hidden = false
    })
    this.listen(this.$('.confirm'), 'click', () => {
      store.update('player', () => emptyPlayer())
      this.$('.reset-notice').hidden = true
    })
    this.watch(
      (s) => [s.player, s.settings.language],
      ([player]) => this.#render(player)
    )
  }

  translate() {
    super.translate()
    this.$('.stats').setAttribute('heading', t('PlayerData.collectorStatistic'))
  }

  #render(player) {
    const s = stats(player)
    const values = {
      ...s,
      last: s.lastCaughtId
        ? getName(s.lastCaughtId, store.state.settings.language)
        : t('PlayerData.noPokemonCaught')
    }
    for (const cell of this.$$('[data-stat]')) cell.textContent = values[cell.dataset.stat]
  }
}

define('pg-player-view', PgPlayerView)
