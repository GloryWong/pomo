import { ref, readonly } from 'vue'

export enum State {
  READY = 1,
  RUNNING,
  PAUSED,
  FINISHED,
}

export function useState() {
  const core = ref(State.READY)

  const isReady = (checkedStateValue?: State) =>
    checkedStateValue
      ? checkedStateValue === State.READY
      : core.value === State.READY

  const run = () => {
    if (isRunning()) return
    core.value = State.RUNNING
  }

  const isRunning = (checkedStateValue?: State) =>
    checkedStateValue
      ? checkedStateValue === State.RUNNING
      : core.value === State.RUNNING

  const pause = () => {
    if (!isRunning()) return
    core.value = State.PAUSED
  }

  const isPaused = (checkedStateValue?: State) =>
    checkedStateValue
      ? checkedStateValue === State.PAUSED
      : core.value === State.PAUSED

  const finish = () => {
    core.value = State.FINISHED
  }

  const isFinished = (checkedStateValue?: State) =>
    checkedStateValue
      ? checkedStateValue === State.FINISHED
      : core.value === State.FINISHED

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
