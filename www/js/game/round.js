/**
 * Round controller: the only place that combines rules, state, sounds and timing.
 * Components call its methods; they never mutate game state themselves.
 *
 * Timings mirror the previous version:
 *   win  -> cry after 500 ms, celebration + reset after 4200 ms
 *   flee -> reset after 1000 ms
 *   reset(delay=true) waits 2000 ms, then the reset curtain runs for 2500 ms and the new
 *   Pokémon appears after its first 1000 ms. Timer mode restarts 3000 ms after a reset.
 */
import { store } from '../core/state.js'
import { play, playCry } from '../core/audio.js'
import { getName, getTypes, specialOf } from './pokedex-data.js'
import {
  applyGuess,
  applyHint,
  createRound,
  finishRound,
  isLost,
  isWon,
  pickPokemon,
  randomInt
} from './rules.js'
import { recordCatch, recordFlee } from './player.js'

export const TIMER_SECONDS = 20

class RoundController {
  #timers = new Set()
  #countdown = null
  #busy = false
  #attached = false
  #feedbackSeq = 0

  get #options() {
    return store.state.options
  }

  #later(fn, ms) {
    const id = setTimeout(() => {
      this.#timers.delete(id)
      fn()
    }, ms)
    this.#timers.add(id)
  }

  #feedback(kind, extra = {}) {
    store.update('game', { feedback: kind ? { kind, ...extra, seq: ++this.#feedbackSeq } : null })
  }

  /** Picks a new Pokémon and starts a fresh round (no animation). */
  newRound() {
    const { options, player, settings } = store.state
    const pick = pickPokemon({
      activeGens: options.activeGens,
      excludeCaught: options.excludeGuessedPokemon,
      caughtIds: player.pokemonCaughtId
    })

    if (!pick) {
      store.update('round', () => null)
      store.update('game', { noPokemon: true, celebrate: false, feedback: null })
      return
    }

    const round = createRound(
      {
        id: pick.id,
        name: getName(pick.id, settings.language),
        types: getTypes(pick.id),
        special: specialOf(pick.id),
        alreadyCaught: pick.alreadyCaught
      },
      options
    )

    store.update('round', () => round)
    store.update('game', { noPokemon: false, celebrate: false, feedback: null })
  }

  /** Called when the guess view is shown. */
  attach() {
    this.#attached = true
    if (!store.state.round && !store.state.game.noPokemon) this.newRound()
    if (this.#options.timerMode && !this.#busy && store.state.round?.phase === 'playing') {
      this.#startCountdown()
    }
  }

  /** Called when the guess view is hidden: the countdown pauses (and restarts on attach). */
  detach() {
    this.#attached = false
    this.#stopCountdown()
  }

  guess(key) {
    const round = store.state.round
    if (!round || this.#busy) return

    const { round: next, result } = applyGuess(round, key, this.#options)
    if (result === 'ignored') return
    if (result === 'duplicate') {
      play('guessWrong')
      this.#feedback('duplicate')
      return
    }

    store.update('round', () => next)
    if (result === 'hit') {
      play('guess')
      this.#feedback('right', { n: randomInt(0, 2) })
    } else {
      play('guessWrong')
      this.#feedback('wrong', { n: randomInt(0, 2) })
    }
    this.#settle(next)
  }

  hint(index) {
    const round = store.state.round
    if (!round || this.#busy) return
    const next = applyHint(round, index, this.#options)
    if (!next) return
    play('guess')
    store.update('round', () => next)
    this.#settle(next)
  }

  skip() {
    if (this.#busy) return
    play('flee')
    this.reset(false)
  }

  #settle(round) {
    if (isWon(round)) this.#win(round)
    else if (isLost(round)) this.#flee(round)
  }

  #win(round) {
    const done = finishRound(round)
    this.#busy = true
    this.#stopCountdown()
    store.update('round', () => done)
    this.#feedback(done.wrong === 0 ? 'perfect' : 'win', { id: done.pokeId })
    store.update('player', (p) =>
      recordCatch(p, {
        id: done.pokeId,
        gen: done.gen,
        special: done.special,
        perfect: done.wrong === 0
      })
    )
    this.#later(() => playCry(done.pokeId), 500)
    this.#later(() => {
      play('reset')
      store.update('game', { celebrate: true })
      this.reset()
    }, 4200)
  }

  #flee(round) {
    const done = finishRound(round, this.#options)
    this.#busy = true
    this.#stopCountdown()
    store.update('round', () => done)
    if (done.phase === 'fled') {
      this.#feedback('fail')
      this.#later(() => playCry(done.pokeId), 500)
    } else {
      this.#feedback('failReveal', { id: done.pokeId })
    }
    store.update('player', (p) => recordFlee(p, { id: done.pokeId }))
    this.#later(() => {
      play('reset')
      this.reset()
    }, 1000)
  }

  /** Animated reset to a new Pokémon. */
  reset(initialDelay = true) {
    this.#busy = true
    this.#stopCountdown()
    store.update('game', { counter: TIMER_SECONDS })

    const run = () => {
      play('maximize')
      store.update('game', { resetting: true })
      this.#later(() => {
        this.newRound()
        this.#later(() => play('minimize'), 500)
        this.#later(() => {
          store.update('game', { resetting: false })
          this.#busy = false
        }, 1500)
      }, 1000)
    }

    if (initialDelay) this.#later(run, 2000)
    else run()

    if (this.#options.timerMode) this.#later(() => this.#startCountdown(), 3000)
  }

  /** Immediate reset without animation, e.g. after changing generations in the options. */
  quickReset() {
    for (const id of this.#timers) clearTimeout(id)
    this.#timers.clear()
    this.#stopCountdown()
    this.#busy = false
    store.update('game', { resetting: false, counter: TIMER_SECONDS })
    this.newRound()
    if (this.#options.timerMode) this.#startCountdown()
  }

  #startCountdown() {
    this.#stopCountdown()
    if (!this.#attached || !this.#options.timerMode) return
    store.update('game', { counter: TIMER_SECONDS })
    const tick = () => {
      const counter = store.state.game.counter
      if (counter <= 0) {
        this.#countdown = null
        this.reset(false)
        return
      }
      store.update('game', { counter: counter - 1 })
      this.#countdown = setTimeout(tick, 1000)
    }
    tick()
  }

  #stopCountdown() {
    clearTimeout(this.#countdown)
    this.#countdown = null
  }
}

export const game = new RoundController()
