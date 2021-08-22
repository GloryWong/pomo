import { ref, readonly } from 'vue'

export enum StateValue {
  READY = 1,
  RUNNING,
  PAUSED,
  FINISHED,
}

export function useState() {
  const core = ref(StateValue.READY)

  const isReady = (checkedStateValue?: StateValue) =>
    checkedStateValue
      ? checkedStateValue === StateValue.READY
      : core.value === StateValue.READY

  const run = () => {
    if (isRunning()) return
    core.value = StateValue.RUNNING
  }

  const isRunning = (checkedStateValue?: StateValue) =>
    checkedStateValue
      ? checkedStateValue === StateValue.RUNNING
      : core.value === StateValue.RUNNING

  const pause = () => {
    if (!isRunning()) return
    core.value = StateValue.PAUSED
  }

  const isPaused = (checkedStateValue?: StateValue) =>
    checkedStateValue
      ? checkedStateValue === StateValue.PAUSED
      : core.value === StateValue.PAUSED

  const finish = () => {
    core.value = StateValue.FINISHED
  }

  const isFinished = (checkedStateValue?: StateValue) =>
    checkedStateValue
      ? checkedStateValue === StateValue.FINISHED
      : core.value === StateValue.FINISHED

  return {
    core: readonly(core),
    isReady,
    run,
    isRunning,
    pause,
    isPaused,
    finish,
    isFinished,
  }
}

export type State = ReturnType<typeof useState>
