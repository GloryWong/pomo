import { ref, reactive, onMounted, watch } from 'vue'

export function usePointerPlate({
  winResizeObserver,
  state,
  stateOperations,
  timeRangeData,
}: any) {
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

  watch(
    () => timeRangeData.paddedTime,
    ({ minutes, seconds }) => {
      data.timeText = `${minutes} : ${seconds}`
    }
  )

  watch(state, () => {
    if (stateOperations.isRunning()) {
      data.stateText = 'RUNNING'
    }

    if (stateOperations.isPaused()) {
      data.stateText = 'PAUSED'
    }

    if (stateOperations.isFinished()) {
      data.stateText = 'FINISHED'
    }
  })

  return {
    pointerPlate,
    data,
  }
}
