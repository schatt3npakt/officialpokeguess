<template>
  <div>
    <LayerTrigger class="options-bubble" :class="{hide: menuIsOpen || gameSupportIsOpen}" :is-active="gameOptionsIsOpen"
                  @click.native="optionsLayerClickHandler"/>

    <Layer class="options-layer" :class="{resetting: isResetting}" direction="ltr" :is-closing="optionsLayerIsClosing" :is-open="gameOptionsIsOpen">
      <p class="reset-notice">
        {{ text.saving[language] }}&nbsp;
        <span>.</span>&nbsp;
        <span>.</span>&nbsp;
        <span>.</span>
      </p>

      <p>{{ text.options[language] }}</p>

      <div class="options-layer__content">
        <div>
          <p>{{ text.pokemonGenerations[language] }}</p>

          <p class="reload-hint">
            {{ text.reloadHint[language] }}
          </p>

          <ul class="toggle-container">
            <li v-for="gen in pokemonGenerations" :key="gen.id">
              <Toggle
                :toggle-label="'Gen ' + gen.id"
                @click.native="genToggleClickHandler(gen.id)"
                :class="{disabled: activePokemonGenerations.length === 1}"
                :is-on="activePokemonGenerations.includes(gen.id)"
              />
            </li>
          </ul>
        </div>

        <div>
          <p>
            {{ text.imageOptions[language] }}
          </p>

          <ul class="image-options">
            <li>
              <Toggle
                :toggle-label="text.revealCaughtImage[language]"
                @click.native="revealCaughtHandler()"
                :is-on="revealCaught"
              />
            </li>

            <li>
              <Toggle
                :toggle-label="text.showImage[language]"
                @click.native="showPokeImageHandler()"
                :is-on="showPokeImage"
              />
            </li>

            <li>
              <Toggle
                :toggle-label="text.showPartOfImage[language]"
                @click.native="showPartOfImageHandler()"
                :is-on="showPartOfImage"
              />
            </li>

            <li>
              <Toggle
                :toggle-label="text.showPokemonOnFlee[language]"
                @click.native="showPokemonOnFleeHandler()"
                :is-on="showPokemonOnFlee"
              />
            </li>
          </ul>
        </div>

        <div>
          <p>
            {{ text.showHints[language] }}
          </p>

          <ul>
            <li>
              <Toggle
                :toggle-label="text.letterHints[language]"
                @click.native="hintToggleClickHandler"
                :is-on="showLetterHint"
              />
            </li>

            <li>
              <Toggle
                :toggle-label="text.showIndex[language]"
                @click.native="indexHintToggleClickHandler"
                :is-on="showIndexHint"
              />
            </li>

            <li>
              <Toggle
                :toggle-label="text.showType[language]"
                @click.native="typeHintToggleClickHandler"
                :is-on="showTypeHint"
              />
            </li>

            <li>
              <Toggle
                :toggle-label="text.showPokemonCry[language]"
                @click.native="cryToggleClickHandler"
                :is-on="showPokemonCry"
              />
            </li>
          </ul>
        </div>

        <div>
          <p>
            {{ text.encounterOptions[language] }}
          </p>

          <p class="reload-hint">
            {{ text.reloadHint[language] }}
          </p>

          <ul>
            <li>
              <Toggle
                :toggle-label="text.onlyUncaughtPokemon[language]"
                @click.native="onlyUncaughtToggleClickHandler"
                :is-on="onlyUncaughtPokemon"
              />
            </li>
          </ul>
        </div>

        <div>
          <p>
            {{ text.keyboardOptions[language] }}
          </p>

          <ul>
            <li>
              <Toggle
                :toggle-label="text.alphabeticalKeyboard[language]"
                @click.native="alphabeticalKeyboardToggleClickHandler"
                :is-on="useAlphabeticalKeyboard"
              />
            </li>
          </ul>
        </div>

        <div>
          <p>
            {{ text.difficulty[language] }}
          </p>

          <p class="reload-hint">
            {{ text.reloadHint[language] }}
          </p>

          <ul>
            <li>
              <Toggle
                :toggle-label="text.infiniteGuesses[language]"
                @click.native="infiniteGuessesToggleClickHandler"
                :is-on="infiniteGuesses"
              />
            </li>
            <li>
              <Toggle
                :toggle-label="text.oneGuessOnly[language]"
                @click.native="oneGuessOnlyToggleClickHandler"
                :is-on="oneGuessOnly"
              />
            </li>
            <li>
              <Toggle
                :toggle-label="text.timerModeActive[language]"
                @click.native="timerModeActiveToggleClickHandler"
                :is-on="timerModeActive"
              />
            </li>
          </ul>
        </div>
      </div>
    </Layer>
  </div>
</template>

<script>
import Layer from '@/components/Layer/Layer'
import LayerTrigger from '@/components/Layer/LayerTrigger'
import Toggle from '@/components/Atoms/Toggle'

