import { ClientPos } from '.'

export function useEventHandler({
  timer,
  landAngleOnFly,
  timeRangeData,
  readyRotate,
  rotate,
  stopRotate,
}: any) {
  const _readyRotate = (clientPos: ClientPos) => {
    readyRotate(clientPos, () => {
      timer.pause()
    })
  }

  const _stopRotate = () => {
    stopRotate(() => {
      landAngleOnFly()
      // Start timer
      timer.setRange(0, timeRangeData.pointOnFly * 60).start()
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
    touchstartHandler,
    touchmoveHandler,
    touchendHandler,
    touchcancelHandler,
  }
}
