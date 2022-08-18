<template>
  <div
    class="pokedex-entry"
    :class="{perfect: isPerfect, caught: id}"
  >
    <img
      v-if="id"
      loading="lazy"
      class="poke-thumbnail caught"
      :src="constructThumbnailLink(id)"
      alt="">
    <img
      v-else
      loading="lazy"
      class="poke-thumbnail"
      :src="constructThumbnailLink(fallbackIndex)"
      alt="">

    <div class="poke-info-wrapper">
      <div class="poke-info-top">
        <span class="pokenumber">#{{ getPokeNumber(fallbackIndex) }}</span>

        <span v-if="id" class="pokemon-name">{{ getPokemonName(id) }}</span>
        <span v-else class="placeholder">???</span>
      </div>

      <div class="poke-info-bottom">
        <span v-if="id">
          {{ text.lastCaught[language] }} <br />
          {{ returnTime(timeStamp) }}
        </span>

        <span v-if="isPerfect">
          <br />
          {{ text.perfect[language] }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import PokemonService from '../../pokemonService'
const pokemonService = new PokemonService()

export default {
  computed: {
    language () {
      return this.$store.state.language
    }
  },
  data: function () {
    return {
      text: require('../../lang/Pokedex.json')
    }
  },
  methods: {
    constructImageLink (id) {
      return 'https://pokeguess.bitheart.de/pokemon/' + id + '.png'
    },
    constructThumbnailLink (id) {
      const noIconAvailable = [
        898,
        899,
        900,
        901,
        902,
        903,
        904,
        905
      ]

      if (noIconAvailable.includes(id)) {
        return 'https://pokeguess.bitheart.de/pokemon/' + id + '.png'
      } else {
        return 'https://pokeguess.bitheart.de/pokemon/icons/' + id + '.png'
      }
    },
    getPokemonName (id) {
      return pokemonService.getName(id, this.language)
    },
    getPokeNumber (int) {
      return String(int).padStart(3, '0')
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
  name: 'PokedexEntry',
  props: {
    id: Number,
    timeStamp: Number,
    fallbackIndex: Number,
    isPerfect: Boolean
  }
}
</script>

<style lang="scss" scoped>
.pokedex-entry {
  display: flex;
  border: 3px solid var(--theme-color);
  padding: 10px;
  border-radius: 10px;
  font-size: 20px;
  margin-bottom: 20px;

  @media (min-width: 720px) {
    margin-bottom: 0;
  }

  &.perfect {
    border: 3px solid #EEE8AA;
    color: #EEE8AA;

    .gameboy & {
      border: 3px solid var(--theme-color);
      color: var(--theme-color);
    }
  }

  .poke-info-bottom,
  .poke-info-top {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .poke-info-bottom {
    font-size: 14px;
    display: flex;
  }

  .poke-info-wrapper {
    width: 100%;
  }
}

.poke-info-wrapper {
  display: flex;
  flex-flow: column;
  justify-content: space-between;

  .pokenumber {
    display: block;
  }
}

.poke-thumbnail {
  display: inline-block;
  margin-right: 25px;
  max-width: 50px;
  filter:
    brightness(0)
    drop-shadow(1px 0px 0px var(--theme-color))
    drop-shadow(-1px 0px 0px var(--theme-color))
    drop-shadow(0px 1px 0px var(--theme-color))
    drop-shadow(0px -1px 0px var(--theme-color));

  @media (min-width: 720px) {
    height: 50px;
    width: 100px;
    object-fit: contain;
  }

  &.caught {
    filter:
      brightness(1)
      drop-shadow(1px 0px 0px var(--theme-color))
      drop-shadow(-1px 0px 0px var(--theme-color))
      drop-shadow(0px 1px 0px var(--theme-color))
      drop-shadow(0px -1px 0px var(--theme-color));
  }

  .perfect & {
    &.caught {
      filter:
        brightness(1)
        drop-shadow(1px 0px 0px #EEE8AA)
        drop-shadow(-1px 0px 0px #EEE8AA)
        drop-shadow(0px 1px 0px #EEE8AA)
        drop-shadow(0px -1px 0px #EEE8AA);
    }
  }
}
</style>
