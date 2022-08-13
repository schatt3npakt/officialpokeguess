import TimeService from '@/TimeService'

class GeoService {
  initialConfig (store) {
    const date = new Date()
    const hours = this.padWithZero(date.getHours())
    const minutes = this.padWithZero(date.getMinutes())

    store.commit('setMinutes', minutes)
    store.commit('setHours', hours)
  }

  padWithZero (number) {
    return ('0' + number).slice(-2)
  }

  setLocation (store) {
    this.initialConfig(store)

    TimeService.setTime(store)
  }
}

export default new GeoService()
