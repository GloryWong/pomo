import { ClientPos } from '.'
import { State, Tomato } from '.'
import { minuteToAngle } from '../shared/util'

type Options = {
  state: State
  tomato: Tomato
}

export function useEventHandler({ state, tomato }: Options) {
  const dblclickHandler = (): void => {
    if (state.isCool()) {
      tomato.runSpringQueue()
    } else {
      state.toggleHot()
    }
  }

  return {
    dblclickHandler,
  }
}

export type EventHandler = ReturnType<typeof useEventHandler>
