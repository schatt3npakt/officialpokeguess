import Vue from 'vue'
import Vuex from 'vuex'
import { guessModule } from './guess'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    autoDayTime: localStorage.getItem('isAutoDayTime') || false,
    hours: '00',
    isDay: localStorage.getItem('dayTime') || false,
    isNight: false,
    language: localStorage.getItem('language') || 'de',
    latitude: '51.4556',
    longitude: '7.0116',
    gameBoyModeIsActive: JSON.parse(localStorage.getItem('gameBoyModeIsActive')) || false,
    menuIsOpen: false,
    minutes: '00',
    moodClass: '',
    moodSpritePath: '',
    gameOptionsIsOpen: false,
    gameSupportIsOpen: false,
    optionsIsOpen: !localStorage.getItem('userName'),
    themeColor: localStorage.getItem('themeColor') || '#00b894',
    userName: localStorage.getItem('userName') || '',
    showUserNameBelowClock: localStorage.getItem('showUserNameBelowClock') || 'true',
    weatherDescription: '',
    weatherIcon: '',
    weatherTemp: ''
  },
  mutations: {
    setLanguage (state, language) {
      state.language = language
      localStorage.setItem('language', language)
    },
    setHours (state, hours) {
      state.hours = hours
    },
    setMinutes (state, minutes) {
      state.minutes = minutes
    },
    setAutoDayTime (state, autoDayTime) {
      state.autoDayTime = autoDayTime

      const autoDayTimeString = autoDayTime.toString()
      localStorage.setItem('isAutoDayTime', autoDayTimeString)
    },
    setIsDay (state, isDay) {
      state.isDay = isDay

      const dayTimeString = isDay.toString()
      localStorage.setItem('dayTime', dayTimeString)

      if (state.gameBoyModeIsActive) {
        document.documentElement.style.setProperty('--theme-color', '#081820')
        if (state.isDay) {
          document.documentElement.style.setProperty('--contrast-color', '#346856')
        } else {
          document.documentElement.style.setProperty('--contrast-color', '#89C070')
        }
        return false
      } else {
        if (isDay) {
          document.documentElement.style.setProperty('--contrast-color', '#ffffff')
        } else {
          document.documentElement.style.setProperty('--contrast-color', '#2D3436')
        }
      }
    },
    setIsNight (state, isNight) {
      state.isNight = isNight
    },
    setMoodClass (state, className) {
      state.moodClass = className
    },
    setMoodSpritePath (state, spritepath) {
      state.moodSpritePath = spritepath
    },
    setThemeColor (state, themecolor) {
      state.themeColor = '#' + themecolor
    },
    setUsername (state, username) {
      state.userName = username
    },
    setWeatherDescription (state, weatherDescription) {
      state.weatherDescription = weatherDescription
    },
    setWeatherIcon (state, weatherIcon) {
      state.weatherIcon = weatherIcon
    },
    setWeatherTemp (state, weatherTemp) {
      state.weatherTemp = weatherTemp
    },
    setLat (state, lat) {
      state.latitude = lat
    },
    setLng (state, lng) {
      state.longitude = lng
    },
    setOptionsIsOpen (state, isOpen) {
      state.optionsIsOpen = isOpen
    }
  },
  actions: {
  },
  modules: {
    guessModule
  }
})
