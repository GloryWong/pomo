import { ref, readonly, watch } from 'vue'

export enum StateValue {
  READY = 1,
  RUNNING,
  PAUSED,
  FINISHED,
}

export const COOL_STATE = new Set([StateValue.READY, StateValue.FINISHED])
export const HOT_STATE = new Set([StateValue.RUNNING, StateValue.PAUSED])

export function useState() {
  const core = ref(StateValue.READY)
  const hotToggled = ref(false)

  const ready = () => {
    if (isReady()) return
    core.value = StateValue.READY
  }

  const isReady = () => core.value === StateValue.READY

  const run = () => {
    if (isRunning()) return
    core.value = StateValue.RUNNING
  }

  const isRunning = () => core.value === StateValue.RUNNING

  const pause = () => {
    if (!isRunning()) return
    core.value = StateValue.PAUSED
  }

  const isPaused = () => core.value === StateValue.PAUSED

  const finish = () => {
    core.value = StateValue.FINISHED
  }

  const isFinished = () => core.value === StateValue.FINISHED

  /**
   * Check if in cool state. cool: `ready` or `finished`
   */
  const isCool = () => COOL_STATE.has(core.value)

  /**
   * Check if in hot state. hot: `running` or `paused`
   */
  const isHot = () => HOT_STATE.has(core.value)

  /**
   * Toggle state between `running` and `paused`
   */
  const toggleHot = () => {
    if (!isHot()) return

    if (isRunning()) {
      pause()
    } else {
      run()
    }
  }

  /**
   * Check if state was just toggled in hot, namely between `running` and `paused`
   */
  const isHotToggled = () => hotToggled.value

  watch(core, (newVal, oldVal) => {
    const hotState = new Set([StateValue.RUNNING, StateValue.PAUSED])
    if (hotState.has(newVal) && hotState.has(oldVal)) {
      hotToggled.value = true
    }
  })

  return {
    core: readonly(core),
    ready,
    isReady,
    run,
    isRunning,
    pause,
    isPaused,
    finish,
    isFinished,
    isCool,
    isHot,
    toggleHot,
    isHotToggled,
  }
}

export type State = ReturnType<typeof useState>
