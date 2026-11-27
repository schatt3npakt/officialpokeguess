import { BaseElement, define } from '../../core/base-element.js'
import { css, html } from '../../core/css.js'
import { store } from '../../core/state.js'
import { t } from '../../core/i18n.js'
import { pokemonImage } from '../../core/paths.js'
import { GENS, idsOfGen } from '../../game/gens.js'
import { formatDate, formatNumber, getName, getTypes } from '../../game/pokedex-data.js'
import { catchSummary } from '../../game/player.js'
import { icons } from '../icons.js'
import { TYPE_COLORS, createEntry, entryStyles } from './entry.js'
import '../pg-collapsible.js'
import '../pg-layer.js'
import '../pg-layer-trigger.js'
import '../pg-toggle.js'

const MIN_QUERY = 3

/** Pokédex: detail panel plus a searchable list grouped by generation. */
class PgPokedexView extends BaseElement {
  static template = html`
    <div class="pokedex">
      <div class="detail">
        <img class="pokeimage" alt="" decoding="async" width="300" height="300" />
        <div class="first-row">
          <div class="info">
            <p class="number"></p>
            <p class="name"></p>
            <p class="caught-at" hidden>
              <br /><span data-i18n="Pokedex.lastCaught"></span><br /><span class="time"></span>
            </p>
          </div>
          <div class="types"></div>
        </div>
      </div>

      <pg-layer-trigger class="search-bubble">${icons.magnifier}</pg-layer-trigger>

      <pg-layer class="search-layer" direction="ltr" mobile-only>
        <div class="list">
          <div class="controls">
            <pg-toggle class="find-uncaught" data-i18n-label="Pokedex.findUncaught"></pg-toggle>
            <form class="searchbar-container" role="search">
              <input
                class="searchbar"
                type="search"
                enterkeyhint="search"
                data-i18n-placeholder="Pokedex.placeholder"
              />
              <button type="button" class="reset-button" aria-label="Reset">x</button>
              <button type="submit" class="search-button" data-i18n="Pokedex.search"></button>
            </form>
          </div>
          <div class="list-inner">
            ${GENS.map((g) => `<pg-collapsible show-on-desktop heading="Gen ${g.id}" data-gen="${g.id}"></pg-collapsible>`).join('')}
          </div>
        </div>
      </pg-layer>
    </div>
  `

  static styles = [
    entryStyles,
    css`
      :host {
        display: block;
        overflow: auto;
      }

      .pokedex {
        padding: 20px;

        @media (min-width: 720px) {
          display: grid;
          grid-template-columns: 4fr 3fr;
        }
      }

      .search-bubble {
        left: 15px;
        right: auto;

        @media (min-width: 720px) {
          display: none;
        }
      }

      .detail {
        color: var(--theme-color);
        margin-top: 5px;
        min-height: 300px;
        padding: 20px;

        @media (min-width: 720px) {
          padding: 0 40px;
        }

        p {
          margin: 0;
        }
      }

      .first-row {
        display: flex;
        justify-content: space-between;
        align-content: flex-start;
        margin-bottom: 10px;
      }

      .types {
        text-align: right;
        filter: var(--gb-filter);

        span {
          font-size: 14px;
          color: var(--contrast-color);
          display: inline-block;
          padding: 2px 5px;
          border-radius: 5px;
          margin-bottom: 5px;
        }
      }

      .pokeimage {
        display: block;
        margin: auto;
        max-width: 150px;
        width: 100%;
        height: auto;
        object-fit: contain;
        mix-blend-mode: var(--img-blend);
        filter: brightness(0) drop-shadow(1px 0 0 var(--theme-color)) drop-shadow(-1px 0 0 var(--theme-color))
          drop-shadow(0 1px 0 var(--theme-color)) drop-shadow(0 -1px 0 var(--theme-color));

        @media (min-width: 720px) {
          height: 300px;
          width: 300px;
          max-width: none;
          padding: 10px;
        }

        .caught & {
          filter: brightness(1) drop-shadow(1px 0 0 var(--theme-color))
            drop-shadow(-1px 0 0 var(--theme-color)) drop-shadow(0 1px 0 var(--theme-color))
            drop-shadow(0 -1px 0 var(--theme-color));
        }
      }

      .find-uncaught {
        margin-bottom: 10px;
      }

      .searchbar-container {
        display: flex;
        position: relative;
        margin: 0;
      }

      .searchbar {
        font-size: 14px;
        border: 2px solid var(--theme-color);
        border-radius: 10px 0 0 10px;
        background-color: transparent;
        color: var(--theme-color);
        height: 50px;
        width: 100%;
        padding: 0 40px 0 15px;
        appearance: none;

        &::placeholder {
          color: var(--theme-color);
          opacity: 1;
        }

        &::-webkit-search-cancel-button {
          display: none;
        }
      }

      .search-button {
        font-size: 14px;
        background-color: var(--theme-color);
        border-radius: 0 10px 10px 0;
        color: var(--contrast-color);
        padding: 0 15px;
        cursor: pointer;
        border: 2px solid var(--theme-color);
      }

      .reset-button {
        position: absolute;
        right: 90px;
        top: 50%;
        transform: translateY(-50%) scale(0);
        background-color: transparent;
        border: none;
        color: var(--theme-color);
        font-size: 25px;
        transition: transform 0.25s ease-in-out;
        cursor: pointer;

        &.show {
          transform: translateY(-50%) scale(1);
        }
      }

      .list-inner {
        color: var(--theme-color);
        width: 100%;
        padding-right: 5px;
        max-height: calc(100vh - 200px);
        overflow: auto;

        @media (min-width: 720px) {
          margin-top: 20px;
          max-height: calc(100vh - 280px);
        }
      }
    `
  ]

