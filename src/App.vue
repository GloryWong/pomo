<template>
  <ControlPanel />
  <DialPlate />
</template>

<script lang="ts" setup>
  import { provide } from 'vue'
  import ControlPanel from './components/ControlPanel.vue'
  import DialPlate from './components/DialPlate.vue'

  import { useTomato, useState, useWinResizeObserver } from './composables'
  const tomato = useTomato()
  const state = useState()
  const winResizeObserver = useWinResizeObserver()

  provide('tomato', tomato)
  provide('state', state)
  provide('winResizeObserver', winResizeObserver)
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
