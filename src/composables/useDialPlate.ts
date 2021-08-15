import { ref } from 'vue'

export function useDialPlate({ winResizeObserver }: any) {
  const MAX_SIZE = 750 // pixel
  const PROPORTION_TO_CONTAINER = 0.9
  const size = ref(0)

  winResizeObserver.register((innerWidth: number, innerHeight: number) => {
    let _size = Math.min(innerWidth, innerHeight) * PROPORTION_TO_CONTAINER
    size.value = Math.min(_size, MAX_SIZE)
  })

  return {
    size,
  }
}
