import { reactive, ref } from 'vue'

export const initPointerPlateInfo = ($pp: Element, pointerPlateInfo: any) => {
  const { width } = $pp.getBoundingClientRect()
  pointerPlateInfo.radius = width / 2
}
