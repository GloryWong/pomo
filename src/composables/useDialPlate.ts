import { ref } from 'vue'
export function useDialPlate() {
  const MAX_SIZE = 750 // pixel
  const PROPORTION_TO_CONTAINER = 0.9

  const calculateSuitableSize = () => {
    let dialPlateSize =
      Math.min(window.innerWidth, window.innerHeight) * PROPORTION_TO_CONTAINER
    dialPlateSize = Math.min(dialPlateSize, MAX_SIZE)

    return dialPlateSize
  }
  const dialPlateSize = ref(calculateSuitableSize())
  window.addEventListener('resize', () => {
    dialPlateSize.value = calculateSuitableSize()
  })

  const angleOnFly = ref(0)
  const getAngleOnFly = () => {
    return angleOnFly.value
  }
  const setAngleOnFly = (angle: number) => {
    angleOnFly.value = angle
  }

  return {
    dialPlateSize,
    getAngleOnFly,
    setAngleOnFly,
  }
}
