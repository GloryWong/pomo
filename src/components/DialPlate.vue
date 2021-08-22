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
      <div ref="timeRangeElRef" class="time-range w-3/4 h-3/4 rounded-full">
        <div
          v-for="{
            minute,
            primary,
            text,
            textVisible,
            angle,
          } in timeRangePoints"
          :key="minute"
          class="absolute top-0 left-1/2 w-1/100 flex justify-center"
          :class="[
            `${primary ? 'w-1/100' : 'w-1/200'}`,
            `${primary ? 'h-1/24' : 'h-1/48'}`,
            `${
              minute === tomato.config.SINGLE_DURATION
                ? 'bg-yellow-500'
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
                minute === tomato.config.SINGLE_DURATION
                  ? 'text-yellow-300'
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
      <div
        class="
          time-text
          text-neutral-light text-4xl
          sm:text-5xl
          select-none
          transition
          duration-500
        "
      >
        {{ pointerPlateData.timeText }}
      </div>
      <div
        class="
          state-text
          text-neutral-light text-4xl
          sm:text-5xl
          select-none
          transition
          duration-500
        "
      >
        {{ pointerPlateData.stateText }}
      </div>
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
  import {
    useState,
    useDialPlate,
    usePointerPlate,
    useTimeRange,
    useSound,
    useEventHandler,
    useWinResizeObserver,
    useTomato,
  } from '../composables'

  const winResizeObserver = useWinResizeObserver()

  const tomato = useTomato()

  const state = useState()

  const { size: dialPlateSize } = useDialPlate({
    winResizeObserver,
  })

  const timeRange = useTimeRange({
    winResizeObserver,
    state,
    tomato,
  })
  const {
    timeRangeElRef,
    timeRangeInteractionElRef,
    points: timeRangePoints,
    radius: timeRangeRadius,
    angle: timeRangeAngle,
  } = timeRange

  const { pointerPlate, data: pointerPlateData } = usePointerPlate({
    winResizeObserver,
    state,
    timeRange,
  })

  const { dblclickHandler } = useEventHandler({
    timeRange,
    pointerPlateData,
    state,
    tomato,
  })

  useSound({
    timeRange,
    state,
  })
</script>
