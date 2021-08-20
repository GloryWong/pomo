import * as Tone from 'tone'
import { watch } from 'vue'

export function useSound({ timeRangeData, state, stateOperations }: any) {
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

  watch(
    () => timeRangeData.time,
    (value) => {
      try {
        let note: string
        if (value === 0) {
          return
        }

        note = timeRangeData.dragRotating
          ? 'B2'
          : value > 5
          ? 'C2'
          : `C${7 - Math.floor(value)}`

        synth.triggerAttackRelease(note, '32n')
      } catch (error) {
        console.warn('Failed to play sound:', error)
      }
    }
  )

  watch(state, () => {
    if (stateOperations.isFinished()) {
      playEndSound()
    }
  })
}
