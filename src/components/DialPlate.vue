<template>
  <div
    class="
      dial-plate
      bg-primary-light
      rounded-full
      mx-auto
      my-auto
      overflow-hidden
      relative
      bg-tomato-radial-gradient
      shadow-tomato-border
    "
    :style="`width: ${dialPlateSize}px; height: ${dialPlateSize}px;`"
  >
    <TimeRangePlate :timeRange="timeRange" />
    <PointerPlate :pointerPlate="pointerPlate" />
  </div>
</template>

<script lang="ts" setup>
  import TimeRangePlate from './TimeRangePlate.vue'
  import PointerPlate from './PointerPlate.vue'

  import { inject } from 'vue'
  import {
    useDialPlate,
    usePointerPlate,
    useTimeRange,
    useSound,
    Tomato,
    WinResizeObserver,
    State,
  } from '../composables'

  const winResizeObserver = inject('winResizeObserver') as WinResizeObserver
  const tomato = inject('tomato') as Tomato
  const state = inject('state') as State

  const { size: dialPlateSize } = useDialPlate({
    winResizeObserver,
  })

  const timeRange = useTimeRange({
    winResizeObserver,
    state,
    tomato,
  })

  const pointerPlate = usePointerPlate({
    winResizeObserver,
    state,
    timeRange,
    tomato,
  })

  useSound({
    timeRange,
    state,
  })
</script>
