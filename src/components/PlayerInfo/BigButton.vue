<template>
  <button class="button">
    {{ buttonText }}
  </button>
</template>

<script>
export default {
  name: 'BigButton',
  props: {
    buttonText: String
  }
}
</script>

<style scoped lang="scss">
.button {
  display: block;
  cursor: pointer;
  background-color: var(--theme-color);
  border: none;
  border-radius: 15px;
  color: var(--contrast-color);
  font-size: 18px;
  padding: 15px;
  width: 100%;
  transition: background-color 0.25s ease-out;
  max-width: 480px;
  margin: 20px auto 0 auto;
  font-weight: 600;;

  &:focus,
  &:hover {
    border: none;
    box-shadow: none;
    outline: none;
  }
}
</style>
