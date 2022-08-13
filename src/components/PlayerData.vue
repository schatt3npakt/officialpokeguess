<template>
  <div class="player-data">
    <div class="player-data__inner">
      <Collapsible
        :button-text="text.collectorStatistic[language]">
        <table class="player-info">
          <tr>
            <td>{{ text.lastCaughtPokemon[language] }}</td>

            <td v-if="lastCaughtPokemon === '0' || !lastCaughtPokemon">{{ text.noPokemonCaught[language] }}</td>
            <td v-else>{{ getPokemonName(lastCaughtPokemon.id) }}</td>
          </tr>

          <tr>
            <td>{{ text.pokemonSeen[language] }}</td>

            <td>{{ pokemonMet }}</td>
          </tr>

          <tr>
            <td>{{ text.pokemonCaught[language] }}</td>

            <td>{{ pokemonCaught }}</td>
          </tr>

          <tr>
            <td>{{ text.pokemonPerfectlyCaught[language] }}</td>

            <td>{{ pokemonPerfectlyCaught }}</td>
          </tr>

          <tr>
            <td>{{ text.legendaryPokemonCaught[language] }}</td>

            <td>{{ legendaryPokemonCaught }}</td>
          </tr>

          <tr>
            <td>{{ text.mythicalPokemonCaught[language] }}</td>

            <td>{{ mythicalPokemonCaught }}</td>
          </tr>

          <tr>
            <td>{{ text.pokemonStreak[language] }}</td>

            <td>{{ catchingStreak }}</td>
          </tr>
        </table>
      </Collapsible>

      <!--
      <Collapsible
        :key="text.badges[language]"
        :button-text="text.badges[language]">
        <BadgeContainer />
      </Collapsible>
      -->
    </div>

    <BigButton
      :button-text="text.resetData[language]"
      @click.native="showResetNotice = true" />

    <div class="reset-notice" v-show="showResetNotice">
      <p>
        {{ text.resetDataQuestion[language] }}
      </p>

      <BigButton
        :button-text="text.reallyResetData[language]"
        @click.native="playerInfoResetHandler" />
    </div>
  </div>
</template>

<script>
// import BadgeContainer from '@/components/PlayerInfo/BadgeContainer'
import BigButton from '@/components/PlayerInfo/BigButton'
import Collapsible from '@/components/PlayerInfo/Collapsible'
import PokemonService from '../pokemonService'

const pokemonService = new PokemonService()

export default {
  components: {
    // BadgeContainer,
    BigButton,
    Collapsible
  },
  computed: {
    catchingStreak () {
      return this.$store.state.guessModule.playerInfo.catchingStreak.length
    },
    pokemonMet () {
      return this.$store.state.guessModule.playerInfo.pokemonMet.length
    },
    pokemonCaught () {
      return this.$store.state.guessModule.playerInfo.pokemonCaught.length
    },
    legendaryPokemonCaught () {
      return this.$store.state.guessModule.playerInfo.legendaryPokemonCaught.length
    },
    mythicalPokemonCaught () {
      return this.$store.state.guessModule.playerInfo.mythicalPokemonCaught.length
    },
    pokemonPerfectlyCaught () {
      return this.$store.state.guessModule.playerInfo.pokemonCaught.filter(o => o.isPerfect).length
    },
    language () {
      return this.$store.state.language
    },
    lastCaughtPokemon () {
      return this.$store.state.guessModule.playerInfo.pokemonCaught[this.$store.state.guessModule.playerInfo.pokemonCaught.length - 1]
    }
  },
  data: function () {
    return {
      pokemon: [],
      text: require('../lang/PlayerData.json'),
      showResetNotice: false
    }
  },
  methods: {
    getEarnedBadgesAmount () {
      const earnedBadges = this.$store.state.guessModule.playerInfo.badgeProgress.every(elem => elem.totalPokemonNeeded === elem.caughtPokemon)

      return (earnedBadges) ? earnedBadges.length : 0
    },
    getPokemonName (id) {
      return this.pokemon[id - 1]
    },
    playerInfoResetHandler () {
      this.$store.commit('resetPlayerData')
      this.showResetNotice = false
    }
  },
  mounted: function () {
    this.pokemon = pokemonService.getAll(this.language)
  },
  name: 'PlayerData'
}
</script>

<style lang="scss" scoped>
.player-info {
  border-collapse: collapse;
  color: var(--theme-color);
  font-weight: 600;
  width: 100%;

  tr {
    &:nth-child(even) {
      td {
        background-color: rgba(var(--contrast-color), 0.07);
      }
    }

    td {
      &:last-child {
        text-align: center;
      }
    }
  }

  td {
    font-size: 18px;
    padding: 10px;
  }
}

.player-data {
  padding: 20px;

  &__inner {
    max-width: 400px;
    margin: auto;
  }
}

.reset-notice {
  color: var(--theme-color);
  font-weight: 600;
  width: 100%;
  max-width: 400px;
  margin: auto;
  padding-top: 20px;
}
</style>
