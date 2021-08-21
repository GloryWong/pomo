import { ref, reactive, onMounted, watch } from 'vue'

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
      const { width } = (pointerPlate.value as Element).getBoundingClientRect()
      data.size = width
      data.radius = width / 2
    })
  })

  watch(timeRange.paddedTime, ({ minutes, seconds }) => {
    data.timeText = `${minutes} : ${seconds}`
  })

  watch(state.core, () => {
    if (state.isRunning()) {
      data.stateText = 'RUNNING'
    }

    if (state.isPaused()) {
      data.stateText = 'PAUSED'
    }

    if (state.isFinished()) {
      data.stateText = 'FINISHED'
    }
  })

  return {
    pointerPlate,
    data,
  }
}
