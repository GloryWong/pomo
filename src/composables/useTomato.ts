import { toRefs, ref, readonly } from 'vue'

// duration unit: minute
export function useTomato() {
  const CYCLE_NUMBER = ref(4)
  const SINGLE_DURATION = ref(25)
  const SHORT_BREAK_DURATION = ref(5)
  const LONG_BREAK_DURATION = ref(30)

  const singleTomatoPicked = ref(false)

  const pickSingleTomato = () => (singleTomatoPicked.value = true)
  const isSingleTomatoPicked = () => singleTomatoPicked.value
  const consumePickedSingleTomato = () => (singleTomatoPicked.value = false)

  return {
    config: readonly({
      CYCLE_NUMBER,
      SINGLE_DURATION,
      SHORT_BREAK_DURATION,
      LONG_BREAK_DURATION,
    }),
    singleTomatoPicked: readonly(singleTomatoPicked),
    pickSingleTomato,
    isSingleTomatoPicked,
    consumePickedSingleTomato,
  }
}
