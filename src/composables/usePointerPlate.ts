import { ref, reactive, onMounted, watch, watchEffect } from 'vue'
import { TimeRange, WinResizeObserver, State, Tomato } from '.'

type Options = {
  winResizeObserver: WinResizeObserver
  state: State
  timeRange: TimeRange
  tomato: Tomato
}

export function usePointerPlate({
  winResizeObserver,
  state,
  timeRange,
  tomato,
}: Options) {
  const pointerPlateElRef = ref<unknown>(null)
  const data = reactive({
    size: 0,
    radius: 0,
    timeText: '',
    timeTextVisible: true,
    stateText: '',
    stateTextVisible: false,
    description: '',
  })

  onMounted(() => {
    winResizeObserver.register(() => {
      const { width } = (
        pointerPlateElRef.value as HTMLElement
      ).getBoundingClientRect()
      data.size = width
      data.radius = width / 2
    })
  })

  watch(timeRange.paddedTime, ({ minutes, seconds }) => {
    data.timeText = `${minutes} : ${seconds}`
  })

  watchEffect(() => {
    state.core
    if (state.isReady()) {
      data.stateText = 'READY'
      return
    }

    if (state.isRunning()) {
      data.stateText = 'RUNNING'
      return
    }

    if (state.isPaused()) {
      data.stateText = 'PAUSED'
      return
    }

    if (state.isFinished()) {
      data.stateText = 'FINISHED'
      return
    }
  })

  watchEffect(() => {
    let description = 'Double Click'
    state.core
    if (tomato.springQueueRunning.value) {
      if (tomato.activeSpring.value) {
        description = 'Tomato Consuming'
        state.isPaused() && (description = 'Tomato Paused')

        if (tomato.isActiveShortBreakSpring()) {
          description = 'Short Break'
          state.isPaused() && (description = 'Short Break Paused')
        }
        if (tomato.isActiveLongBreakSpring()) {
          description = 'Long Break'
          state.isPaused() && (description = 'Long Break Paused')
        }

        timeRange.dragRotating.value && (description = 'Time Adjusting')
      }
    } else {
      if (timeRange.dragRotating.value) {
        description = 'Time Selecting'
      }
      if (state.isRunning()) {
        description = 'Double Click To Pause'
      }
      if (state.isPaused()) {
        description = 'Double Click To Resume'
      }
    }

    data.description = description
  })

  return {
    pointerPlateElRef,
    data,
  }
}

export type PointerPlate = ReturnType<typeof usePointerPlate>
