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
      class="
        time-range-plate
        absolute
        w-full
        h-full
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
        overflow-hidden
      "
    >
      <div
        ref="timeRange"
        class="time-range w-3/4 h-3/4 rounded-full"
        :style="{
          transform: `rotate(${timeRangeData.angleOnFly}deg`,
        }"
      >
        <div
          v-for="{ text, angle, primary, textVisible } in timeRangeData.points"
          :key="angle"
          class="absolute top-0 left-1/2 w-1/100 flex justify-center"
          :class="[
            `${primary ? 'w-1/100' : 'w-1/200'}`,
            `${primary ? 'h-1/24' : 'h-1/48'}`,
            `${
              angle === timeRangeData.angleOnFly
                ? 'bg-neutral'
                : 'bg-neutral-lighter'
            }`,
          ]"
          :style="[
            `transform-origin: center ${timeRangeData.radius}px`,
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
            :style="`transform: rotate(${angle - timeRangeData.angleOnFly}deg)`"
          >
            {{ textVisible ? text : '' }}
          </div>
        </div>
      </div>
      <div
        class="mask absolute w-full h-full rounded-full cursor-grab"
        @mousedown.prevent="mousedownHandler"
        @mousemove.prevent="mousemoveHandler"
        @mouseup.prevent="mouseupHandler"
        @mouseout.prevent="mouseoutHandler"
        @touchstart.prevent="touchstartHandler"
        @touchmove.prevent="touchmoveHandler"
        @touchend.prevent="touchendHandler"
      ></div>
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
        :style="`transform-origin: center ${pointerPlateData.radius}px; transform: translateX(-50%)`"
      ></div>
      <div class="time-box text-neutral-light text-4xl sm:text-5xl">
        {{ timeRangeData.paddedTime.minutes }} :
        {{ timeRangeData.paddedTime.seconds }}
      </div>
    </div>
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
    useWinResizeObserver,
  } from '../composables'

  const { winResizeObserver } = useWinResizeObserver()
  const { size: dialPlateSize } = useDialPlate({
    winResizeObserver,
  })
  const { pointerPlate, data: pointerPlateData } = usePointerPlate({
    winResizeObserver,
  })
  const {
    timeRange,
    data: timeRangeData,
    getAngleToTimeRangeCenter,
    moveAngleOnFly,
    landAngleOnFly,
  } = useTimeRange({
    winResizeObserver,
  })
  const { timer } = useTimer({
    timeRangeData,
  })

  const { readyRotate, rotate, stopRotate, rotating } = useRotate({
    timeRangeData,
    getAngleToTimeRangeCenter,
    moveAngleOnFly,
    pointerPlateData,
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
    timer,
    landAngleOnFly,
    timeRangeData,
    pointerPlateData,
    readyRotate,
    rotate,
    stopRotate,
  })

  useSound({
    timeRangeData,
    pointerPlateData,
    rotating,
  })

  onMounted(() => {
    timeRangeData.angleOnFly = timeRangeData.angle
  })
</script>
