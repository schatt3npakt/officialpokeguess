<template>
  <div class="badge-wrapper">
    <div class="badge-category__tab-container">
      <button
        :class="{active: category.title === activeCategory}"
        @click="tabClickHandler(category.title)"
        v-for="category in badgeObject"
        :key="category.id"
      >
        {{ category.title }}
      </button>
    </div>

    <div
      class="badge-page"
      v-for="category in badgeObject"
      :class="{active: category.title === activeCategory}"
      :key="category.id">
      <Badge
        v-for="badge in category.badges"
        :achieved="isBadgeAchieved(badge.id)"
        :badge-title="badgeTexts[badge.id].title[language]"
        :badge-image="badge.image"
        :badge-text="badgeTexts[badge.id].text[language]"
        :badge-pokemon="badge.pokemon"
        :secret="badge.isSecret"
        :progress="getBadgeProgress(badge.id)"
        :caught-pokemon="getCaughtPokemon(badge.id)"
        :display-thumbnails="badge.displayThumbnails"
        :hidden-image="category.hiddenImage"
        :key="badge.id"
      ></Badge>
    </div>
  </div>
</template>

<script>
import Badge from '@/components/PlayerInfo/Badge'
import badges from '../../data/badges.json'

const badgeJSON = require('../../data/badges.json')
const badgeText = require('../../lang/Badges.json')

export default {
  computed: {
    language () {
      return this.$store.state.language
    }
  },
  components: {
    Badge
  },
  data: function () {
    return {
      activeCategory: 'Kanto',
      badgeObject: badgeJSON,
      badgeTexts: badgeText
    }
  },
  methods: {
    isBadgeAchieved (badgeId) {
      const badgeInStorage = this.$store.state.guessModule.playerInfo.badgeProgress[badgeId]

      if (badgeInStorage) {
        return badgeInStorage.caughtPokemon.length === badgeInStorage.totalPokemonNeeded
      }
    },
    getBadgeProgress (badgeId) {
      return this.$store.state.guessModule.playerInfo.badgeProgress[badgeId].progress
    },
    getCaughtPokemon (badgeId) {
      return this.$store.state.guessModule.playerInfo.badgeProgress[badgeId].caughtPokemon
    },
    tabClickHandler (category) {
      this.activeCategory = category
    }
  },
  name: 'BadgeContainer',
  mounted: function () {
    const playerInfo = this.$store.state.guessModule.playerInfo
    const allBadges = []

    for (const category of badges) {
      for (const badge of category.badges) {
        const badgeObject = {
          id: badge.id,
          totalPokemonNeeded: badge.pokemon.length,
          caughtPokemon: [],
          progress: 0
        }
        const badgePercentile = 100 / badge.pokemon.length

        for (const badgePokemon of badge.pokemon) {
          if (playerInfo.pokemonCaughtId.includes(badgePokemon)) {
            badgeObject.caughtPokemon.push(badgePokemon)
            badgeObject.progress += badgePercentile
          }
        }

        allBadges.push(badgeObject)
      }
    }

    playerInfo.badgeProgress = allBadges
    localStorage.setItem('badgeProgress', JSON.stringify(playerInfo.badgeProgress))
  }
}
</script>

<style scoped lang="scss">
.badge-wrapper {
  margin: 0 10px;
  transition: opacity 0.25s ease-in-out;
}

.badge-category {
  &__tab-container {
    border-bottom: 2px solid var(--theme-color);
    display: flex;
    gap: 10px;
    font-weight: 600;;
    margin-bottom: 20px;
    overflow: auto;

    button {
      font-weight: 600;;
      cursor: pointer;
      background-color: transparent;
      color: var(--theme-color);
      padding: 5px 20px;
      border-bottom: none;
      border-top: 2px solid var(--theme-color);
      border-left: 2px solid var(--theme-color);
      border-right: 2px solid var(--theme-color);
      border-radius: 10px 10px 0 0;
      transition: background-color 0.25s ease, color 0.25s ease;

      &.active {
        color: var(--contrast-color);
        background-color: var(--theme-color);
      }
    }
  }
}

.badge-page {
  max-height: 0;
  overflow: hidden;
  display: flex;
  flex-flow: row wrap;
  gap: 20px;
  justify-content: flex-start;

  @media (min-width: 720px) {
    &:hover {
      .badge-wrapper {
        opacity: 0.5;

        &:hover {
          opacity: 1;
        }
      }
    }
  }

  &.active {
    max-height: none;

    .badge {
      transform: scale(1);
    }
  }
}
</style>
