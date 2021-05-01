import { onMounted, onUnmounted, Ref, ref } from 'vue'

const useClickOutside = (elementRef: Ref<null | HTMLElement>): Ref<boolean> => {
  const isClickOutside = ref(false)
  const handler = (e: MouseEvent) => {
    const targetElement = elementRef.value
    if (!targetElement) {
      return
    }
    isClickOutside.value = targetElement.contains(e.target as HTMLElement) ? false : true
  }
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
  return isClickOutside
}

export default useClickOutside