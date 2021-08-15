import * as Tone from 'tone'
import { watch } from 'vue'

export function useSound({ timeRangeData, rotating }: any) {
  const synth = new Tone.Synth().toDestination()
  const synthEnd = new Tone.Synth().toDestination()

  watch(
    () => timeRangeData.pointOnFly,
    (value) => {
      try {
        let note: string
        // console.log(value)
        if (value === 0) {
          return
        }

        if (value < 0.016) {
          playEndSound()
        } else {
          note = rotating.value
            ? 'B2'
            : value > 5
            ? 'C2'
            : `C${7 - Math.floor(value)}`

          synth.triggerAttackRelease(note, '32n')
        }

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
          synthEnd.triggerAttackRelease('C4', '8n', now)
          synthEnd.triggerAttackRelease('E4', '8n', now + 0.5)
          synthEnd.triggerAttackRelease('G4', '8n', now + 1)
        }
      } catch (error) {
        console.warn('Failed to play sound:', error)
      }
    }
  )
}
