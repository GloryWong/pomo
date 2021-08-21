import { ref, watchEffect } from 'vue'

type Callback = (windowInnerWidth: number, windowInnerHeight: number) => void

export function useWinResizeObserver() {
  const windowInnerWidth = ref(0)
  const windowInnerHeight = ref(0)
  const callbacks = new Set<Callback>()

  window.addEventListener('resize', () => {
    windowInnerWidth.value = window.innerWidth
    windowInnerHeight.value = window.innerHeight
  })

  watchEffect(() => {
    const h = windowInnerHeight.value
    const w = windowInnerWidth.value
    callbacks.forEach((cb) => cb(w, h))
  })

  const winResizeObserver = {
    register: (callback: Callback) => {
      callbacks.add(callback)
      callback(window.innerWidth, window.innerHeight)
    },
  }

  return winResizeObserver
}
