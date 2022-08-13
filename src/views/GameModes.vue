<template>
  <div class="inner">
    <div class="bottom-elements">
      <ul class="game-modes">
        <li>
          <div>
            <div class="icon">
              <img src="https://via.placeholder.com/90" alt="">
            </div>

            <div>
              <h3>Ein Game Mode</h3>

              <p>Ein game Mode, so halbschwer.</p>
            </div>
          </div>
        </li>

        <li>
          <div>
            <div class="icon">
              <img src="https://via.placeholder.com/90" alt="">
            </div>

            <div>
              <h3>Ein Game Mode</h3>

              <p>Ein game Mode, so halbschwer.</p>
            </div>
          </div>
        </li>

        <li>
          <div>
            <div class="icon">
              <img src="https://via.placeholder.com/90" alt="">
            </div>

            <div>
              <h3>Ein Game Mode</h3>

              <p>Ein game Mode, so halbschwer.</p>
            </div>
          </div>
        </li>

        <li>
          <div>
            <div class="icon">
              <img src="https://via.placeholder.com/90" alt="">
            </div>

            <div>
              <h3>Ein Game Mode</h3>

              <p>Ein game Mode, so halbschwer.</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  }
}
</script>

<style lang="scss" scoped>
.game-modes {
  max-width: 720px;
  list-style-type: none;
  padding: 0 15px;
  max-height: 80vh;
  overflow: auto;

  li > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    background-color: transparent;
    border: 1px solid var(--theme-color);
    color: var(--theme-color);
    padding: 10px;
    border-radius: 10px;
    font-size: 20px;
    margin-bottom: 20px;
    text-align: left;

    h3 {
      font-size: 18px;
    }

    p {
      font-size: 16px;
      font-weight: normal;
      hyphens: auto;
    }

    .icon {
      position: relative;

      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%)
      }
    }
  }
}
</style>
