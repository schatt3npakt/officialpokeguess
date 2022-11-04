<template>
  <div class="options">
    <Layer direction="rtl" :is-closing="isClosing" :is-open="isOpen">
      <div class="headline" :class="{'small': isSmallHeadline}">
        <span v-if="inputValue">Hi, {{inputValue}}!</span>
        <span v-else>Hi!</span>
      </div>

      <div class="options__inner">
        <div class="options__name-wrapper">
          <div>
            <p class="label">{{ text.name[language] }}</p>

            <input @keyup.enter="commitOptions" @keyup="playTypingHandler" v-model="inputValue"  type="text" :placeholder="text.namePlaceholder[language]"/>
          </div>

          <div>
            <Toggle
              @click.native="showNameBelowClockClickHandler"
              :toggle-label="text.showNameBelowClock[language]"
              :is-on="showNameBelowClockIsActive"
            />
          </div>
        </div>

        <div>
          <p class="label">{{ text.favoriteColor[language] }}</p>

          <div class="color-picker" :class="{gameboy: gameBoyModeIsActive}">
            <div
              @click="setColor(color)"
              @mouseenter="playRolloverHandler()"
              v-for="color in colors"
              :key="color"
              :class="{active: color === currentColor}"
              :style="{'background-color': color}"></div>
          </div>
        </div>

        <div class="toggle-container">
          <Toggle
            @click.native="gameBoyModeClickHandler"
            :toggle-label="text.gameBoyMode[language]"
            :is-on="gameBoyModeIsActive"
          />

          <Toggle
            @click.native="enableAudioClickHandler"
            :toggle-label="text.enableAudio[language]"
            :is-on="enableAudioIsActive"
          />
        </div>

        <div class="language-selects" :class="{gameboy: gameBoyModeIsActive}">
          <p class="label">{{ text.lang[language] }}</p>

          <div class="languages">
            <button
              v-for="lang in languages"
              @mouseenter="playRolloverHandler()"
              @click="langClickHandler(lang.name)"
              :key="lang.id"
              :class="constructLanguageClass(lang.name)"
            >
            </button>
          </div>
        </div>

        <button class="submit enable" @click="this.commitOptions">{{ text.save[language] }}</button>

        <div class="disclaimer">
          <div>
            {{ text.disclaimer[language] }} <br><br>
            <a href="https://twitter.com/thebitheart" target="_blank" rel="noopener noreferrer">@bitheart</a><br><br>
          </div>

          <div>
            <a href="https://bitheart.de/imprint/" target="_blank">
              <img class="logo" src="/img/logo.png" alt="">
            </a>
          </div>
        </div>
      </div>
    </Layer>
  </div>
</template>

<script>
import Layer from '@/components/Layer/Layer'
import Toggle from '@/components/Atoms/Toggle'
import { playToggleOnSound, playRolloverSound, playTypingSound, playConfirmSound } from '../AudioService'
import { Howler } from 'howler'

