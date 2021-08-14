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
    "
    :style="`width: ${dialPlateSize}px; height: ${dialPlateSize}px;`"
  >
    <div
      ref="timeRange"
      class="
        time-range
        absolute
        w-3/4
        h-3/4
        rounded-full
        absolute
        top-0
        right-0
        bottom-0
        left-0
        m-auto
      "
      :style="{
        transform: `rotate(${getAngleOnFly()}deg`,
      }"
    >
      <div
        v-for="{ time, angle, primary, timeVisible } in timeRangeInfo.points"
        :key="time"
        class="absolute top-0 left-1/2 w-1/100 flex justify-center"
        :class="[
          `${primary ? 'w-1/100' : 'w-1/200'}`,
          `${primary ? 'h-1/24' : 'h-1/48'}`,
          `${angle === getAngleOnFly() ? 'bg-neutral' : 'bg-neutral-lighter'}`,
        ]"
        :style="[
          `transform-origin: center ${timeRangeInfo.radius}px`,
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
          "
          :style="`transform: rotate(${angle - getAngleOnFly()}deg)`"
        >
          {{ timeVisible ? time : '' }}
        </div>
      </div>
    </div>
    <div
      ref="pointerPlate"
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
        :style="`transform-origin: center ${pointerPlateInfo.radius}px; transform: translateX(-50%)`"
      ></div>
      <div class="time-box text-neutral-light text-4xl sm:text-5xl">
        {{ paddedTime.minutes }} : {{ paddedTime.seconds }}
      </div>
    </div>
    <div
      class="mask absolute w-full h-full rounded-full cursor-pointer"
      @mousedown.prevent="mousedownHandler"
      @mousemove.prevent="mousemoveHandler"
      @mouseup.prevent="mouseupHandler"
      @mouseout.prevent="mouseoutHandler"
      @touchstart.prevent="touchstartHandler"
      @touchmove.prevent="touchmoveHandler"
      @touchend.prevent="touchendHandler"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import {
    useDialPlate,
    useTimer,
    usePointerPlate,
    useTimeRange,
    useSound,
    useRotate,
    useEventHandler,
  } from '../composables'

  const { dialPlateSize, getAngleOnFly, setAngleOnFly } = useDialPlate()
  const { pointerPlate, pointerPlateInfo } = usePointerPlate()
  const {
    timeRange,
    timeRangeInfo,
    calculateMouseOffsetAngleToCenter,
    setPointerAngle,
  } = useTimeRange({
    setAngleOnFly,
  })
  const { timer } = useTimer({
    timeRangeInfo,
    getAngleOnFly,
    setAngleOnFly,
  })

  const { readyRotate, rotate, stopRotate, paddedTime, time } = useRotate({
    getAngleOnFly,
    timeRangeInfo,
    timer,
    timeRange,
    calculateMouseOffsetAngleToCenter,
    setPointerAngle,
    pointerPlateInfo,
  })

  const {
    mousedownHandler,
    mousemoveHandler,
    mouseupHandler,
    mouseoutHandler,
    touchstartHandler,
    touchmoveHandler,
    touchendHandler,
  } = useEventHandler({
    readyRotate,
    rotate,
    stopRotate,
  })

  useSound({
    time,
    pointerPlateInfo,
  })

  onMounted(() => {
    setAngleOnFly(timeRangeInfo.angle)
  })
</script>
