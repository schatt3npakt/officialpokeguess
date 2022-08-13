const pokemon = require('../data/pokemon')
const legendaryPokemon = require('../data/legendaryPokemon.json')
const mythicalPokemon = require('../data/mythicalPokemon.json')

const guessModule = {
  state: () => ({
    playerInfo: {
      badgeProgress: getPlayerProperty('badgeProgress') || [],
      catchingStreak: getPlayerProperty('catchingStreak') || [],
      legendaryPokemonCaught: getPlayerProperty('legendaryPokemonCaught') || [],
      mythicalPokemonCaught: getPlayerProperty('mythicalPokemonCaught') || [],
      pokemonCaught: getPlayerProperty('pokemonCaught') || [],
      pokemonCaughtId: getPlayerProperty('pokemonCaughtId') || [],
      pokemonMet: getPlayerProperty('pokemonMet') || []
    },
    gameOptions: {
      activeGens: [
        1, 2, 3, 4, 5, 6, 7, 8
      ],
      excludeGuessedPokemon: true,
      maxHints: 3,
      maxWrongGuesses: 6,
      hintsAllowed: true,
      showPokeImage: true,
      revealCaught: true,
      showGenHint: true,
      showIndexHint: true,
      showTypeHint: true,
      showStreak: true,
      useAlphabeticalKeyboard: false,
      infiniteGuesses: false,
      oneGuessOnly: false,
      showPartOfImage: false,
      imagePartFilter: 0,
      showPokemonOnFlee: false
    },
    gameState: {
      firstPokemonLoaded: false,
      availablePokemon: 0,
      noPokemonAvailable: false,
      currentGen: 0,
      guesses: 0,
      guessFeedback: '',
      guessedLetters: [],
      hintsUsed: 0,
      pokeId: 0,
      pokeName: '',
      specialPokemon: false,
      wrongGuesses: 0,
      types: [],
      pokemonAlreadyCaught: false
    },
    gens: [
      {
        id: 1, start: 1, end: 151
      },
      {
        id: 2, start: 152, end: 251
      },
      {
        id: 3, start: 252, end: 386
      },
      {
        id: 4, start: 387, end: 493
      },
      {
        id: 5, start: 494, end: 649
      },
      {
        id: 6, start: 650, end: 721
      },
      {
        id: 7, start: 722, end: 809
      },
      {
        id: 8, start: 810, end: 905
      }
    ],
    types: [
      { name: 'normal', url: 'https://pokeapi.co/api/v2/type/1/' },
      { name: 'kampf', url: 'https://pokeapi.co/api/v2/type/2/' },
      { name: 'flug', url: 'https://pokeapi.co/api/v2/type/3/' },
      { name: 'gift', url: 'https://pokeapi.co/api/v2/type/4/' },
      { name: 'boden', url: 'https://pokeapi.co/api/v2/type/5/' },
      { name: 'gestein', url: 'https://pokeapi.co/api/v2/type/6/' },
      { name: 'käfer', url: 'https://pokeapi.co/api/v2/type/7/' },
      { name: 'geist', url: 'https://pokeapi.co/api/v2/type/8/' },
      { name: 'stahl', url: 'https://pokeapi.co/api/v2/type/9/' },
      { name: 'feuer', url: 'https://pokeapi.co/api/v2/type/10/' },
      { name: 'wasser', url: 'https://pokeapi.co/api/v2/type/11/' },
      { name: 'pflanze', url: 'https://pokeapi.co/api/v2/type/12/' },
      { name: 'elektro', url: 'https://pokeapi.co/api/v2/type/13/' },
      { name: 'psycho', url: 'https://pokeapi.co/api/v2/type/14/' },
      { name: 'eis', url: 'https://pokeapi.co/api/v2/type/15/' },
      { name: 'drache', url: 'https://pokeapi.co/api/v2/type/16/' },
      { name: 'unlicht', url: 'https://pokeapi.co/api/v2/type/17/' },
      { name: 'fee', url: 'https://pokeapi.co/api/v2/type/18/' },
      { name: 'unbekannt', url: 'https://pokeapi.co/api/v2/type/10001/' },
      { name: 'schatten', url: 'https://pokeapi.co/api/v2/type/10002/' }
    ],
    keyboards: {
      alphabetical: [
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
        ['k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'],
        ['t', 'u', 'v', 'w', 'x', 'y', 'z']
      ],
      qwertz: [
        ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['y', 'x', 'c', 'v', 'b', 'n', 'm']
      ],
      qwerty: [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm']
      ]
    }
  }),

  mutations: {
    getRandomPokemon (state) {
      getRandomPokemon(state)
      state.gameState.firstPokemonLoaded = true
    },
    setPlayerProperty (state, { propertyKey, propertyValue }) {
      setPlayerProperty(state, { property: propertyKey, value: propertyValue })
    },
    resetPokemon (state, initialDelay = true) {
      const wrapper = document.querySelector('.guess__wrapper')
      const pokeimage = document.querySelector('.pokeimage')
      const letters = document.querySelectorAll('.letter')
      const keys = document.querySelectorAll('.key')
      const pokeBallOverlay = document.querySelector('.pokeball-overlay')
      const gameState = state.gameState

      const resetPokemonAction = () => {
        if (wrapper) {
          wrapper.classList.add('resetting')

          window.setTimeout(() => {
            getRandomPokemon(state)
            pokeimage.classList.remove('reveal')
            pokeimage.classList.remove('flee')
            pokeimage.classList.remove('flee-reveal')
            gameState.guesses = 0
            gameState.wrongGuesses = 0
            gameState.guessedLetters = []
            pokeBallOverlay.classList.remove('revealed')

            for (const item of keys) {
              item.classList.remove('disabled')
              item.classList.remove('false')
            }

            for (const item of letters) {
              item.classList.remove('reveal')
            }

            gameState.guessFeedback = ''

            window.setTimeout(() => {
              wrapper.classList.remove('resetting')
            }, 1500)
          }, 1000)
        }
      }

      if (initialDelay === false) {
        resetPokemonAction()
      } else {
        window.setTimeout(() => {
          resetPokemonAction()
        }, 2000)
      }
    },
    genToggleReset (state) {
      const pokeimage = document.querySelector('.pokeimage')
      const letters = document.querySelectorAll('.letter')
      const keys = document.querySelectorAll('.key')
      const pokeBallOverlay = document.querySelector('.pokeball-overlay')
      const gameState = state.gameState

      getRandomPokemon(state)
      pokeimage.classList.remove('reveal')
      pokeimage.classList.remove('flee')
      gameState.guesses = 0
      gameState.wrongGuesses = 0
      gameState.guessedLetters = []
      pokeBallOverlay.classList.remove('revealed')

      for (const item of keys) {
        item.classList.remove('disabled')
        item.classList.remove('false')
      }

      for (const item of letters) {
        item.classList.remove('reveal')
      }

      gameState.guessFeedback = ''
    },
    resetPlayerData (state) {
      for (const prop in state.playerInfo) {
        state.playerInfo[prop] = []
        localStorage.setItem(prop, JSON.stringify(state.playerInfo[prop]))
      }
    }
  }
}

