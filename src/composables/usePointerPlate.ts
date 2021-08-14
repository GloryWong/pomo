import { ref, reactive, onMounted } from 'vue'

export function usePointerPlate() {
  const pointerPlate = ref<unknown>(null)
  const pointerPlateInfo = reactive({
    active: false,
    radius: 0,
  })

  const initPointerPlateInfo = ($pp: Element, pointerPlateInfo: any) => {
    const { width } = $pp.getBoundingClientRect()
    pointerPlateInfo.radius = width / 2
  }

  onMounted(() => {
    initPointerPlateInfo(pointerPlate.value as Element, pointerPlateInfo)
  })

  return {
    pointerPlate,
    pointerPlateInfo,
  }
}
