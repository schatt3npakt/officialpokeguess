import { dataUrl } from '../core/paths.js'

/** Highest Pokédex number that has a cry file in assets/pokemon/sounds/. */
export const MAX_CRY_ID = 889

let pokemon = {}
let legendary = {}
let mythical = {}

/** Loads the static Pokémon data once (cached by the service worker afterwards). */
export async function loadPokedex() {
  const load = (file) =>
    fetch(dataUrl(file)).then((r) => {
      if (!r.ok) throw new Error(`Failed to load ${file}: ${r.status}`)
      return r.json()
    })
  ;[pokemon, legendary, mythical] = await Promise.all([
    load('pokemon.json'),
    load('legendary.json'),
    load('mythical.json')
  ])
}

export const getName = (id, lang) => pokemon[id]?.name[lang] ?? pokemon[id]?.name.en ?? ''
export const getTypes = (id) => pokemon[id]?.types ?? []
export const hasCry = (id) => id >= 1 && id <= MAX_CRY_ID

export function specialOf(id) {
  if (legendary[id]) return 'legendary'
  if (mythical[id]) return 'mythical'
  return false
}

export const formatNumber = (id) => String(id).padStart(3, '0')

/** DD.MM.YYYY for German, MM.DD.YYYY otherwise (as before), plus HH:MM. */
export function formatDate(timestamp, lang) {
  const d = new Date(timestamp)
  const pad = (n) => String(n).padStart(2, '0')
  const date =
    lang === 'de'
      ? `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
      : `${pad(d.getMonth() + 1)}.${pad(d.getDate())}.${d.getFullYear()}`
  return `${date}, ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