function getPlayerProperty (property) {
  return JSON.parse(localStorage.getItem(property))
}

function setPlayerProperty (state, { property, value }) {
  state.playerInfo[property].push(value)
  localStorage.setItem(property, JSON.stringify(state.playerInfo[property]))
}

function getRandomPokemon (state) {
  const currentInt = getRandomPokemonInt(state)
  const gameState = state.gameState
  const gameOptions = state.gameOptions
  const playerInfo = state.playerInfo
  const lang = localStorage.getItem('language') || 'de'

  gameState.noPokemonAvailable = false
  let availablePokemon = 0
  gameState.availablePokemon = availablePokemon

  // calculate all available pokemon
  for (const gen of state.gameOptions.activeGens) {
    const pokemonForGen = state.gens[gen - 1].end - (state.gens[gen - 1].start - 1)
    availablePokemon += pokemonForGen
  }

  gameState.availablePokemon = availablePokemon

  if (availablePokemon === playerInfo.pokemonCaughtId) {
    state.gameState.noPokemonAvailable = true
    return
  }

  gameState.pokemonAlreadyCaught = false
  if (playerInfo.pokemonCaught.filter(obj => obj.id === currentInt).length >= 1) {
    if (state.gameOptions.excludeGuessedPokemon) {
      getRandomPokemon(state)
      return
    } else {
      gameState.pokemonAlreadyCaught = true
    }
  }

  gameState.pokeId = currentInt
  gameState.pokeName = pokemon[gameState.pokeId].name[lang].toLowerCase()

  if (legendaryPokemon[currentInt]) {
    gameState.specialPokemon = 'legendary'
    gameOptions.maxWrongGuesses = 3
    gameOptions.maxHints = 1
  } else if (mythicalPokemon[currentInt]) {
    gameState.specialPokemon = 'mythical'
    gameOptions.maxWrongGuesses = 3
    gameOptions.maxHints = 0
  } else {
    gameState.specialPokemon = false
    gameOptions.maxWrongGuesses = 6
    gameOptions.maxHints = 3
  }

  if (gameOptions.oneGuessOnly) {
    gameOptions.maxWrongGuesses = 1
  }

  gameOptions.imagePartFilter = getRandomInt(0, 3)

  for (const gen of state.gens) {
    if (currentInt >= gen.start && currentInt <= gen.end) {
      gameState.currentGen = gen.id
    }
  }

  state.gameState.types = pokemon[state.gameState.pokeId].types
}

function getRandomPokemonInt (state) {
  const genKeyInt = getRandomInt(1, state.gameOptions.activeGens.length)
  const randomGenKey = state.gameOptions.activeGens[genKeyInt - 1]
  const randomGen = state.gens[randomGenKey - 1]

  return getRandomInt(randomGen.start, randomGen.end)
}

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * ((max - min) + 1) + min)
}

export { guessModule }