export default {
  components: {
    Layer,
    Toggle
  },
  computed: {
    language () {
      return this.$store.state.language
    },
    isDay () {
      return JSON.parse(this.$store.state.isDay)
    },
    isSmallHeadline () {
      return this.inputValue.length >= 5
    },
    gameBoyModeIsActive () {
      return this.$store.state.gameBoyModeIsActive
    },
    enableAudioIsActive () {
      return this.$store.state.enableAudioIsActive
    },
    showNameBelowClockIsActive () {
      return this.$store.state.showUserNameBelowClock === 'true'
    },
    isOpen () {
      return this.$store.state.optionsIsOpen
    }
  },
  data: function () {
    return {
      isClosing: false,
      currentColor: this.$store.state.themeColor,
      colors: [
        '#00b894',
        '#00cec9',
        '#0984e3',
        '#6c5ce7',
        '#fdcb6e',
        '#e17055',
        '#d63031',
        '#f24e4f',
        '#e84393',
        '#fd79a8'
      ],
      languages: [
        { id: 0, name: 'en' },
        { id: 1, name: 'de' },
        { id: 2, name: 'fr' }
      ],
      inputValue: this.$store.state.userName,
      text: require('../lang/Options.json')
    }
  },
  methods: {
    constructLanguageClass (lang) {
      if (lang === this.$store.state.language) {
        return lang + ' active'
      } else {
        return lang
      }
    },
    playRolloverHandler () {
      playRolloverSound()
    },
    playTypingHandler () {
      playTypingSound()
    },
    gameBoyModeClickHandler () {
      this.$store.state.gameBoyModeIsActive = !this.$store.state.gameBoyModeIsActive

      if (this.$store.state.gameBoyModeIsActive) {
        localStorage.setItem('gameBoyModeIsActive', 'true')
        document.documentElement.style.setProperty('--theme-color', '#081820')
        if (this.isDay) {
          document.documentElement.style.setProperty('--contrast-color', '#346856')
        } else {
          document.documentElement.style.setProperty('--contrast-color', '#89C070')
        }
      } else {
        localStorage.setItem('gameBoyModeIsActive', 'false')
        if (this.isDay) {
          document.documentElement.style.setProperty('--contrast-color', '#ffffff')
        } else {
          document.documentElement.style.setProperty('--contrast-color', '#2D3436')
        }
        document.documentElement.style.setProperty('--theme-color', this.currentColor)
      }
    },
    enableAudioClickHandler () {
      this.$store.state.enableAudioIsActive = !this.$store.state.enableAudioIsActive

      if (this.$store.state.enableAudioIsActive) {
        Howler.mute(false)
      } else {
        Howler.mute(true)
      }
    },
    showNameBelowClockClickHandler () {
      if (this.$store.state.showUserNameBelowClock === 'true') {
        this.$store.state.showUserNameBelowClock = 'false'
        localStorage.setItem('showUserNameBelowClock', 'false')
      } else {
        this.$store.state.showUserNameBelowClock = 'true'
        localStorage.setItem('showUserNameBelowClock', 'true')
      }
    },
    langClickHandler (lang) {
      this.$store.commit('setLanguage', lang)
      playToggleOnSound()
    },
    setColor (color) {
      this.$store.state.gameBoyModeIsActive = false
      if (this.isDay) {
        document.documentElement.style.setProperty('--contrast-color', '#ffffff')
      } else {
        document.documentElement.style.setProperty('--contrast-color', '#2D3436')
      }
      document.querySelector('meta[name="theme-color"]').setAttribute('content', color)
      document.documentElement.style.setProperty('--theme-color', color)
      this.currentColor = color
      playToggleOnSound()
    },
    commitOptions () {
      this.$store.commit('setThemeColor', this.currentColor)
      this.$store.commit('setUsername', this.inputValue)
      localStorage.setItem('themeColor', this.currentColor)
      localStorage.setItem('userName', this.inputValue)
      localStorage.setItem('language', this.$store.state.language)
      playConfirmSound()

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

      this.$store.commit('setOptionsIsOpen', false)
      this.isClosing = true
      this.$store.commit('resetPokemon', false)

      // Set language programatically
      document.documentElement.setAttribute('lang', this.$store.state.language)

      window.setTimeout(() => {
        this.isClosing = false
      }, 800)
    }
  },
  mounted () {
    Howler.mute(true)

    if (!this.$store.state.gameBoyModeIsActive) {
      this.setColor(this.currentColor)
    } else {
      if (this.isDay) {
        document.documentElement.style.setProperty('--contrast-color', '#346856')
      } else {
        document.documentElement.style.setProperty('--contrast-color', '#89C070')
      }
      document.documentElement.style.setProperty('--theme-color', '#081820')
    }
  },
  name: 'Options'
}
</script>

