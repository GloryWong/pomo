import { reactive, ref, readonly } from 'vue'

// duration unit: minute
export function useTomato() {
  const CYCLE_NUMBER = readonly(ref(4))
  const SINGLE_DURATION = readonly(ref(25))
  const SHORT_BREAK_DURATION = readonly(ref(5))
  const LONG_BREAK_DURATION = readonly(ref(30))

  const singleTomatoPicked = ref(false)

  const pickSingleTomato = () => (singleTomatoPicked.value = true)
  const isSingleTomatoPicked = () => singleTomatoPicked.value
  const consumePickedSingleTomato = () => (singleTomatoPicked.value = false)

  const config = reactive({
    CYCLE_NUMBER,
    SINGLE_DURATION,
    SHORT_BREAK_DURATION,
    LONG_BREAK_DURATION,
  })

  const data = reactive({
    singleTomatoPicked,
  })

  const methods = {
    pickSingleTomato,
    isSingleTomatoPicked,
    consumePickedSingleTomato,
  }

  return {
    config,
    methods,
  }
}
