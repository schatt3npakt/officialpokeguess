<template>
  <div
    class="badge-wrapper"
  >
    <div class="badge" @click="overlayIsOpen = true">
      <img
        v-if="achieved"
        class="badge-thumbnail show"
        loading="lazy"
        :src="badgeImage" alt="">
      <img
        v-else
        class="badge-thumbnail"
        loading="lazy"
        :src="hiddenImage" alt="">

      <div
        class="progress-bar progress-bar--preview"
        v-if="!achieved && !secret"
      >
        <div
          v-bind:style="{ width: progress + '%' }"
          class="progress-bar__bar"
        ></div>
      </div>

      <span v-if="secret && !achieved" class="badge-text">
        ???
      </span>
      <span v-else class="badge-text">
        {{badgeTitle}}
      </span>
    </div>

    <div class="badge-overlay" :class="{open: overlayIsOpen}">
      <div class="overlay-inner">
        <div class="badge-image-wrapper">
          <img
            v-if="achieved"
            class="badge-image show"
            loading="lazy"
            :src="badgeImage" alt="">
          <img
            v-else
            class="badge-image"
            loading="lazy"
            :src="hiddenImage" alt="">
        </div>

        <div
          v-if="!achieved && !secret"
          class="progress-bar"
        >
          <div
            v-bind:style="{ width: progress + '%' }"
            class="progress-bar__bar"
          ></div>
          <span>
            {{Math.floor(progress)}}%
          </span>
        </div>
        <div v-if="displayThumbnails && !secret" class="pokeimage-wrapper">
          <div
            v-for="pokemon of badgePokemon"
            :key="pokemon"
          >
            <img
              :class="{show: checkIfPokemonIsCaught(pokemon)}"
              class="poke-thumbnail"
              loading="lazy"
              :src="constructImageLink(pokemon)" alt="">
          </div>
        </div>

        <span v-if="secret && !achieved" class="badge-text--overlay">
          ???
        </span>
        <span v-else class="badge-text--overlay">
          {{badgeTitle}}
        </span>

        <p v-show="!secret || secret && achieved" class="badge-description">
          {{ badgeText }}
        </p>

        <BigButton :button-text="text.close[language]" @click.native="overlayIsOpen = false"></BigButton>
      </div>
    </div>
  </div>
</template>

<script>
import BigButton from '@/components/PlayerInfo/BigButton'

const badgeText = require('../../lang/Badges.json')

export default {
  components: {
    BigButton
  },
  computed: {
    language () {
      return this.$store.state.language
    }
  },
  data: function () {
    return {
      overlayIsOpen: false,
      isOpen: false,
      text: badgeText
    }
  },
  methods: {
    constructImageLink (id) {
      return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + id + '.png'
    },
    checkIfPokemonIsCaught (id) {
      return this.caughtPokemon.includes(id)
    },
    styleClass () {
      return 'width:' + this.progress + '%'
    },
    toggleIsOpen () {
      this.isOpen = !this.isOpen
    }
  },
  name: 'Badge',
  props: {
    achieved: Boolean,
    badgeTitle: String,
    badgeImage: String,
    badgeText: String,
    badgePokemon: Array,
    secret: Boolean,
    progress: Number,
    caughtPokemon: Array,
    displayThumbnails: Boolean,
    hiddenImage: String
  }
}
</script>

<style scoped lang="scss">
.badge {
  border: 2px solid var(--theme-color);
  border-radius: 20px;
  cursor: pointer;
  width: 130px;
  height: auto;
  display: flex;
  justify-content: space-between;
  flex-flow: column nowrap;
  padding: 10px;
  transform: scale(1);
}

.badge-thumbnail {
  display: block;
  margin: 0 auto 10px auto;
  height: 70px;
  width: auto;
  filter:
    brightness(0)
    drop-shadow(1px 0px 0px var(--theme-color))
    drop-shadow(-1px 0px 0px var(--theme-color))
    drop-shadow(0px 1px 0px var(--theme-color))
    drop-shadow(0px -1px 0px var(--theme-color));

  &.show {
    filter: none;
  }
}

.progress-bar {
  border: 2px solid var(--theme-color);
  font-size: 20px;
  font-weight: 600;
  border-radius: 10px;
  height: 40px;
  width: 100%;
  margin: 10px 0;
  display: block;
  position: relative;

  &--preview {
    height: 10px;
    margin: 0 0 10px 0;
  }

  &__bar {
    background-color: var(--theme-color);
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
  }

  span {
    color: var(--contrast-color);
    position: absolute;
    font-size: 26px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 7;
    text-shadow:
      -2px -2px 0 var(--theme-color),
      2px -2px 0 var(--theme-color),
      -2px 2px 0 var(--theme-color),
      2px 2px 0 var(--theme-color);
  }
}

.badge-overlay {
  background-color: var(--contrast-color);
  border: 2px solid var(--theme-color);
  border-radius: 20px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: calc(100vw - 30px);
  height: calc(100vh - 30px);
  z-index: 10;
  padding: 30px;
  transition: transform 0.25s ease-in-out;
  pointer-events: none;
  overflow: auto;

  &.open {
    pointer-events: auto;
    transform: translate(-50%, -50%) scale(1);
  }

  .day & {
    background-color: var(--contrast-color);
  }

  .badge-description {
    color: var(--theme-color);
    font-size: 20px;
    font-weight: 600;
    text-align: center;
  }

  .badge-image {
    display: block;
    width: 100%;
    max-width: 320px;
    height: auto;
    margin: 0 auto;
    filter:
      brightness(1)
      drop-shadow(1px 0px 0px var(--theme-color))
      drop-shadow(-1px 0px 0px var(--theme-color))
      drop-shadow(0px 1px 0px var(--theme-color))
      drop-shadow(0px -1px 0px var(--theme-color));

    &.show {
      filter: none;
    }
  }

  .pokeimage-wrapper {
    display: flex;
    justify-content: center;
  }

  .poke-thumbnail {
    display: block;
    max-width: 70px;
    height: auto;

    filter:
      brightness(0)
      drop-shadow(1px 0px 0px var(--theme-color))
      drop-shadow(-1px 0px 0px var(--theme-color))
      drop-shadow(0px 1px 0px var(--theme-color))
      drop-shadow(0px -1px 0px var(--theme-color));

    &.show {
      filter: none;
    }
  }

  .overlay-inner {
    margin: auto;
    max-width: 480px;
  }
}

.badge-text {
  color: var(--theme-color);
  font-weight: 600;;
  display: block;
  text-align: center;
  font-size: 14px;
  margin-bottom: 0;

  &--overlay {
    color: var(--theme-color);
    font-weight: 600;;
    display: block;
    text-align: center;
    font-size: 20px;
    margin-bottom: 10px;
  }
}
</style>
