<template>
  <div
    class="
      time-range-plate
      absolute
      w-full
      h-full
      rounded-full
      top-0
      right-0
      bottom-0
      left-0
      m-auto
      flex
      justify-center
      items-center
      overflow-hidden
    "
  >
    <div ref="timeRangeElRef" class="time-range w-3/4 h-3/4 rounded-full">
      <div
        v-for="{ minute, primary, text, textVisible, angle } in timeRangePoints"
        :key="minute"
        class="absolute top-0 left-1/2 w-1/100 flex justify-center"
        :class="[
          `${primary ? 'w-1/100' : 'w-1/200'}`,
          `${primary ? 'h-1/24' : 'h-1/48'}`,
          `${
            minute <= timeRangeTime
              ? 'bg-yellow-300'
              : minute === SINGLE_DURATION
              ? 'bg-secondary-light'
              : 'bg-neutral'
          }`,
        ]"
        :style="[
          `transform-origin: center ${timeRangeRadius}px`,
          `transform: translateX(-50%) rotate(${360 - angle}deg)`,
        ]"
      >
        <div
          class="
            flex
            justify-center
            absolute
            -top-7
            sm:-top-10
            text-neutral-lighter
            font-bold
            text-lg
            sm:text-2xl
            select-none
          "
          :class="[
            `${
              minute <= timeRangeTime
                ? 'text-yellow-300'
                : minute === SINGLE_DURATION
                ? 'text-secondary-light'
                : 'text-neutral'
            }`,
          ]"
          :style="`transform: rotate(${angle - timeRangeAngle}deg)`"
        >
          {{ textVisible ? text : '' }}
        </div>
      </div>
    </div>
    <div
      ref="timeRangeInteractionElRef"
      class="mask absolute w-full h-full rounded-full cursor-grab"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  import { inject } from 'vue'
  import { TimeRange, Tomato } from '../composables'

  const { timeRange } = defineProps<{
    timeRange: TimeRange
  }>()
  const tomato = inject('tomato') as Tomato

  const {
    timeRangeElRef,
    timeRangeInteractionElRef,
    points: timeRangePoints,
    radius: timeRangeRadius,
    angle: timeRangeAngle,
    time: timeRangeTime,
  } = timeRange
  const { SINGLE_DURATION } = tomato.config
</script>
