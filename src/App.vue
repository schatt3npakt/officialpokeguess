<template>
  <div id="app" class="app" :class="{day: isDay, gameboy: gameBoyModeIsActive}">
    <div class="update-hint" v-if="updateExists">
      {{text.updateAvailable[language]}}
      <button @click="refreshApp">
        {{text.update[language]}}
      </button>
    </div>

    <Options />

    <Counter />

    <div class="app__inner">
      <div class="router-view-wrapper">
        <router-view/>
      </div>
    </div>

    <Menu />

    <div class="light-mode-toggles">
      <Toggle @click.native="toggleDayTime" :is-on="isDay" type="daytime"/>
    </div>
  </div>
</template>

<script>
import Counter from '@/components/Counter.vue'
import Menu from '@/components/Menu.vue'
import Options from '@/components/Options.vue'
import GeoService from '@/GeoService'
import Toggle from '@/components/Atoms/Toggle'
import update from '@/mixins/update'

const texts = require('./lang/App.json')

export default {
  name: 'App',
  components: {
    Toggle,
    Counter,
    Menu,
    Options
  },
  computed: {
    isDay () {
      return JSON.parse(this.$store.state.isDay)
    },
    language () {
      return this.$store.state.language
    },
    gameBoyModeIsActive () {
      return JSON.parse(this.$store.state.gameBoyModeIsActive)
    }
  },
  data: function () {
    return {
      text: texts
    }
  },
  methods: {
    toggleDayTime () {
      this.$store.commit('setIsDay', !this.isDay)
    }
  },
  mixins: [update],
  mounted: function () {
    GeoService.setLocation(this.$store)

    window.setInterval(() => {
      GeoService.setLocation(this.$store)
    }, 500)

    let link = document.querySelector("link[rel~='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.getElementsByTagName('head')[0].appendChild(link)
    }

    switch (localStorage.getItem('themeColor')) {
      case '#00b894':
        link.href = '/favicon.ico'
        break
      case '#00cec9':
        link.href = '/favicon1.ico'
        break
      case '#0984e3':
        link.href = '/favicon2.ico'
        break
      case '#6c5ce7':
        link.href = '/favicon3.ico'
        break
      case '#fdcb6e':
        link.href = '/favicon4.ico'
        break
      case '#e17055':
        link.href = '/favicon5.ico'
        break
      case '#d63031':
        link.href = '/favicon6.ico'
        break
      case '#e84393':
        link.href = '/favicon7.ico'
        break
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.$store.commit('setIsNight', true)
    } else {
      this.$store.commit('setIsDay', true)
    }
  }
}
</script>

<style lang="scss">
:root {
  --contrast-color: #2D3436;
  --theme-color: #00b894;
  --type-color-normal: #A8A77A;
  --type-color-fighting: #C22E28;
  --type-color-flying: #A98FF3;
  --type-color-poison: #A33EA1;
  --type-color-ground: #E2BF65;
  --type-color-rock: #B6A136;
  --type-color-bug: #A6B91A;
  --type-color-ghost: #735797;
  --type-color-steel: #B7B7CE;
  --type-color-fire: #EE8130;
  --type-color-water: #6390F0;
  --type-color-grass: #7AC74C;
  --type-color-electric: #F7D02C;
  --type-color-psychic: #F95587;
  --type-color-ice: #96D9D6;
  --type-color-dragon: #6F35FC;
  --type-color-dark: #705746;
  --type-color-fairy: #D685AD;
}

body,
html {
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

html {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;900&display=swap');

* {
  box-sizing: border-box;
  font-family: Nunito, sans-serif;
}

* {
  outline: none;
  font-weight: 600;

  &:focus {
    outline: none;
  }
}

.app {
  background-color: var(--contrast-color);
  display: flex;
  flex-direction: column;
  padding: 0px 0px 50px 0px;
  height: 100vh;
  width: 100vw;
  transition: background-color 0.25s ease;

  &__inner {
    height: 100%;
  }

  .update-hint {
    position: fixed;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    background-color: var(--contrast-color);
    border: 2px solid var(--theme-color);
    padding: 20px;
    border-radius: 20px;
    color: var(--theme-color);

    button {
      background-color: var(--theme-color);
      padding: 10px;
      border: none;
      border-radius: 10px;
      color: var(--contrast-color);
      display: inline-block;
      margin-left: 10px;
    }
  }

  .bottom-elements {
    margin-top: auto;
  }

  &.day {
    background-color: var(--contrast-color);
  }

  .router-view-wrapper {
    height: 100%;

    .inner {
      display: flex;
      justify-content: space-between;
      flex-flow: column nowrap;
      height: 100%;
      width: 100%;
    }
  }

  .light-mode-toggles {
    position: fixed;
    top: 15px;
    left: 15px;
  }

  &.gameboy {
    box-shadow: inset 0 0 20px var(--theme-color);

    button.food {
      filter: grayscale(100%);
      mix-blend-mode: multiply
    }

    img {
      mix-blend-mode: multiply;

      &.eevee {
        filter: grayscale(1);
      }
    }
  }
}
</style>
