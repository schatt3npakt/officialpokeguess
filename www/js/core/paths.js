/**
 * All URLs are resolved relative to the deploy root (www/), so the app works from any
 * sub-path on a static host.
 */
const ROOT = new URL('../../', import.meta.url)

export const url = (path) => new URL(path, ROOT).href
export const asset = (path) => url(`assets/${path}`)
export const dataUrl = (file) => url(`data/${file}`)

export const pokemonImage = (id) => asset(`pokemon/${id}.webp`)
export const pokemonIcon = (id) => asset(`pokemon/icons/${id}.webp`)
export const pokemonCry = (id) => asset(`pokemon/sounds/${id}.mp3`)
export const sfxUrl = (file) => asset(`sfx/${file}`)
