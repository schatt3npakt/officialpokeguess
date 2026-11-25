import { css } from '../../core/css.js'
import { t } from '../../core/i18n.js'
import { pokemonIcon } from '../../core/paths.js'
import { formatDate, formatNumber, getName } from '../../game/pokedex-data.js'

/** CSS variable suffix per (German) type key. */
export const TYPE_COLORS = Object.freeze({
  normal: 'normal',
  kampf: 'fighting',
  flug: 'flying',
  gift: 'poison',
  boden: 'ground',
  gestein: 'rock',
  käfer: 'bug',
  geist: 'ghost',
  stahl: 'steel',
  feuer: 'fire',
  wasser: 'water',
  pflanze: 'grass',
  elektro: 'electric',
  psycho: 'psychic',
  eis: 'ice',
  drache: 'dragon',
  unlicht: 'dark',
  fee: 'fairy'
})

const outline = (color) =>
  `drop-shadow(1px 0 0 ${color}) drop-shadow(-1px 0 0 ${color}) drop-shadow(0 1px 0 ${color}) drop-shadow(0 -1px 0 ${color})`

export const entryStyles = css`
  .entry {
    all: unset;
    box-sizing: border-box;
    display: flex;
    cursor: pointer;
    width: 100%;
    border: 3px solid var(--theme-color);
    padding: 10px;
    border-radius: 10px;
    font-size: 13px;
    margin-bottom: 15px;
    color: var(--theme-color);
    transition: background-color 0.25s ease-in-out;
    content-visibility: auto;
    contain-intrinsic-size: auto 76px;

    @media (min-width: 720px) {
      font-size: 16px;
    }

    &.active {
      background-color: rgba(0, 0, 0, 0.25);
    }

    &.perfect {
      border-color: var(--perfect-color);
      color: var(--perfect-color);
    }

    &:focus-visible {
      outline: 2px solid var(--theme-color);
      outline-offset: 2px;
    }
  }

  .thumb {
    display: inline-block;
    margin-right: 25px;
    width: 50px;
    height: 50px;
    object-fit: contain;
    flex-shrink: 0;
    filter: brightness(0) ${outline('var(--theme-color)')};
    mix-blend-mode: var(--img-blend);

    @media (min-width: 720px) {
      width: 100px;
    }

    .caught & {
      filter: brightness(1) ${outline('var(--theme-color)')};
    }

    .perfect & {
      filter: brightness(1) ${outline('var(--perfect-color)')};
    }
  }

  .info {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    width: 100%;
  }

  .top,
  .bottom {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 10px;
  }

  .bottom {
    font-size: 14px;
  }
`

/**
 * Builds one Pokédex list entry.
 * @param {number} id
 * @param {{timeStamp:number, isPerfect:boolean}|undefined} caught
 * @param {string} lang
 */
export function createEntry(id, caught, lang) {
  const entry = document.createElement('button')
  entry.type = 'button'
  entry.className = 'entry'
  entry.dataset.id = id
  entry.classList.toggle('caught', Boolean(caught))
  entry.classList.toggle('perfect', Boolean(caught?.isPerfect))

  const img = document.createElement('img')
  img.className = 'thumb'
  img.loading = 'lazy'
  img.decoding = 'async'
  img.width = 50
  img.height = 50
  img.alt = ''
  img.src = pokemonIcon(id)
  img.addEventListener(
    'error',
    () => {
      img.style.visibility = 'hidden'
    },
    { once: true }
  )

  const info = document.createElement('span')
  info.className = 'info'
  const top = document.createElement('span')
  top.className = 'top'
  const number = document.createElement('span')
  number.textContent = `#${formatNumber(id)}`
  const name = document.createElement('span')
  name.textContent = caught ? getName(id, lang) : '???'
  top.append(number, name)

  const bottom = document.createElement('span')
  bottom.className = 'bottom'
  if (caught) {
    const when = document.createElement('span')
    when.append(
      t('Pokedex.lastCaught', lang),
      document.createElement('br'),
      formatDate(caught.timeStamp, lang)
    )
    bottom.append(when)
  }
  if (caught?.isPerfect) {
    const perfect = document.createElement('span')
    perfect.textContent = t('Pokedex.perfect', lang)
    bottom.append(perfect)
  }

  info.append(top, bottom)
  entry.append(img, info)
  return entry
}
