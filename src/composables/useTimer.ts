import Timer from '../shared/timer'
import { secondToAngle } from '../shared/util'

export function useTimer({ timeRangeData }: any) {
  const timer = new Timer({
    stepCallbacks: () => {
      timeRangeData.angle =
        timeRangeData.angleOnFly - secondToAngle(1, timeRangeData.unitAngle)
      timeRangeData.angleOnFly = timeRangeData.angle
    },
  })

  return { timer }
}
