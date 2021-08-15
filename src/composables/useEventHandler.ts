import { ClientPos } from '.'
import { State } from '.'
import { secondToAngle } from '../shared/util'

export function useEventHandler({
  timeRangeData,
  singleDuration,
  landAngleOnFly,
  readyRotate,
  rotate,
  stopRotate,
  state,
  stateOperations,
}: any) {
  let prevState: State

  const _readyRotate = (clientPos: ClientPos) => {
    readyRotate(clientPos, () => {
      prevState = state.value
      stateOperations.pause()
    })
  }

  const _stopRotate = () => {
    stopRotate(() => {
      landAngleOnFly()

      if (!stateOperations.isPaused(prevState)) {
        stateOperations.run()
      }
    })
  }

  const mousedownHandler = (event: MouseEvent): void => {
    _readyRotate({
      clientX: event.clientX,
      clientY: event.clientY,
    })
  }

  const mousemoveHandler = (event: MouseEvent): void => {
    rotate({
      clientX: event.clientX,
      clientY: event.clientY,
    })
  }

  const mouseupHandler = (event: MouseEvent): void => {
    _stopRotate()
  }
  const mouseoutHandler = mouseupHandler

  const dblclickHandler = (): void => {
    if (stateOperations.isReady() || stateOperations.isFinished()) {
      timeRangeData.angleOnFly = secondToAngle(
        singleDuration.value * 60,
        timeRangeData.unitAngle
      )
      landAngleOnFly()
      stateOperations.run()
      return
    }

    stateOperations.isRunning()
      ? stateOperations.pause()
      : stateOperations.run()
  }

  const touchstartHandler = (event: TouchEvent): void => {
    const touch = event.targetTouches[0]
    _readyRotate({
      clientX: touch.clientX,
      clientY: touch.clientY,
    })
  }

  const touchmoveHandler = (event: TouchEvent): void => {
    const touch = event.targetTouches[0]
    rotate({
      clientX: touch.clientX,
      clientY: touch.clientY,
    })
  }

  const touchendHandler = (event: TouchEvent): void => {
    _stopRotate()
  }
  const touchcancelHandler = touchendHandler

  return {
    mousedownHandler,
    mousemoveHandler,
    mouseupHandler,
    mouseoutHandler,
    dblclickHandler,
    touchstartHandler,
    touchmoveHandler,
    touchendHandler,
    touchcancelHandler,
  }
}
