import { ClientPos } from './'
import { ref } from 'vue'

export function useRotate({ getAngleToTimeRangeCenter, moveAngleOnFly }: any) {
  let startAngle = 0
  let angleChange = 0
  let rotating = ref(false)

  function readyRotate(clientPos: ClientPos, callback: Function): void {
    rotating.value = true
    startAngle = getAngleToTimeRangeCenter(clientPos)
    callback()
  }

  function rotate(clientPos: ClientPos): void {
    if (!rotating.value) {
      return
    }

    const currentAngle = getAngleToTimeRangeCenter(clientPos)

    angleChange = currentAngle - startAngle
    angleChange < 0 && (angleChange += 360)

    moveAngleOnFly(angleChange)
  }

  function stopRotate(callback: Function): void {
    if (!rotating.value) {
      return
    }

    rotating.value = false
    callback()
  }

  return {
    rotating,
    readyRotate,
    rotate,
    stopRotate,
  }
}
