<template>
  <div class="pokedex">
    <div
      class="pokedex-detail"
      :class="{hidden: pokemonCaughtId.includes(activePokemonId)}"
    >
      <img class="pokeimage" :src="constructImageLink(activePokemonId)" alt="">

      <div v-if="pokemonCaughtId.includes(activePokemonId)">
        <div class="pokemon-first-row">
          <div class="pokemon-info">
            <p class="pokemon-number">
              #{{ String(activePokemonId).padStart(3, '0')}}
            </p>

            <p class="pokemon-name">
              {{ getPokemonName(activePokemonId) }}
            </p>

            <br>

            <p>
              {{ pokedexText.lastCaught[language] }} <br />
              {{ returnTime(getPokemonCaught(activePokemonId).timeStamp) }}
            </p>
          </div>

          <div class="pokemon-types" v-if="pokemonTypes.length >= 1">
            <div
              v-for="(type, index) in pokemonTypes"
              :key="type">
              <div
                class="type"
                :class="type"
              >
                {{guessText.types[type][language]}}
              </div>

              <br  v-if="index === pokemonTypes.length - 1" />
            </div>
          </div>
        </div>

        <div class="pokemon-description">
        </div>
      </div>
      <div v-else>
        <div class="pokemon-first-row">
          <div class="pokemon-info">
            <p class="pokemon-number">
              #{{ String(activePokemonId).padStart(3, '0')}}
            </p>
            <p class="pokemon-name">
              ???
            </p>
          </div>
        </div>
      </div>
    </div>

    <LayerTrigger
      class="search-bubble"
      :is-active="searchLayerIsOpen"
      @click.native="searchLayerTriggerHandler"
    >
      <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
           viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
              <path class="st3" d="M95.5,84.6L84.2,73.3c0,0-0.1-0.1-0.1-0.1c6.2-7.6,9.9-17.3,9.9-27.9C94,20.9,74.1,1,49.6,1S5.3,20.9,5.3,45.4
                s19.9,44.4,44.4,44.4c9.4,0,18.2-2.9,25.4-8c0.1,0.1,0.2,0.3,0.4,0.4l11.3,11.3c2.4,2.4,6.4,2.4,8.8,0C97.9,91,97.9,87.1,95.5,84.6z
                 M15.7,45.4c0-18.7,15.2-33.9,33.9-33.9s33.9,15.2,33.9,33.9c0,18.7-15.2,33.9-33.9,33.9S15.7,64.1,15.7,45.4z"/>
            </svg>
    </LayerTrigger>

    <Layer
      class="search-layer"
      direction="ltr"
      :mobile-only="true"
      :is-closing="searchLayerIsClosing"
      :is-open="searchLayerIsOpen">
      <div class="pokedex-list">
        <div>
          <div class="toggle-outer">
            <Toggle @click.native="toggleClickHandler" :is-on="findUncaught" :toggle-label=" pokedexText.findUncaught[language]" />
          </div>

          <div class="searchbar-container">
            <input class="searchbar" v-model="inputValue" @change="inputHandler" type="text" :placeholder="pokedexText.placeholder[language]"/>

            <button class="reset-button" :class="{show: this.inputValue.length >= 1}" @click="resetButtonClickHandler">
              x
            </button>

            <button
              class="search-button"
              @click="inputHandler"
            >
               {{pokedexText.search[language]}}
            </button>
          </div>
        </div>

        <div class="pokedex-list__inner">
          <Collapsible
            :show-on-desktop="true"
            button-text="Gen 1">
            <PokedexEntry
              :class="{active: index + 1 === activePokemonId}"
              v-for="(poke, index) in gens[0]"
              @click.native="pokeDexEntryClickHandler(index)"
              :key="poke"
              :data-title="pokemon[index].toLowerCase()"
              v-bind="getPokemonCaught(index + 1)"
              :fallback-index="index + 1"
            />
          </Collapsible>

          <Collapsible
            :show-on-desktop="true"
            button-text="Gen 2">
            <PokedexEntry
              :class="{active: index + 152 === activePokemonId}"
              v-for="(poke, index) in gens[1]"
              @click.native="pokeDexEntryClickHandler(index + 151)"
              :key="poke"
              :data-title="pokemon[index + 151].toLowerCase()"
              v-bind="getPokemonCaught(index + 152)"
              :fallback-index="index + 152"
            />
          </Collapsible>

          <Collapsible
            :show-on-desktop="true"
            button-text="Gen 3">
            <PokedexEntry
              :class="{active: index + 252 === activePokemonId}"
              v-for="(poke, index) in gens[2]"
              @click.native="pokeDexEntryClickHandler(index + 251)"
              :key="poke"
              :data-title="pokemon[index + 251].toLowerCase()"
              v-bind="getPokemonCaught(index + 252)"
              :fallback-index="index + 252"
            />
          </Collapsible>

          <Collapsible
            :show-on-desktop="true"
            button-text="Gen 4">
            <PokedexEntry
              :class="{active: index + 387 === activePokemonId}"
              v-for="(poke, index) in gens[3]"
              @click.native="pokeDexEntryClickHandler(index + 386)"
              :key="poke"
              :data-title="pokemon[index + 386].toLowerCase()"
              v-bind="getPokemonCaught(index + 387)"
              :fallback-index="index + 387"
            />
          </Collapsible>

          <Collapsible
            :show-on-desktop="true"
            button-text="Gen 5">
            <PokedexEntry
              :class="{active: index + 495 === activePokemonId}"
              v-for="(poke, index) in gens[4]"
              @click.native="pokeDexEntryClickHandler(index + 494)"
              :key="poke"
              :data-title="pokemon[index + 494].toLowerCase()"
              v-bind="getPokemonCaught(index + 495)"
              :fallback-index="index + 495"
            />
          </Collapsible>

          <Collapsible
            :show-on-desktop="true"
            button-text="Gen 6">
            <PokedexEntry
              :class="{active: index + 650 === activePokemonId}"
              v-for="(poke, index) in gens[5]"
              @click.native="pokeDexEntryClickHandler(index + 649)"
              :key="poke"
              :data-title="pokemon[index + 649].toLowerCase()"
              v-bind="getPokemonCaught(index + 650)"
              :fallback-index="index + 650"
            />
          </Collapsible>

          <Collapsible
            :show-on-desktop="true"
            button-text="Gen 7">
            <PokedexEntry
              :class="{active: index + 722 === activePokemonId}"
              v-for="(poke, index) in gens[6]"
              @click.native="pokeDexEntryClickHandler(index + 721)"
              :key="poke"
              :data-title="pokemon[index + 721].toLowerCase()"
              v-bind="getPokemonCaught(index + 722)"
              :fallback-index="index + 722"
            />
          </Collapsible>

          <Collapsible
            :show-on-desktop="true"
            button-text="Gen 8">
            <PokedexEntry
              :class="{active: index + 810 === activePokemonId}"
              v-for="(poke, index) in gens[7]"
              @click.native="pokeDexEntryClickHandler(index + 809)"
              :key="poke"
              :data-title="pokemon[index + 809].toLowerCase()"
              v-bind="getPokemonCaught(index + 810)"
              :fallback-index="index + 810"
            />
          </Collapsible>
        </div>
      </div>
    </Layer>
  </div>
