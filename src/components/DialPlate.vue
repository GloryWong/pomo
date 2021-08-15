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
          v-for="{
            text,
            minute,
            angle,
            primary,
            textVisible,
          } in timeRangeData.points"
          :key="minute"
          class="absolute top-0 left-1/2 w-1/100 flex justify-center"
          :class="[
            `${primary ? 'w-1/100' : 'w-1/200'}`,
            `${primary ? 'h-1/24' : 'h-1/48'}`,
            `${minute === singleDuration ? 'bg-yellow-500' : 'bg-neutral'}`,
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
            :class="[
              `${
                minute === singleDuration ? 'text-yellow-300' : 'text-neutral'
              }`,
            ]"
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
      <transition
        enter-from-class="opacity-0 translate-y-0"
        enter-to-class="opacity-1 -translate-y-2"
        leave-from-class="opacity-1 -translate-y-2"
        leave-to-class="opacity-0 translate-y-0"
      >
        <div
          class="
            time-text
            text-neutral-light text-4xl
            sm:text-5xl
            select-none
            transition
            duration-500
          "
          v-show="!stateOperations.isPaused()"
        >
          {{ pointerPlateData.timeText }}
        </div>
      </transition>
      <transition
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-1 translate-y-0"
        leave-from-class="opacity-1 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          class="
            state-text
            text-neutral-light text-4xl
            sm:text-5xl
            select-none
            transition
            duration-500
          "
          v-show="stateOperations.isPaused()"
        >
          {{ pointerPlateData.stateText }}
        </div>
      </transition>
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
    useTomato,
  } from '../composables'

  const { winResizeObserver } = useWinResizeObserver()

  const { cycleNumber, singleDuration, shortBreakDuration, longBreakDuration } =
    useTomato()

  const {
    size: dialPlateSize,
    state,
    stateOperations,
  } = useDialPlate({
    winResizeObserver,
  })

  const {
    timeRange,
    data: timeRangeData,
    getAngleToTimeRangeCenter,
    moveAngleOnFly,
    moveAngleOnFlyWithTransition,
    landAngleOnFly,
  } = useTimeRange({
    winResizeObserver,
  })

  const { pointerPlate, data: pointerPlateData } = usePointerPlate({
    winResizeObserver,
    state,
    stateOperations,
    timeRangeData,
  })

  useTimer({
    timeRangeData,
    state,
    stateOperations,
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
    dblclickHandler,
    touchstartHandler,
    touchmoveHandler,
    touchendHandler,
  } = useEventHandler({
    timeRangeData,
    singleDuration,
    moveAngleOnFlyWithTransition,
    landAngleOnFly,
    pointerPlateData,
    readyRotate,
    rotate,
    stopRotate,
    state,
    stateOperations,
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
