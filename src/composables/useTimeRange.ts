import { ref, reactive, onMounted, computed, watch } from 'vue'
import {
  angleToMinute,
  formatMinute,
  minuteToAngle,
  secondToAngle,
} from '../shared/util'
import { DragRotation2d } from '../shared/DragRotation2d'
import { AutoRotation2d } from '../shared/AutoRotation2d'

export type ClientPos = {
  clientX: number
  clientY: number
}

export type TimePoint = {
  minute: number
  angle: number
  primary: boolean
  text: string
  textVisible: boolean
}

export function useTimeRange({
  winResizeObserver,
  state,
  stateOperations,
  tomato,
}: any) {
  const timeRange = ref<unknown>(null)
  const timeRangeInteraction = ref<unknown>(null)
  let $timeRange: HTMLElement
  let $timeRangeInteraction: HTMLElement

  const points = reactive([] as TimePoint[])
  const range = {
    min: 0,
    max: 60,
  }
  const radius = ref(0)
  const unitAngle = ref(0)
  const angle = ref(0)
  const size = ref(0)
  const centerPos = ref<ClientPos>({
    clientX: 0,
    clientY: 0,
  })
  const time = computed(() => angleToMinute(angle.value, unitAngle.value))
  const paddedTime = computed(() => formatMinute(time.value))
  const dragRotating = ref(false)
  const autoRotating = ref(false)
  const dragRotation2d = ref<DragRotation2d>()
  const autoRotation2d = ref<AutoRotation2d>()
  const tomatoConsumeAutoRotation2d = ref<AutoRotation2d>()

  const createPoints = () => {
    const { min, max } = range

    for (let i = min; i <= max; i++) {
      points.push({
        minute: i,
        angle: unitAngle.value * i,
        primary: i % 5 === 0,
        text: String(i),
        textVisible: i !== max && i % 5 === 0,
      })
    }
  }

  const createAutoRotation2d = () =>
    new AutoRotation2d($timeRange, {
      initialAngle: angle.value,
      stepAngle: secondToAngle(1, unitAngle.value),
      callbackCollection: {
        readyRotate: ({ rotating }) => {
          autoRotating.value = rotating as boolean
        },
        rotate: ({ angle: _angle }) => {
          angle.value = _angle as number
        },
        stopRotate: ({ angle: _angle, rotating }) => {
          autoRotating.value = rotating as boolean
          stateOperations.finish()
        },
      },
    })

  const createDragRotation2d = (autoRotation2d: AutoRotation2d) =>
    new DragRotation2d($timeRange, {
      interactionEl: $timeRangeInteraction,
      initialAngle: angle.value,
      stepAngle: unitAngle.value,
      callbackCollection: {
        readyRotate: ({ rotating }) => {
          dragRotating.value = rotating as boolean
          autoRotation2d.pauseTransition()
        },
        rotate: ({ flyingAngle }) => {
          angle.value = flyingAngle as number
        },
        stopRotate: ({ rotating }) => {
          dragRotating.value = rotating as boolean

          if (
            stateOperations.isReady() ||
            stateOperations.isFinished() ||
            stateOperations.isRunning()
          ) {
            autoRotation2d.transitFromTo(angle.value, 0)
            stateOperations.run()
          }
        },
      },
    })

  const createTomatoConsumeAutoRotation2d = (autoRotation2d: AutoRotation2d) =>
    new AutoRotation2d($timeRange, {
      initialAngle: 0,
      callbackCollection: {
        stopRotate({ angle: _angle }) {
          angle.value = _angle as number
          autoRotation2d.transitFromTo(angle.value, 0)
        },
      },
    })

  onMounted(() => {
    $timeRange = timeRange.value as HTMLElement
    $timeRangeInteraction = timeRangeInteraction.value as HTMLElement

    winResizeObserver.register(() => {
      const { left, top, width, height } = $timeRange.getBoundingClientRect()
      size.value = width
      radius.value = size.value / 2
      centerPos.value = { clientX: left + width / 2, clientY: top + height / 2 }
    })

    unitAngle.value = 360 / (range.max - range.min)
    createPoints()

    // AutoRotation2d
    autoRotation2d.value = createAutoRotation2d()
    // DragRotation2d
    dragRotation2d.value = createDragRotation2d(autoRotation2d.value)
    // Tomato consume AutoRotation2d
    tomatoConsumeAutoRotation2d.value = createTomatoConsumeAutoRotation2d(
      autoRotation2d.value
    )
  })

  watch(state, () => {
    if (!autoRotation2d.value || !dragRotation2d.value) return

    if (stateOperations.isPaused()) {
      autoRotation2d.value.pauseTransition()
      return
    }

    if (stateOperations.isRunning()) {
      // consume single tomato
      if (
        tomato.methods.isSingleTomatoPicked() &&
        tomatoConsumeAutoRotation2d.value
      ) {
        tomatoConsumeAutoRotation2d.value.transitTo(
          minuteToAngle(tomato.config.SINGLE_DURATION, unitAngle.value),
          { speed: 800 }
        )
        tomato.methods.consumePickedSingleTomato()
        return
      }

      autoRotation2d.value.transitFromTo(angle.value, 0)
      return
    }
  })

  const data = reactive({
    points,
    radius,
    unitAngle,
    angle,
    size,
    time,
    paddedTime,
    dragRotating,
    autoRotating,
    dragRotation2d,
    autoRotation2d,
  })

  return {
    timeRange,
    timeRangeInteraction,
    data,
  }
}
