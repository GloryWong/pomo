import { ref, reactive, onMounted, watch, watchEffect } from 'vue'

export function usePointerPlate({ winResizeObserver, state, timeRange }: any) {
  const pointerPlate = ref<unknown>(null)
  const data = reactive({
    size: 0,
    radius: 0,
    timeText: '',
    timeTextVisible: true,
    stateText: '',
    stateTextVisible: false,
  })

  onMounted(() => {
    winResizeObserver.register(() => {
      const { width } = (
        pointerPlate.value as HTMLElement
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

  return {
    pointerPlate,
    data,
  }
}
