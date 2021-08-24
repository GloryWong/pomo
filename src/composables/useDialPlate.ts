import { ref } from 'vue'
import { WinResizeObserver } from './'

type Options = {
  winResizeObserver: WinResizeObserver
}

export function useDialPlate({ winResizeObserver }: Options) {
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

export type DialPlate = ReturnType<typeof useDialPlate>
