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
        w-5/6
        h-5/6
        rounded-full
        absolute
        top-0
        right-0
        bottom-0
        left-0
        m-auto
      "
    >
      <div
        v-for="{ time, angle, primary, timeVisible } in timeRangeInfo.points"
        :key="time"
        class="absolute top-0 left-1/2 w-1/100 flex justify-center"
        :class="[
          `${primary ? 'w-1/100' : 'w-1/200'}`,
          `${primary ? 'h-1/24' : 'h-1/48'}`,
          `${angle === _angle ? 'bg-neutral' : 'bg-neutral-lighter'}`,
        ]"
        :style="[
          `transform-origin: center ${timeRangeInfo.radius}px`,
          `transform: translateX(-50%) rotate(${angle}deg)`,
        ]"
      >
        <div
          class="
            flex
            justify-center
            absolute
            -top-9
            text-neutral-lighter
            font-black
            text-2xl
          "
          :style="`transform: rotate(${-angle}deg)`"
        >
          {{ timeVisible ? time : '' }}
        </div>
      </div>
    </div>
    <div
      ref="pointerPlate"
      class="
        pointer-plate
        w-2/3
        h-2/3
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
        :style="`transform-origin: center ${pointerPlateInfo.radius}px; transform: translateX(-50%) rotate(${_angle}deg)`"
      ></div>
      <div class="time-box text-3xl text-neutral-light">
        {{ paddedTime.minutes }} : {{ paddedTime.seconds }}
      </div>
    </div>
    <div
      class="mask absolute w-full h-full rounded-full"
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

<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'DialPlate',
  })
</script>

<script lang="ts" setup>
  import { onMounted, ref, watch, reactive, computed } from 'vue'
  import {
    initTimeRangeInfo,
    calculateMouseOffsetAngleToCenter,
    ClientPos,
  } from './timeRange'
  import { initPointerPlateInfo } from './pointerPlate'
  import Timer from './timer'
  import * as Tone from 'tone'

  let dialPlateSize = Math.min(window.innerWidth, window.innerHeight) * 0.8
  let MAX_SIZE = 570
  dialPlateSize = Math.min(dialPlateSize, MAX_SIZE)

  const timeRange = ref<unknown>(null)
  const timeRangeInfo = reactive({
    points: [] as any[],
    pointRange: {
      min: 0,
      max: 60,
    },
    radius: 0,
    pointOffsetAngle: 0,
    maxRotation: 0,
  })

  const pointerPlate = ref<unknown>(null)
  const pointerPlateInfo = reactive({
    active: false,
    angle: 0,
    radius: 0,
  })

  onMounted(() => {
    initTimeRangeInfo(timeRange.value as Element, timeRangeInfo)
    initPointerPlateInfo(pointerPlate.value as Element, pointerPlateInfo)
  })

  ///// event handlers

  const mousedownHandler = (event: MouseEvent): void => {
    readyRotate({
      clientX: event.clientX,
      clientY: event.clientY,
    })
  }

  const mousemoveHandler = (event: MouseEvent): void => {
    rotate({
      clientX: event.clientX,
      clientY: event.clientY,
    })
  }

  const mouseupHandler = (event: MouseEvent): void => {
    stopRotate()
  }
  const mouseoutHandler = mouseupHandler

  const touchstartHandler = (event: TouchEvent): void => {
    const touch = event.targetTouches[0]
    readyRotate({
      clientX: touch.clientX,
      clientY: touch.clientY,
    })
  }

  const touchmoveHandler = (event: TouchEvent): void => {
    const touch = event.targetTouches[0]
    rotate({
      clientX: touch.clientX,
      clientY: touch.clientY,
    })
  }

  const touchendHandler = (event: TouchEvent): void => {
    stopRotate()
  }
  const touchcancelHandler = touchendHandler

  ///// methods

  import { roundAngle, formatMinute } from '../shared/util'
  let _startAngle = 0
  let _angle = ref(pointerPlateInfo.angle)
  let _rotation = 0
  const time = computed(() => angleToMinute(_angle.value))
  const paddedTime = computed(() => formatMinute(time.value))
  const timer = new Timer({
    stepCallbacks: () => {
      pointerPlateInfo.angle = _angle.value = _angle.value - secondToAngle(1)
    },
  })

  function angleToMinute(angle: number): number {
    return angle / timeRangeInfo.pointOffsetAngle
  }

  function secondToAngle(second: number): number {
    return (timeRangeInfo.pointOffsetAngle / 60) * second
  }

  function readyRotate(clientPos: ClientPos): void {
    timer.pause()
    _startAngle = calculateMouseOffsetAngleToCenter(
      clientPos,
      timeRange.value as Element
    )
    pointerPlateInfo.active = true
  }

  function rotate(clientPos: ClientPos): void {
    if (!pointerPlateInfo.active) {
      return
    }

    const currentAngle = calculateMouseOffsetAngleToCenter(
      clientPos,
      timeRange.value as Element
    )

    _rotation = currentAngle - _startAngle
    _rotation < 0 && (_rotation += 360)

    setPointerAngle(_rotation)
  }

  function stopRotate(): void {
    pointerPlateInfo.angle = _angle.value
    pointerPlateInfo.active = false
    startTimer(angleToMinute(_angle.value))
  }

  /// Timer ///

  function startTimer(time: number) {
    timer.setRange(0, time * 60).start()
  }

  function setPointerAngle(angleChange: number) {
    let angle = roundAngle(
      pointerPlateInfo.angle + angleChange,
      timeRangeInfo.pointOffsetAngle
    )
    angle > 360 && (angle -= 360)

    _angle.value = angle
  }

  /// sounds ///
  const synth = new Tone.Synth().toDestination()
  watch(_angle, (value) => {
    const note = pointerPlateInfo.active
      ? `C${Math.floor(angleToMinute(value) / 10) + 2}`
      : 'A2'
    synth.triggerAttackRelease(note, '32n')
  })
</script>
