import { reactive, ref } from 'vue'

export const initTimeRangeInfo = ($tr: Element, tr: any) => {
  const { width } = $tr.getBoundingClientRect()

  const ave = 360 / tr.pointRange.max - tr.pointRange.min
  for (let i = tr.pointRange.min; i <= tr.pointRange.max; i++) {
    tr.points.push({
      time: i,
      angle: ave * i,
      primary: i % 5 === 0,
      timeVisible: i !== tr.pointRange.max && i % 5 === 0,
    })
  }

  tr.pointOffsetAngle = ave
  tr.maxRotation = tr.points[tr.pointRange.max].angle
  tr.radius = width / 2
}

export const getTimeRangeCenterPos = ($tr: Element) => {
  const { left, top, width, height } = $tr.getBoundingClientRect()

  return {
    x: left + width / 2,
    y: top + height / 2,
  }
}

export interface ClientPos {
  clientX: number
  clientY: number
}

export const calculateMouseOffsetAngleToCenter = (
  clientPos: ClientPos,
  $tr: Element
): number => {
  const R2D = 180 / Math.PI
  const centerPos = getTimeRangeCenterPos($tr)
  const x = clientPos.clientX - centerPos.x
  const y = clientPos.clientY - centerPos.y
  let angle = R2D * Math.atan2(y, x)

  // convert to css coordination system
  angle += 90
  angle < 0 && (angle += 360)

  return angle
}
