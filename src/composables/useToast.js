import { ref } from 'vue'

const toasts = ref([])
let nextId = 0

export function useToast() {
  function show(message, type = 'success', duration = 3000) {
    const id = nextId++
    
    const toast = {
      id,
      message,
      type,
      visible: false
    }
    
    toasts.value.push(toast)
    
    setTimeout(() => {
      const index = toasts.value.findIndex(t => t.id === id)
      if (index !== -1) {
        toasts.value[index].visible = true
      }
    }, 50)
    
    setTimeout(() => {
      remove(id)
    }, duration)
    
    return id
  }
  
  function remove(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value[index].visible = false
      setTimeout(() => {
        toasts.value.splice(index, 1)
      }, 300)
    }
  }
  
  function success(message, duration = 3000) {
    return show(message, 'success', duration)
  }
  
  function error(message, duration = 3000) {
    return show(message, 'error', duration)
  }
  
  function warning(message, duration = 3000) {
    return show(message, 'warning', duration)
  }
  
  function info(message, duration = 3000) {
    return show(message, 'info', duration)
  }
  
  return {
    toasts,
    show,
    remove,
    success,
    error,
    warning,
    info
  }
}