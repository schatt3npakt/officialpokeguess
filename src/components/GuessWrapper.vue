<template>
  <div>
    <GuessGame />

    <OptionsLayer />

    <SupportLayer />
  </div>
</template>

<script>
import GuessGame from '@/components/Guess/GuessGame'
import OptionsLayer from '@/components/Guess/OptionsLayer'
import SupportLayer from '@/components/Guess/SupportLayer'

export default {
  components: {
    GuessGame,
    OptionsLayer,
    SupportLayer
  },
  name: 'GuessWrapper'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
