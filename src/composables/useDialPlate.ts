import { ref } from 'vue'

export enum State {
  READY = 1,
  RUNNING,
  PAUSED,
  FINISHED,
}

export function useDialPlate({ winResizeObserver }: any) {
  const MAX_SIZE = 750 // pixel
  const PROPORTION_TO_CONTAINER = 0.9
  const size = ref(0)
  const state = ref(State.READY)

  winResizeObserver.register((innerWidth: number, innerHeight: number) => {
    let _size = Math.min(innerWidth, innerHeight) * PROPORTION_TO_CONTAINER
    size.value = Math.min(_size, MAX_SIZE)
  })

  const isReady = (checkedStateValue?: State) =>
    checkedStateValue
      ? checkedStateValue === State.READY
      : state.value === State.READY

  const run = () => {
    if (isRunning()) return
    state.value = State.RUNNING
  }

  const isRunning = (checkedStateValue?: State) =>
    checkedStateValue
      ? checkedStateValue === State.RUNNING
      : state.value === State.RUNNING

  const pause = () => {
    if (!isRunning()) return
    state.value = State.PAUSED
  }

  const isPaused = (checkedStateValue?: State) =>
    checkedStateValue
      ? checkedStateValue === State.PAUSED
      : state.value === State.PAUSED

  const finish = () => {
    state.value = State.FINISHED
  }

  const isFinished = (checkedStateValue?: State) =>
    checkedStateValue
      ? checkedStateValue === State.FINISHED
      : state.value === State.FINISHED

  const stateOperations = {
    isReady,
    run,
    isRunning,
    pause,
    isPaused,
    finish,
    isFinished,
  }

  return {
    size,
    state,
    stateOperations,
  }
}
