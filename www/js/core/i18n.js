import { dataUrl } from './paths.js'
import { store } from './state.js'

export const LANGUAGES = Object.freeze(['en', 'de', 'fr'])

let dictionary = {}

export async function loadI18n() {
  const res = await fetch(dataUrl('i18n.json'))
  if (!res.ok) throw new Error(`Failed to load i18n.json: ${res.status}`)
  dictionary = await res.json()
}

/**
 * Translates a dotted path like "Guess.types.feuer" into the current (or given) language.
 * Entries are objects of the form { en, de, fr }. Missing entries return the path itself.
 */
export function t(path, lang = store.state.settings.language) {
  let node = dictionary
  for (const part of path.split('.')) {
    node = node?.[part]
    if (node === undefined) return path
  }
  return node[lang] ?? node.en ?? path
}
