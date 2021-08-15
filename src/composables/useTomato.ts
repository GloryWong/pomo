import { ref } from 'vue'

// duration unit: minute
export function useTomato() {
  const cycleNumber = ref(4)
  const singleDuration = ref(25)
  const shortBreakDuration = ref(5)
  const longBreakDuration = ref(30)

  return {
    cycleNumber,
    singleDuration,
    shortBreakDuration,
    longBreakDuration,
  }
}