</template>

<script>
import PokedexEntry from '@/components/Pokedex/PokedexEntry'
import Collapsible from '@/components/PlayerInfo/Collapsible'
import Toggle from '@/components/Atoms/Toggle'
import Layer from '@/components/Layer/Layer'
import LayerTrigger from '@/components/Layer/LayerTrigger'
import PokemonService from '../pokemonService'

const guessText = require('../lang/Guess.json')
const pokemonService = new PokemonService()

export default {
  components: {
    Collapsible,
    PokedexEntry,
    Toggle,
    Layer,
    LayerTrigger
  },
  computed: {
    pokemonCaughtId () {
      return this.$store.state.guessModule.playerInfo.pokemonCaughtId
    },
    pokemonCaught () {
      return this.$store.state.guessModule.playerInfo.pokemonCaught
    },
    language () {
      return this.$store.state.language
    },
    gens () {
      return [
        this.pokemon.slice(1, 152),
        this.pokemon.slice(152, 252),
        this.pokemon.slice(252, 387),
        this.pokemon.slice(387, 495),
        this.pokemon.slice(495, 650),
        this.pokemon.slice(650, 722),
        this.pokemon.slice(722, 810),
        this.pokemon.slice(810, 907)
      ]
    }
  },
  data: function () {
    return {
      activePokemonId: 1,
      pokemon: [],
      guessText: guessText,
      pokemonTypes: [],
      inputValue: '',
      findUncaught: false,
      allPokedexEntries: false,
      allCollapsibles: false,
      pokedexText: require('../lang/Pokedex.json'),
      text: require('../lang/PlayerData.json'),
      searchLayerIsOpen: false,
      searchLayerIsClosing: false
    }
  },
  methods: {
    constructImageLink (id) {
      return 'https://pokeguess.bitheart.de/pokemon/' + id + '.png'
    },
    getPokemonCaught (id) {
      return this.pokemonCaught.find(e => e.id === id)
    },
    getPokemonName (id) {
      return this.pokemon[id - 1]
    },
    getPokemonTypes (id) {
      if (this.pokemonCaughtId.includes(this.activePokemonId)) {
        this.pokemonTypes = pokemonService.getTypes(id)
      }
    },
    pokeDexEntryClickHandler (id) {
      const newIndex = id + 1
      this.activePokemonId = newIndex
      this.getPokemonTypes(newIndex)
      window.setTimeout(() => {
        this.searchLayerTriggerHandler()
      }, 500)
    },
    inputHandler () {
      this.allPokedexEntries = document.querySelectorAll('.pokedex-entry')

      this.allCollapsibles.forEach((elem) => {
        elem.classList.remove('collapsibleOpen')
        elem.classList.add('disabled')
      })
      if (this.inputValue.length <= 2) {
        this.allPokedexEntries.forEach((elem) => {
          elem.parentNode.parentNode.classList.remove('collapsibleOpen')
          elem.parentNode.parentNode.classList.remove('disabled')
          elem.style.display = 'flex'
        })
      } else {
        this.allPokedexEntries.forEach((elem) => {
          if (elem.dataset.title.indexOf(this.inputValue.toLowerCase()) < 0) {
            elem.style.display = 'none'
          } else {
            if (this.findUncaught) {
              elem.style.display = 'flex'
              elem.parentNode.parentNode.classList.add('collapsibleOpen')
              elem.parentNode.parentNode.classList.remove('disabled')
            } else {
              if (elem.classList.contains('caught')) {
                elem.style.display = 'flex'
                elem.parentNode.parentNode.classList.add('collapsibleOpen')
                elem.parentNode.parentNode.classList.remove('disabled')
              } else {
                elem.style.display = 'none'
              }
            }
          }
        })
      }
    },
    searchLayerTriggerHandler () {
      if (!this.searchLayerIsOpen) {
        this.searchLayerIsOpen = true
      } else {
        this.searchLayerIsOpen = false
        this.searchLayerIsClosing = true

        window.setTimeout(() => {
          this.searchLayerIsClosing = false
        }, 800)
      }
    },
    resetButtonClickHandler () {
      this.inputValue = ''
      this.inputHandler()
    },
    toggleClickHandler () {
      this.findUncaught = !this.findUncaught
      this.inputHandler()
    },
    returnTime (timestamp) {
      const date = new Date(timestamp)

      if (this.language === 'de') {
        return String(date.getDate()).padStart(2, '0') + '.' + String(date.getMonth() + 1).padStart(2, '0') + '.' + date.getFullYear() + ', ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')
      } else {
        return String(date.getMonth() + 1).padStart(2, '0') + '.' + String(date.getDate()).padStart(2, '0') + '.' + date.getFullYear() + ', ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')
      }
    }
  },
  mounted: function () {
    this.pokemonTypes = pokemonService.getTypes(this.activePokemonId)
    this.pokemon = pokemonService.getAll(this.language)

    this.allCollapsibles = document.querySelectorAll('.player-data__collapsible')
  },
  name: 'PlayerData'
}
</script>

