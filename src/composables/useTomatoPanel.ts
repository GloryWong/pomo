import { computed, readonly, ref, toRefs, watch } from 'vue'
import { Tomato, State } from './'

type Options = {
  tomato: Tomato
  state: State
}

export function useTomatoPanel({ tomato, state }: Options) {
  let {
    CYCLE_NUMBER,
    SINGLE_DURATION,
    SHORT_BREAK_DURATION,
    LONG_BREAK_DURATION,
  } = tomato.config

  const amount = CYCLE_NUMBER

  return {
    amount: readonly(amount),
  }
}

export type TomatoPanelConfig = ReturnType<typeof useTomatoPanel>
