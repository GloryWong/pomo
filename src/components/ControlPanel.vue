<template>
  <div class="control-panel">
    <div class="tomato-panel">
      <div class="tomato"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { inject } from 'vue'
  import { useTomatoPanel, Tomato, State } from '../composables'

  const state = inject('state') as State
  const tomato = inject('tomato') as Tomato
  const tomatoPanel = useTomatoPanel({ tomato, state })
</script>
