import * as Tone from 'tone'
import { log } from 'tone/build/esm/core/util/Debug'
import { watch } from 'vue'

export function useSound({ timeRange, state }: any) {
  const synth = new Tone.Synth().toDestination()
  const synthEnd = new Tone.Synth().toDestination()

  function playEndSound() {
    let count = 2
    playHintSound()
    const id = setInterval(() => {
      if (count-- === 0) {
        clearInterval(id)
        return
      }
      playHintSound()
    }, 2000)
  }

  function playHintSound() {
    console.count()

    const now = Tone.now()
    synthEnd.triggerAttackRelease('C7', '8n', now)
    synthEnd.triggerAttackRelease('E7', '8n', now + 0.5)
    synthEnd.triggerAttackRelease('G7', '8n', now + 1)
  }

  watch(timeRange.time, (value: number) => {
    try {
      let note: string
      if (value === 0) {
        return
      }

      note = timeRange.dragRotating.value
        ? 'B2'
        : value > 5
        ? 'C2'
        : `C${7 - Math.floor(value)}`

      synth.triggerAttackRelease(note, '32n')
    } catch (error) {
      console.warn('Failed to play sound:', error)
    }
  })

  watch(state.core, () => {
    if (state.isFinished()) {
      playEndSound()
    }
  })
}
