<template>
  <div class="inner">
    <div class="bottom-elements">
      <ul class="game-modes">
        <li v-for="gameMode in gameModes" :key="gameMode.id" @click="gameModeClickHandler(gameMode.gameOptions)">
          <div>
            <div class="icon">
              <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                  viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
                <g>
                  <path class="st0" d="M94.7,55C92.2,77.5,73.2,95,50,95S7.8,77.5,5.3,55h29.5c2.1,6.4,8.1,11,15.2,11s13.1-4.6,15.2-11H94.7z"/>
                </g>
                <g>
                  <path class="st0" d="M94.7,45H65.2c-2.1-6.4-8.1-11-15.2-11s-13.1,4.6-15.2,11H5.3C7.8,22.5,26.8,5,50,5S92.2,22.5,94.7,45z"/>
                </g>
              </svg>
            </div>

            <div class="description">
              <h3>{{ text[gameMode.title].title[language] }}</h3>

              <p>{{ text[gameMode.title].description[language] }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import router from '../router/index'
export default {
  name: 'App',
  computed: {
    language () {
      return this.$store.state.language
    }
  },
  data: function () {
    return {
      gameModes: require('../data/gameModes.json'),
      text: require('../lang/GameModes.json')
    }
  },
  methods: {
    gameModeClickHandler (gameMode) {
      for (const [key, value] of Object.entries(gameMode)) {
        this.$store.state.guessModule.gameOptions[key] = value
      }

      this.$store.state.guessModule.gameState.resetPokemonFromGameMode = true
      router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom-elements {
  margin-top: 0;
}

.game-modes {
  max-width: 1200px;
  list-style-type: none;
  padding: 15px;
  max-height: 80vh;
  overflow: auto;
  margin: 20px auto 0 auto;

  @media (min-width: 720px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  li > div {
    display: grid;
    grid-template-columns: 1fr 2fr;
    width: 100%;
    background-color: transparent;
    border: 3px solid var(--theme-color);
    color: var(--theme-color);
    padding: 0;
    border-radius: 10px;
    font-size: 20px;
    margin-bottom: 20px;
    text-align: left;
    cursor: pointer;
    transition: transform 0.25s ease-in-out;

    &:hover {
      transform: scale(1.025);
    }

    h3 {
      font-size: 18px;
    }

    p {
      font-size: 16px;
      hyphens: auto;
    }

    .icon {
      position: relative;

      svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80px;
        height: auto;
      }
    }
  }

  .description {
    hyphens: auto;
    padding: 0 15px;
  }
}

svg {
  * {
    fill: var(--theme-color);
  }
}
</style>
