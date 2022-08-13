<template>
  <div class="inner">
    <div class="bottom-elements player-profile">
      <PlayerData />
    </div>
  </div>
</template>

<script>
import PlayerData from '../components/PlayerData.vue'

export default {
  name: 'App',
  components: {
    PlayerData
  }
}
</script>

<style lang="scss">
.bottom-elements.player-profile {
  height: auto;
  margin: 0;
  width: 100%;
  max-width: none;
}
</style>
