/**
 * Sound playback without dependencies (replaces howler).
 * Short effects are decoded once into Web Audio buffers for low latency; Pokémon cries are
 * streamed through <audio>. Nothing plays while audio is disabled (the default).
 */
import { sfxUrl, pokemonCry } from './paths.js'
import { hasCry } from '../game/pokedex-data.js'

const SFX = {
  toggleOn: 'toggleOn.ogg',
  toggleOff: 'toggleOff.ogg',
  rollover: 'rollover.ogg',
  typing: 'typing.ogg',
  confirm: 'confirm.ogg',
  minimize: 'minimize.ogg',
  maximize: 'maximize.ogg',
  flee: 'flee.wav',
  guess: 'guess.ogg',
  guessWrong: 'guess-wrong.ogg',
  reset: 'reset.ogg'
}

const VOLUME = 0.5

let enabled = false
let ctx = null
let gain = null
/** name -> Promise<AudioBuffer|null> (null = decoding unsupported, fall back to <audio>) */
const buffers = new Map()

function context() {
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return null
    ctx = new Ctx()
    gain = ctx.createGain()
    gain.gain.value = VOLUME
    gain.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

function load(name) {
  if (!buffers.has(name)) {
    const promise = fetch(sfxUrl(SFX[name]))
      .then((r) => r.arrayBuffer())
      .then((data) => context()?.decodeAudioData(data) ?? null)
      .catch(() => null)
    buffers.set(name, promise)
  }
  return buffers.get(name)
}

function playElement(src) {
  const el = new Audio(src)
  el.volume = VOLUME
  el.play().catch(() => {})
}

/** Must be called from a user gesture at least once (browser autoplay policies). */
export function unlockAudio() {
  if (enabled) context()
}

export function setAudioEnabled(value) {
  enabled = Boolean(value)
  if (enabled) {
    context()
    for (const name of Object.keys(SFX)) load(name)
  }
}

/** @param {keyof SFX} name */
export function play(name) {
  if (!enabled || !SFX[name]) return
  load(name).then((buffer) => {
    if (!enabled) return
    if (!buffer || !ctx) {
      playElement(sfxUrl(SFX[name]))
      return
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.connect(gain)
    source.start()
  })
}

export function playCry(id) {
  if (!enabled || !hasCry(id)) return
  playElement(pokemonCry(id))
}