  #activeId = 1
  #query = ''
  #findUncaught = false
  #summary = new Map()

  connected() {
    const layer = this.$('pg-layer')
    const trigger = this.$('.search-bubble')
    const input = this.$('.searchbar')
    const toggle = this.$('.find-uncaught')

    this.listen(trigger, 'click', () => this.#setLayerOpen(!layer.open))

    this.listen(this.$('form'), 'submit', (event) => {
      event.preventDefault()
      this.#search(input.value)
    })
    this.listen(input, 'change', () => this.#search(input.value))
    this.listen(input, 'input', () =>
      this.$('.reset-button').classList.toggle('show', input.value.length > 0)
    )
    this.listen(this.$('.reset-button'), 'click', () => {
      input.value = ''
      this.$('.reset-button').classList.remove('show')
      this.#search('')
    })
    this.listen(toggle, 'click', () => {
      this.#findUncaught = !this.#findUncaught
      toggle.on = this.#findUncaught
      this.#search(input.value)
    })

    this.listen(this.$('.list-inner'), 'click', (event) => {
      const entry = event.target.closest('.entry')
      if (!entry) return
      this.#select(Number(entry.dataset.id))
      if (layer.open) this.later(() => this.#setLayerOpen(false), 500)
    })

    this.watch(
      (s) => [s.player, s.settings.language],
      ([player, lang]) => {
        this.#summary = catchSummary(player)
        this.#renderList(lang)
        this.#renderDetail()
      }
    )
  }

  #setLayerOpen(open) {
    this.$('pg-layer').open = open
    this.$('.search-bubble').toggleAttribute('active', open)
  }

  #renderList(lang) {
    for (const section of this.$$('pg-collapsible[data-gen]')) {
      const fragment = document.createDocumentFragment()
      for (const id of idsOfGen(Number(section.dataset.gen))) {
        const entry = createEntry(id, this.#summary.get(id), lang)
        entry.dataset.title = getName(id, lang).toLowerCase()
        entry.classList.toggle('active', id === this.#activeId)
        fragment.append(entry)
      }
      section.replaceChildren(fragment)
    }
    this.#applyFilter()
  }

  #search(query) {
    this.#query = query.trim().toLowerCase()
    this.#applyFilter(true)
  }

  /** Filters the in-memory list; short queries show everything collapsed (as before). */
  #applyFilter(fromSearch = false) {
    const active = this.#query.length >= MIN_QUERY
    for (const section of this.$$('pg-collapsible[data-gen]')) {
      let visible = 0
      for (const entry of section.children) {
        const show =
          !active ||
          (entry.dataset.title.includes(this.#query) &&
            (this.#findUncaught || entry.classList.contains('caught')))
        entry.hidden = !show
        if (show) visible++
      }
      section.hidden = active && visible === 0
      if (fromSearch) section.toggleAttribute('open', active && visible > 0)
    }
  }

  #select(id) {
    this.#activeId = id
    for (const entry of this.$$('.entry')) entry.classList.toggle('active', Number(entry.dataset.id) === id)
    this.#renderDetail()
  }

  #renderDetail() {
    const id = this.#activeId
    const lang = store.state.settings.language
    const caught = this.#summary.get(id)
    this.$('.detail').classList.toggle('caught', Boolean(caught))
    this.$('.pokeimage').src = pokemonImage(id)
    this.$('.number').textContent = `#${formatNumber(id)}`
    this.$('.name').textContent = caught ? getName(id, lang) : '???'
    this.$('.caught-at').hidden = !caught
    this.$('.time').textContent = caught ? formatDate(caught.timeStamp, lang) : ''
    this.$('.types').replaceChildren(
      ...(caught ? getTypes(id) : []).map((type) => {
        const span = document.createElement('span')
        span.textContent = t(`Guess.types.${type}`, lang)
        span.style.backgroundColor = `var(--type-color-${TYPE_COLORS[type] ?? 'normal'})`
        const wrap = document.createElement('div')
        wrap.append(span)
        return wrap
      })
    )
  }
}

define('pg-pokedex-view', PgPokedexView)
