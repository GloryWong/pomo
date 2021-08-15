import Timer from '../shared/timer'
import { secondToAngle } from '../shared/util'
import { watch } from 'vue'

export function useTimer({ timeRangeData, state, stateOperations }: any) {
  const timer = new Timer({
    stepCallbacks: () => {
      timeRangeData.angle =
        timeRangeData.angleOnFly - secondToAngle(1, timeRangeData.unitAngle)
      timeRangeData.angleOnFly = timeRangeData.angle
    },
  })

  watch(state, () => {
    if (stateOperations.isPaused()) {
      timer.pause()
      return
    }

    if (stateOperations.isRunning()) {
      timer.setRange(0, timeRangeData.pointOnFly * 60).start()
    }
  })
}
