import { ref } from 'vue'

const isVisible = ref(false)
const title = ref('Success!')
const message = ref('Action completed successfully.')

export function useSuccess() {
  function show(customTitle, customMessage, duration = 2000) {
    title.value = customTitle
    message.value = customMessage
    isVisible.value = true
    
    setTimeout(() => {
      hide()
    }, duration)
  }
  
  function hide() {
    isVisible.value = false
  }
  
  return {
    isVisible,
    title,
    message,
    show,
    hide
  }
}