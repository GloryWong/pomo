<template>
  <div
    ref="pointerPlateElRef"
    class="
      pointer-plate
      w-3/5
      h-3/5
      rounded-full
      absolute
      top-0
      right-0
      bottom-0
      left-0
      m-auto
      flex
      justify-center
      items-center
      flex-col
      border-2 border-gray-900 border-opacity-10
      shadow-tomato-line
      bg-tomato-pointer-plate-radial-gradient
    "
  >
    <div
      class="
        pointer
        w-0
        h-0
        border-8
        border-b-15
        border-t-10
        border-neutral-lighter
        border-l-transparent
        border-r-transparent
        border-t-transparent
        absolute
        top-0
        left-1/2
      "
      :style="`transform-origin: center ${pointerPlateData.radius}px; transform: translateX(-50%)`"
    ></div>
    <div class="desciption text-neutral-light text-1xl sm:text-2xl select-none">
      {{ pointerPlateData.description }}
    </div>
    <div
      class="
        time-text
        text-neutral-light text-4xl
        mt-1
        sm:mt-3 sm:text-5xl
        select-none
        transition
        duration-500
      "
    >
      {{ pointerPlateData.timeText }}
    </div>
    <TomatoPlate />
    <!-- <div
        class="
          state-text
          text-neutral-light text-2xl
          sm:text-3xl
          select-none
          transition
          duration-500
        "
      >
        {{ pointerPlateData.stateText }}
      </div> -->
    <div
      class="
        mask
        absolute
        rounded-full
        w-full
        h-full
        flex
        justify-center
        items-center
        cursor-pointer
      "
      @dblclick.prevent="dblclickHandler"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  import { defineProps, inject } from 'vue'
  import TomatoPlate from './TomatoPlate.vue'
  import { PointerPlate, useEventHandler, State, Tomato } from '../composables'

  const { pointerPlate } = defineProps<{
    pointerPlate: PointerPlate
  }>()
  const { pointerPlateElRef, data: pointerPlateData } = pointerPlate

  const state = inject('state') as State
  const tomato = inject('tomato') as Tomato

  const { dblclickHandler } = useEventHandler({
    state,
    tomato,
  })
</script>
