import { ref, reactive, onMounted, computed, watchEffect } from 'vue'
import { roundAngle, angleToMinute, formatMinute } from '../shared/util'

export type ClientPos = {
  clientX: number
  clientY: number
}

export type TimePoint = {
  minute: number
  angle: number
  primary: boolean
  text: string
  textVisible: boolean
}

export function useTimeRange({ winResizeObserver }: any) {
  const timeRange = ref<unknown>(null)
  let $timeRange: HTMLElement

  const points = reactive([] as TimePoint[])
  const range = {
    min: 0,
    max: 60,
  }
  const radius = ref(0)
  const unitAngle = ref(0)
  const angle = ref(0)
  const size = ref(0)
  const centerPos = ref<ClientPos>({
    clientX: 0,
    clientY: 0,
  })
  const angleOnFly = ref(0)
  const pointOnFly = computed(() =>
    angleToMinute(angleOnFly.value, unitAngle.value)
  )
  const paddedTime = computed(() => formatMinute(pointOnFly.value))

  const createPoints = () => {
    const { min, max } = range

    for (let i = min; i <= max; i++) {
      points.push({
        minute: i,
        angle: unitAngle.value * i,
        primary: i % 5 === 0,
        text: String(i),
        textVisible: i !== max && i % 5 === 0,
      })
    }
  }

  const getAngleToTimeRangeCenter = (clientPos: ClientPos): number => {
    const R2D = 180 / Math.PI
    const x = clientPos.clientX - centerPos.value.clientX
    const y = clientPos.clientY - centerPos.value.clientY
    let _angle = R2D * Math.atan2(y, x)

    // convert to css coordination system
    _angle += 90
    _angle < 0 && (_angle += 360)

    return _angle
  }

  const moveAngleOnFly = (angleChange: number): void => {
    let _angleOnFly = roundAngle(angle.value + angleChange, unitAngle.value)
    _angleOnFly > 360 && (_angleOnFly -= 360)

    angleOnFly.value = _angleOnFly
  }

  const moveAngleOnFlyWithTransition = (
    angleChange: number,
    callback: Function
  ) => {
    let steps = angleChange / unitAngle.value

    let count = 0
    const id = setInterval(() => {
      if (steps-- < 0) {
        clearInterval(id)
        callback()
        return
      }

      moveAngleOnFly(unitAngle.value * count++)
    }, 20)
  }

  const landAngleOnFly = () => {
    angle.value = angleOnFly.value
  }

  onMounted(() => {
    $timeRange = timeRange.value as HTMLElement
    winResizeObserver.register(() => {
      const { left, top, width, height } = $timeRange.getBoundingClientRect()
      size.value = width
      radius.value = size.value / 2
      centerPos.value = { clientX: left + width / 2, clientY: top + height / 2 }
    })

    unitAngle.value = 360 / (range.max - range.min)
    createPoints()
  })

  const data = reactive({
    points,
    radius,
    unitAngle,
    angle,
    size,
    angleOnFly,
    pointOnFly,
    paddedTime,
  })

  return {
    timeRange,
    data,
    getAngleToTimeRangeCenter,
    moveAngleOnFly,
    moveAngleOnFlyWithTransition,
    landAngleOnFly,
  }
}
