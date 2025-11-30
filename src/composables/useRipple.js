import { onMounted, onUnmounted } from 'vue'

export function useRipple(elementRef, options = {}) {
  const {
    color = 'rgba(255, 215, 0, 0.5)',
    duration = 600
  } = options

  function createRipple(event) {
    const button = elementRef.value
    if (!button) return

    const circle = document.createElement('span')
    const diameter = Math.max(button.clientWidth, button.clientHeight)
    const radius = diameter / 2

    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left - radius
    const y = event.clientY - rect.top - radius

    circle.style.width = circle.style.height = `${diameter}px`
    circle.style.left = `${x}px`
    circle.style.top = `${y}px`
    circle.style.background = color
    circle.classList.add('ripple-effect')

    const ripple = button.getElementsByClassName('ripple-effect')[0]
    if (ripple) {
      ripple.remove()
    }

    button.appendChild(circle)

    setTimeout(() => {
      circle.remove()
    }, duration)
  }

  function handleClick(event) {
    createRipple(event)
  }

  onMounted(() => {
    if (elementRef.value) {
      elementRef.value.addEventListener('click', handleClick)
      
      // Add position relative if not set
      const computed = window.getComputedStyle(elementRef.value)
      if (computed.position === 'static') {
        elementRef.value.style.position = 'relative'
      }
      
      // Add overflow hidden
      elementRef.value.style.overflow = 'hidden'
    }
  })

  onUnmounted(() => {
    if (elementRef.value) {
      elementRef.value.removeEventListener('click', handleClick)
    }
  })
}