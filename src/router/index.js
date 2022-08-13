import Vue from 'vue'
import VueRouter from 'vue-router'
import Guess from '../views/Guess.vue'

Vue.use(VueRouter)

const routes = [
  {
    icon: 'home',
    path: '/',
    name: '',
    component: Guess
  },
  {
    icon: 'playerData',
    path: '/player',
    name: '',
    component: () => import('../views/PlayerData.vue')
  },
  {
    icon: 'pokeDex',
    path: '/pokedex',
    name: '',
    component: () => import('../views/Pokedex.vue')
  },
  {
    icon: 'pokeDex',
    path: '/gamemodes',
    name: '',
    component: () => import('../views/GameModes.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
