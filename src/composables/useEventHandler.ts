import { ClientPos } from '.'
import { State } from '.'
import { minuteToAngle } from '../shared/util'

export function useEventHandler({ stateOperations, tomato }: any) {
  const dblclickHandler = (): void => {
    if (stateOperations.isReady() || stateOperations.isFinished()) {
      tomato.methods.pickSingleTomato()
      stateOperations.run()
      return
    }

    stateOperations.isRunning()
      ? stateOperations.pause()
      : stateOperations.run()
  }

  return {
    dblclickHandler,
  }
}
