import { ref, reactive, onMounted } from 'vue'
import { roundAngle } from '../shared/util'

export interface ClientPos {
  clientX: number
  clientY: number
}

export function useTimeRange({ setAngleOnFly }: any) {
  const timeRange = ref<unknown>(null)
  const timeRangeInfo = reactive({
    points: [] as any[],
    pointRange: {
      min: 0,
      max: 60,
    },
    radius: 0,
    pointOffsetAngle: 0,
    maxRotation: 0,
    angle: 0,
  })

  const initTimeRangeInfo = ($tr: Element, tr: any) => {
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

  const getTimeRangeCenterPos = ($tr: Element) => {
    const { left, top, width, height } = $tr.getBoundingClientRect()

    return {
      x: left + width / 2,
      y: top + height / 2,
    }
  }

  const calculateMouseOffsetAngleToCenter = (
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

  const setPointerAngle = (angleChange: number): void => {
    let angle = roundAngle(
      timeRangeInfo.angle + angleChange,
      timeRangeInfo.pointOffsetAngle
    )
    angle > 360 && (angle -= 360)

    setAngleOnFly(angle)
  }

  onMounted(() => {
    initTimeRangeInfo(timeRange.value as Element, timeRangeInfo)
  })

  return {
    timeRange,
    timeRangeInfo,
    getTimeRangeCenterPos,
    calculateMouseOffsetAngleToCenter,
    setPointerAngle,
  }
}
