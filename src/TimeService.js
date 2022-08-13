class TimeService {
  setTime (store) {
    const date = new Date()
    const hours = this.padWithZero(date.getHours())
    const minutes = this.padWithZero(date.getMinutes())

    store.commit('setMinutes', minutes)
    store.commit('setHours', hours)
  }

  padWithZero (number) {
    return ('0' + number).slice(-2)
  }
}

export default new TimeService()
