import { ClientPos } from '.'
import { State } from '.'
import { minuteToAngle } from '../shared/util'

export function useEventHandler({ state, tomato }: any) {
  const dblclickHandler = (): void => {
    if (state.isReady() || state.isFinished()) {
      tomato.pickSingleTomato()
      state.run()
      return
    }

    state.isRunning() ? state.pause() : state.run()
  }

  return {
    dblclickHandler,
  }
}
