export function useEventHandler({ readyRotate, rotate, stopRotate }: any) {
  const mousedownHandler = (event: MouseEvent): void => {
    readyRotate({
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
    stopRotate()
  }
  const mouseoutHandler = mouseupHandler

  const touchstartHandler = (event: TouchEvent): void => {
    const touch = event.targetTouches[0]
    readyRotate({
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
    stopRotate()
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
