import { formatMinute, angleToMinute } from '../shared/util'
import { computed } from 'vue'
import { ClientPos } from './'

export function useRotate({
  getAngleOnFly,
  timeRangeInfo,
  timer,
  timeRange,
  calculateMouseOffsetAngleToCenter,
  setPointerAngle,
  pointerPlateInfo,
}: any) {
  let _startAngle = 0
  let _rotation = 0
  const time = computed(() =>
    angleToMinute(getAngleOnFly(), timeRangeInfo.pointOffsetAngle)
  )
  const paddedTime = computed(() => formatMinute(time.value))

  function readyRotate(clientPos: ClientPos): void {
    timer.pause()
    _startAngle = calculateMouseOffsetAngleToCenter(
      clientPos,
      timeRange.value as Element
    )
    pointerPlateInfo.active = true
  }

  function rotate(clientPos: ClientPos): void {
    if (!pointerPlateInfo.active) {
      return
    }

    const currentAngle = calculateMouseOffsetAngleToCenter(
      clientPos,
      timeRange.value as Element
    )

    _rotation = currentAngle - _startAngle
    _rotation < 0 && (_rotation += 360)

    setPointerAngle(_rotation)
  }

  function stopRotate(): void {
    timeRangeInfo.angle = getAngleOnFly()
    pointerPlateInfo.active = false
    startTimer(angleToMinute(getAngleOnFly(), timeRangeInfo.pointOffsetAngle))
  }

  function startTimer(time: number) {
    timer.setRange(0, time * 60).start()
  }

  return {
    readyRotate,
    rotate,
    stopRotate,
    paddedTime,
    time,
  }
}
