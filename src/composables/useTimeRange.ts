import {
  ref,
  reactive,
  onMounted,
  computed,
  watch,
  readonly,
  toRefs,
  Ref,
} from 'vue'
import {
  angleToMinute,
  formatMinute,
  minuteToAngle,
  secondToAngle,
} from '../shared/util'
import { DragRotation2d } from '../shared/DragRotation2d'
import { AutoRotation2d } from '../shared/AutoRotation2d'
import { WinResizeObserver, State, Tomato } from '.'

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

type Options = {
  winResizeObserver: WinResizeObserver
  state: State
  tomato: Tomato
}

/**
 * TimeRange
 * time unit: minute
 */
export function useTimeRange({ winResizeObserver, state, tomato }: Options) {
  const timeRangeElRef = ref<unknown>(null)
  const timeRangeInteractionElRef = ref<unknown>(null)
  let $timeRangeEl: HTMLElement
  let $timeRangeInteractionEl: HTMLElement

  const points = ref<TimePoint[]>([])
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
      points.value.push({
        minute: i,
        angle: unitAngle.value * i,
        primary: i % 5 === 0,
        text: String(i),
        textVisible: i !== max && i % 5 === 0,
      })
    }
  }

  const createAutoRotation2d = () =>
    new AutoRotation2d($timeRangeEl, {
      initialAngle: angle.value,
      stepAngle: secondToAngle(1, unitAngle.value),
      callbackCollection: {
        readyRotate: ({ rotating }) => {
          autoRotating.value = rotating as boolean
          state.run()
        },
        rotate: ({ angle: _angle }) => {
          angle.value = _angle as number
        },
        stopRotate: ({ angle: _angle, rotating }) => {
          autoRotating.value = rotating as boolean
          state.finish()
        },
      },
    })

  const createDragRotation2d = (autoRotation2d: AutoRotation2d) =>
    new DragRotation2d($timeRangeEl, {
      interactionEl: $timeRangeInteractionEl,
      initialAngle: () => angle.value,
      stepAngle: unitAngle.value,
      callbackCollection: {
        readyRotate: ({ rotating }) => {
          dragRotating.value = rotating as boolean
          autoRotation2d.pauseTransition()
        },
        rotate: ({ flyingAngle }) => {
          angle.value = flyingAngle as number
        },
        stopRotate: ({ rotating, angle }) => {
          dragRotating.value = rotating as boolean
          if (!state.isPaused()) {
            autoRotation2d.transitFromTo(angle as number, 0)
          }
        },
      },
    })

  const createTomatoConsumeAutoRotation2d = () =>
    new AutoRotation2d($timeRangeEl, {
      initialAngle: () => angle.value,
    })

  const consumeNextSpring = () => {
    tomato.consumeSpring((spring) => {
      ;(tomatoConsumeAutoRotation2d.value as AutoRotation2d).transitTo(
        minuteToAngle(spring.duration, unitAngle.value),
        {
          speed: 800,
        }
      )
    })
  }

  onMounted(() => {
    $timeRangeEl = timeRangeElRef.value as HTMLElement
    $timeRangeInteractionEl = timeRangeInteractionElRef.value as HTMLElement

    winResizeObserver.register(() => {
      const { left, top, width, height } = $timeRangeEl.getBoundingClientRect()
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
    tomatoConsumeAutoRotation2d.value =
      createTomatoConsumeAutoRotation2d().addCallbacks({
        stopRotate({ angle: _angle }) {
          angle.value = _angle as number
          ;(autoRotation2d.value as AutoRotation2d).transitFromTo(
            angle.value,
            0
          )
        },
      })

    autoRotation2d.value.addCallbacks({
      stopRotate: () => {
        if (tomato.springQueueRunning.value) {
          consumeNextSpring()
        }
      },
    })
  })

  watch(tomato.springQueueRunning, (value) => {
    if (value && tomatoConsumeAutoRotation2d.value) {
      consumeNextSpring()
    }
  })

  watch(state.core, () => {
    if (!autoRotation2d.value || !dragRotation2d.value) return

    if (state.isHotToggled()) {
      if (state.isPaused()) {
        autoRotation2d.value.pauseTransition()
      } else {
        autoRotation2d.value.transitFromTo(angle.value, 0)
      }
    }
  })

  return {
    timeRangeElRef,
    timeRangeInteractionElRef,

    points,
    radius,
    angle,
    time,
    paddedTime,
    dragRotating,
    autoRotating,
  }
}

export type TimeRange = ReturnType<typeof useTimeRange>
