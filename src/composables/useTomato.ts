import { toRefs, ref, readonly, Ref, onMounted, computed } from 'vue'

enum SpringType {
  TOMATO = 0,
  SHORT_BREAK,
  LONG_BREAK,
}
class Spring {
  private static uid = 0
  uid: number
  duration: number
  type: SpringType = SpringType.TOMATO
  constructor(duration: number, type?: SpringType) {
    this.uid = Spring.uid++
    this.duration = duration
    type && (this.type = type)
  }
}

class Queue<T> {
  protected readonly queue: Ref<Array<T>> = ref([])
  constructor() {}

  enqueue(element: T) {
    this.queue.value.unshift(element)
    return this
  }

  dequeue() {
    return this.queue.value.pop()
  }

  size() {
    return this.queue.value.length
  }

  isEmpty() {
    return this.queue.value.length === 0
  }

  get all() {
    return this.queue
  }
}

class SpringQueue extends Queue<Spring> {
  get allTomato() {
    return computed(() =>
      this.queue.value.filter((v) => v.type === SpringType.TOMATO)
    )
  }

  get allTomatoSize() {
    return computed(() => this.allTomato.value.length)
  }
}

// duration unit: minute
export function useTomato() {
  const CYCLE_NUMBER = ref(4)
  const SINGLE_DURATION = ref(25)
  const SHORT_BREAK_DURATION = ref(5)
  const LONG_BREAK_DURATION = ref(30)

  // spring queue
  const springQueue = new SpringQueue()
  const fillSpringQueue = () => {
    for (let i = 0; i < CYCLE_NUMBER.value; i++) {
      springQueue
        .enqueue(new Spring(SINGLE_DURATION.value, SpringType.TOMATO))
        .enqueue(new Spring(SHORT_BREAK_DURATION.value, SpringType.SHORT_BREAK))
    }
    springQueue.enqueue(
      new Spring(LONG_BREAK_DURATION.value, SpringType.LONG_BREAK)
    )
    return springQueue
  }
  fillSpringQueue()

  const springQueueRunning = ref(false)
  const runSpringQueue = () => (springQueueRunning.value = true)
  const stopSpringQueue = () => (springQueueRunning.value = false)

  let activeSpring = ref<Spring>()
  const isActiveTomatoSpring = () => {
    if (!activeSpring.value) return false
    return activeSpring.value.type === SpringType.TOMATO
  }
  const isActiveShortBreakSpring = () => {
    if (!activeSpring.value) return false
    return activeSpring.value.type === SpringType.SHORT_BREAK
  }
  const isActiveLongBreakSpring = () => {
    if (!activeSpring.value) return false
    return activeSpring.value.type === SpringType.LONG_BREAK
  }
  const consumeSpring = (callback?: (spring: Spring) => void) => {
    if (!springQueueRunning.value) return

    activeSpring.value = springQueue.dequeue()
    if (!activeSpring.value) {
      stopSpringQueue()
      return
    }

    callback && callback(activeSpring.value)
  }

  return {
    config: toRefs(
      readonly({
        CYCLE_NUMBER,
        SINGLE_DURATION,
        SHORT_BREAK_DURATION,
        LONG_BREAK_DURATION,
      })
    ),
    springQueueRunning: readonly(springQueueRunning),
    runSpringQueue,
    stopSpringQueue,
    springQueue,
    activeSpring: readonly(activeSpring),
    consumeSpring,
    isActiveTomatoSpring,
    isActiveShortBreakSpring,
    isActiveLongBreakSpring,
  }
}

export type Tomato = ReturnType<typeof useTomato>