<style lang="scss" scoped>
.toggle-outer .toggle-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.search-bubble {
  bottom: 15px;
  left: 15px;
  transition: transform 0.25s ease;
  transform: scale(1);
  z-index: 3;

  @media (min-width: 720px) {
    display: none;
  }
}

.pokedex {
  padding: 20px;

  @media (min-width: 720px) {
    display: grid;
    grid-template-columns: 4fr 3fr;
  }

  .searchbar-container {
    display: flex;
    position: relative;

    .searchbar {
      font-size: 14px;
      border: 2px solid var(--theme-color);
      border-radius: 10px 0 0 10px;
      background-color: transparent;
      color: var(--theme-color);
      height: 50px;
      width: 100%;
      padding: 0 15px;
      font-weight: 600;
      cursor: pointer;

      &::placeholder {
        color: var(--theme-color);
        opacity: 1;
      }
    }

    .search-button {
      font-size: 14px;
      background-color: var(--theme-color);
      border-radius: 0 10px 10px 0;
      color: var(--contrast-color);
      font-weight: 600;
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
      font-weight: 600;
      font-size: 25px;
      transition: transform 0.25s ease-in-out;
      cursor: pointer;

      &.show {
        transform: translateY(-50%) scale(1);
      }
    }
  }
}

.pokedex-detail {
  color: var(--theme-color);
  font-weight: 600;
  margin-top: 5px;
  min-height: 300px;
  padding: 20px;

  @media (min-width: 720px) {
    padding: 0 40px;
  }

  p {
    margin: 0;
  }

  .pokemon-first-row {
    display: flex;
    justify-content: space-between;
    align-content: flex-start;
    margin-bottom: 10px;
  }

  .pokemon-description {
    margin-bottom: 20px;
  }

  .pokemon-types {
    text-align: right;

    .type {
      font-size: 14px;
      color: var(--contrast-color);
      display: inline-block;
      padding: 2px 5px;
      border-radius: 5px;
      margin-bottom: 5px;

      &.normal {background-color: var(--type-color-normal)}
      &.kampf {background-color: var(--type-color-fighting)}
      &.flug {background-color: var(--type-color-flying)}
      &.gift {background-color: var(--type-color-poison)}
      &.boden {background-color: var(--type-color-ground)}
      &.gestein {background-color: var(--type-color-rock)}
      &.käfer {background-color: var(--type-color-bug)}
      &.geist {background-color: var(--type-color-ghost)}
      &.stahl {background-color: var(--type-color-steel)}
      &.feuer {background-color: var(--type-color-fire)}
      &.wasser {background-color: var(--type-color-water)}
      &.pflanze {background-color: var(--type-color-grass)}
      &.elektro {background-color: var(--type-color-electric)}
      &.psycho {background-color: var(--type-color-psychic)}
      &.ice {background-color: var(--type-color-ice)}
      &.drache {background-color: var(--type-color-dragon)}
      &.unlicht {background-color: var(--type-color-dark)}
      &.fee {background-color: var(--type-color-fairy)}
    }

    .gameboy & {
      filter: grayscale(100%);
    }
  }
}