export default {
  components: {
    Layer,
    LayerTrigger,
    Toggle
  },
  computed: {
    activePokemonGenerations () {
      return this.$store.state.guessModule.gameOptions.activeGens
    },
    activePokemonGeneration () {
      return this.$store.state.guessModule.gameState.currentGen
    },
    showGenHint () {
      return this.$store.state.guessModule.gameOptions.showGenHint
    },
    showLetterHint () {
      return this.$store.state.guessModule.gameOptions.hintsAllowed
    },
    showIndexHint () {
      return this.$store.state.guessModule.gameOptions.showIndexHint
    },
    showTypeHint () {
      return this.$store.state.guessModule.gameOptions.showTypeHint
    },
    showPokeImage () {
      return this.$store.state.guessModule.gameOptions.showPokeImage
    },
    pokemonGenerations () {
      return this.$store.state.guessModule.gens
    },
    playerInfo () {
      return this.$store.state.guessModule.playerInfo
    },
    pokemonId () {
      return this.$store.state.guessModule.gameState.pokeId
    },
    language () {
      return this.$store.state.language
    },
    menuIsOpen () {
      return this.$store.state.menuIsOpen
    },
    gameOptionsIsOpen () {
      return this.$store.state.gameOptionsIsOpen
    },
    gameSupportIsOpen () {
      return this.$store.state.gameSupportIsOpen
    },
    pokemonLowerLimit () {
      return this.$store.state.guessModule.gens[(Math.min(...this.$store.state.guessModule.gameOptions.activeGens) - 1)].start
    },
    pokemonUpperLimit () {
      return this.$store.state.guessModule.gens[(Math.max(...this.$store.state.guessModule.gameOptions.activeGens) - 1)].end
    },
    revealCaught () {
      return this.$store.state.guessModule.gameOptions.revealCaught
    },
    onlyUncaughtPokemon () {
      return this.$store.state.guessModule.gameOptions.excludeGuessedPokemon
    },
    useAlphabeticalKeyboard () {
      return this.$store.state.guessModule.gameOptions.useAlphabeticalKeyboard
    },
    infiniteGuesses () {
      return this.$store.state.guessModule.gameOptions.infiniteGuesses
    },
    oneGuessOnly () {
      return this.$store.state.guessModule.gameOptions.oneGuessOnly
    },
    showPartOfImage () {
      return this.$store.state.guessModule.gameOptions.showPartOfImage
    },
    showPokemonOnFlee () {
      return this.$store.state.guessModule.gameOptions.showPokemonOnFlee
    },
    showPokemonCry () {
      return this.$store.state.guessModule.gameOptions.showPokemonCry
    },
    timerModeActive () {
      return this.$store.state.guessModule.gameOptions.timerMode
    }
  },
  data: function () {
    return {
      text: require('../../lang/Guess.json'),
      optionsLayerIsClosing: false,
      isGenToggleInteracted: false,
      isResetting: false
    }
  },
  methods: {
    alphabeticalKeyboardToggleClickHandler () {
      this.$store.state.guessModule.gameOptions.useAlphabeticalKeyboard = !this.$store.state.guessModule.gameOptions.useAlphabeticalKeyboard
    },
    infiniteGuessesToggleClickHandler () {
      this.isGenToggleInteracted = true
      this.$store.state.guessModule.gameOptions.infiniteGuesses = !this.$store.state.guessModule.gameOptions.infiniteGuesses

      if (this.$store.state.guessModule.gameOptions.oneGuessOnly === true) {
        this.$store.state.guessModule.gameOptions.oneGuessOnly = false
      }
    },
    genToggleClickHandler (genId) {
      this.isGenToggleInteracted = true
      const gameOptions = this.$store.state.guessModule.gameOptions

      if (genId === this.activePokemonGeneration && this.activePokemonGenerations.length === 1) {
        return
      }

      if (gameOptions.activeGens.includes(genId)) {
        const index = gameOptions.activeGens.indexOf(genId)
        gameOptions.activeGens.splice(index, 1)
      } else {
        gameOptions.activeGens.push(genId)
      }
    },
    revealCaughtHandler () {
      this.$store.state.guessModule.gameOptions.revealCaught = !this.$store.state.guessModule.gameOptions.revealCaught
    },
    showPokemonOnFleeHandler () {
      this.$store.state.guessModule.gameOptions.showPokemonOnFlee = !this.$store.state.guessModule.gameOptions.showPokemonOnFlee
    },
    genHintToggleClickHandler () {
      this.$store.state.guessModule.gameOptions.showGenHint = !this.$store.state.guessModule.gameOptions.showGenHint
    },
    hintToggleClickHandler () {
      this.$store.state.guessModule.gameOptions.hintsAllowed = !this.$store.state.guessModule.gameOptions.hintsAllowed
    },
    cryToggleClickHandler () {
      this.$store.state.guessModule.gameOptions.showPokemonCry = !this.$store.state.guessModule.gameOptions.showPokemonCry
    },
    timerModeActiveToggleClickHandler () {
      this.isGenToggleInteracted = true
      this.$store.state.guessModule.gameOptions.timerMode = !this.$store.state.guessModule.gameOptions.timerMode
    },
    onlyUncaughtToggleClickHandler () {
      this.isGenToggleInteracted = true
      this.$store.state.guessModule.gameOptions.excludeGuessedPokemon = !this.$store.state.guessModule.gameOptions.excludeGuessedPokemon
    },
    indexHintToggleClickHandler () {
      this.$store.state.guessModule.gameOptions.showIndexHint = !this.$store.state.guessModule.gameOptions.showIndexHint
    },
    typeHintToggleClickHandler () {
      this.$store.state.guessModule.gameOptions.showTypeHint = !this.$store.state.guessModule.gameOptions.showTypeHint
    },
    oneGuessOnlyToggleClickHandler () {
      this.isGenToggleInteracted = true
      this.$store.state.guessModule.gameOptions.oneGuessOnly = !this.$store.state.guessModule.gameOptions.oneGuessOnly

      if (this.$store.state.guessModule.gameOptions.infiniteGuesses === true) {
        this.$store.state.guessModule.gameOptions.infiniteGuesses = false
      }
    },
    showPartOfImageHandler () {
      this.$store.state.guessModule.gameOptions.showPartOfImage = !this.$store.state.guessModule.gameOptions.showPartOfImage
    },
    optionsLayerClickHandler () {
      if (this.$store.state.gameOptionsIsOpen === false) {
        this.$store.state.gameOptionsIsOpen = true
      } else {
        if (this.isGenToggleInteracted) {
          this.isResetting = true
          this.$store.commit('genToggleReset')

          window.setTimeout(() => {
            this.isGenToggleInteracted = false
            this.optionsLayerIsClosing = true
            this.$store.state.gameOptionsIsOpen = false

            window.setTimeout(() => {
              this.optionsLayerIsClosing = false
              this.isResetting = false
            }, 800)
          }, 800)
        } else {
          this.isGenToggleInteracted = false
          this.optionsLayerIsClosing = true
          this.$store.state.gameOptionsIsOpen = false

          window.setTimeout(() => {
            this.optionsLayerIsClosing = false
          }, 800)
        }
      }
    },
    resetPokemon (initialDelay = true) {
      this.$store.commit('resetPokemon', initialDelay)
    },
    showPokeImageHandler () {
      this.$store.state.guessModule.gameOptions.showPokeImage = !this.$store.state.guessModule.gameOptions.showPokeImage
    }
  },
  name: 'OptionsLayer'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.options-bubble {
  bottom: 15px;
  left: 15px;
  transition: transform 0.25s ease;
  transform: scale(1);
  z-index: 3;

  &.hide {
    transform: scale(0);
  }
}

.options-layer {
  color: var(--theme-color);
  font-weight: 600;;
  text-align: center;
  z-index: 2;

  .reload-hint {
    font-size: 13px;
    margin-top: -20px;
  }

  .reset-notice {
    pointer-events: none;
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 24px;
    opacity: 0;
    transform: translate(-50%, calc(-50% + 20px));
    transition: opacity 0.25s ease;

    span {
      display: inline-block;
      opacity: 0;
      transition: opacity 0.25s ease;

      @for $i from 1 through 3 {
        &:nth-child(#{$i}) {
          transition-delay: 0.25s * $i;
        }
      }
    }
  }

  &.resetting {
    .options-layer__content {
      pointer-events: none;
      opacity: 0.3;
    }

    .reset-notice {
      opacity: 1;
      transform: translate(-50%, -50%);

      span {
        opacity: 1;
      }
    }
  }

  &__content {
    opacity: 1;
    transition: opacity 0.25s ease-in-out;

    @media (min-width: 720px) {
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(3, 1fr);
    }
  }

  p {
    margin: 0 auto 15px auto;
    max-width: 400px;
    font-size: 18px;

    @media (min-width: 735px) {
      font-size: 22px;
      margin: 0 auto 10px auto;
    }

    &:first-of-type {
      margin: 0 auto 30px auto;
    }

    &.gen-hint {
      font-size: 11px;
      margin-top: -5px;
      margin-bottom: 10px;
    }
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin-top: 0;
    margin-bottom: 30px;
  }

  li {
    display: inline-block;
    hyphens: auto;
    font-size: 12px;
    max-width: 110px;

    &:not(:last-child) {
      margin-right: 10px;
    }
  }

  .toggle-container {
    display: flex;
    gap: 10px;
    max-width: 300px;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    margin: 0 auto 20px auto;

    @media (min-width: 735px) {
      max-width: 370px;
    }
  }
}

.image-options {
  li {
    margin-bottom: 15px;
  }
}
</style>
