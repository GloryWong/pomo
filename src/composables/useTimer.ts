import Timer from '../shared/timer'
import { secondToAngle } from '../shared/util'

export function useTimer({ timeRangeInfo, getAngleOnFly, setAngleOnFly }: any) {
  const timer = new Timer({
    stepCallbacks: () => {
      timeRangeInfo.angle =
        getAngleOnFly() - secondToAngle(1, timeRangeInfo.pointOffsetAngle)
      setAngleOnFly(timeRangeInfo.angle)
    },
  })

  return { timer }
}