.pokeimage {
  display: block;
  margin: auto;
  max-width: 150px;
  object-fit: contain;
  height: auto;
  filter:
    brightness(0)
    drop-shadow(1px 0px 0px var(--theme-color))
    drop-shadow(-1px 0px 0px var(--theme-color))
    drop-shadow(0px 1px 0px var(--theme-color))
    drop-shadow(0px -1px 0px var(--theme-color));

  @media (min-width: 720px) {
    height: 300px;
    width: 300px;
    max-width: none;
    padding: 10px;
  }

  .hidden & {
    filter:
      brightness(1)
      drop-shadow(1px 0px 0px var(--theme-color))
      drop-shadow(-1px 0px 0px var(--theme-color))
      drop-shadow(0px 1px 0px var(--theme-color))
      drop-shadow(0px -1px 0px var(--theme-color));
  }
}

.pokedex-list__inner {
  border-collapse: collapse;
  color: var(--theme-color);
  font-weight: 600;;
  width: 100%;
  padding-right: 5px;
  max-height: calc(100vh - 200px);
  overflow: auto;

  @media (min-width: 720px) {
    margin-top: 20px;
    display: block;
    gap: initial;
    max-height: calc(100vh - 280px);
  }

  .player-data__collapsible {
    &.disabled {
      display: none;
    }
  }

  .pokedex-entry {
    cursor: pointer;
    font-size: 13px;
    width: 100%;
    margin-bottom: 15px;
    transition: background-color 0.25s ease-in-out;

    @media (min-width: 720px) {
      font-size: 16px;
      margin-bottom: 15px;
    }

    &.hide {
      display: none;
    }

    &.active {
      background-color: rgba(0, 0, 0, 0.25);
    }
  }
}
</style>