<style lang="scss" scoped>
.options {
  z-index: 7;

  &__inner {
    max-width: 720px;
    margin: auto;

    > * {
      font-weight: 600;
      margin-bottom: 30px;

      @media (min-width: 720px) {
        margin-bottom: 60px;
      }
    }
  }

  .layer__overlay {
    z-index: 8;
  }

  .headline {
    color: var(--theme-color);
    font-size: 50px;
    font-weight: 600;
    line-height: 70px;
    margin-bottom: 80px;
    position: relative;
    text-align: center;
    transition: color 0.25s ease-out;

    @media (min-width: 720px) {
      font-size: 70px;
    }

    &.small {
      font-size: 35px;

      @media (min-width: 720px) {
        font-size: 60px;
      }
    }
  }

  .label {
    display: block;
    color: var(--theme-color);
    font-size: 16px;
    margin-bottom: 5px;

    @media (min-width: 720px) {
      margin-bottom: 10px;
      margin-top: 0;
    }

    a {
      color: var(--contrast-color) !important;
    }
  }

  .color-picker {
    display: flex;
    flex-flow: row wrap;
    gap: 10px;

    @media (min-width: 720px) {
      gap: 20px;
    }

    &:hover {
      div {
        &:not(:hover) {
          opacity: 0.5;
        }
      }
    }

    &:not(:hover) {
      div {
        &:not(.active) {
          opacity: 0.5;
        }
      }
    }

    div {
      cursor: pointer;
      display: block;
      background-color: red;
      box-shadow: none;
      height: 35px;
      width: 35px;
      border-radius: 5px;
      transition: transform 0.25s ease-out, opacity 0.25s ease-out;
      transform: scale(1);

      @media (min-width: 720px) {
        border-radius: 10px;
        height: 50px;
        width: 50px;
      }

      &.active {
        transform: scale(1.1);
      }

      &:hover {
        transform: scale(1.1);
      }
    }

    &.gameboy {
      div {
        filter: grayscale(100%);
        mix-blend-mode: multiply;
      }
    }
  }

  input {
    background-color: var(--theme-color);
    border: none;
    border-radius: 15px;
    color: var(--contrast-color);
    font-size: 18px;
    padding: 15px;
    transform: scale(1);
    width: 100%;
    transition: background-color 0.25s ease-out;
    font-weight: 600;

    &::placeholder {
      color: var(--contrast-color);
    }

    &:focus,
    &:hover {
      border: none;
      box-shadow: none;
      outline: none;
    }
  }

  .submit {
    cursor: pointer;
    background-color: var(--theme-color);
    border: none;
    border-radius: 15px;
    color: var(--contrast-color);
    font-weight: 600;;
    font-size: 18px;
    padding: 15px;
    transform: scale(0);
    width: 100%;
    margin-top: 20px;
    transition: background-color 0.25s ease-out;

    &:focus,
    &:hover {
      border: none;
      box-shadow: none;
      outline: none;
    }

    &.enable {
      animation: pop-in 0.25s ease forwards;
    }
  }

  .language-selects {
    .languages {
      display: flex;
      justify-content: center;
    }

    &:hover {
      button {
        &:hover {
          opacity: 1 !important;
        }

        &:not(:hover) {
          opacity: 0.5;
        }
      }
    }

    button {
      background-color: transparent;
      border: none;
      cursor: pointer;
      display: block;
      box-shadow: none;
      height: 28px;
      width: 28px;
      border-radius: 5px;
      transition: transform 0.25s ease-out, opacity 0.25s ease-out;
      transform: scale(1);

      @media (min-width: 720px) {
        border-radius: 10px;
        height: 50px;
        width: 50px;
      }

      &.active {
        transform: scale(1.1);
      }

      &:not(.active) {
        opacity: 0.5;
      }

      &:hover {
        transform: scale(1.1);
      }

      &:not(:last-child) {
        margin-right: 20px;

        @media (min-width: 720px) {
          margin-right: 50px;
        }
      }

      &.de {
        background-image: url('/img/icons/de.svg');
        background-size: cover;
        background-position: center center;
      }

      &.en {
        background-image: url('/img/icons/en.svg');
        background-size: cover;
        background-position: center center;
      }

      &.fr {
        background-image: url('/img/icons/fr.png');
        background-size: cover;
        background-position: center center;
      }
    }

    &.gameboy {
      button {
        filter: grayscale(100%);
        mix-blend-mode: multiply;
      }
    }
  }

  &__name-wrapper {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 10px;

    @media (min-width: 720px) {
      grid-template-columns: 2fr 1fr;
    }
  }
}

.disclaimer {
  display: grid;
  color: var(--theme-color);
  font-weight: 600;
  font-size: 18px;
  text-align: center;

  @media (min-width: 720px) {
    text-align: left;
    grid-template-columns: 1fr 1fr;
  }

  * {
    color: var(--theme-color);
  }
}

.logo {
  display: block;
  margin: auto;
  max-width: 100px;
}

.toggle-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

@keyframes pop-in {
  from { transform: scale(0)}
  to { transform: scale(1)}
}
</style>
