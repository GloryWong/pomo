import { ref, reactive, onMounted } from 'vue'

export function usePointerPlate({ winResizeObserver }: any) {
  const pointerPlate = ref<unknown>(null)
  const data = reactive({
    size: 0,
    radius: 0,
  })

  onMounted(() => {
    winResizeObserver.register(() => {
      const { width } = (pointerPlate.value as Element).getBoundingClientRect()
      data.size = width
      data.radius = width / 2
    })
  })

  return {
    pointerPlate,
    data,
  }
}
