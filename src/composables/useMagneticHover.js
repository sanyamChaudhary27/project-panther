import { ref, onMounted, onUnmounted } from 'vue'

export function useMagneticHover(elementRef, options = {}) {
  const {
    strength = 0.3,
    speed = 0.15,
    maxDistance = 100
  } = options

  const position = ref({ x: 0, y: 0 })
  const isHovering = ref(false)
  
  let rafId = null
  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0

  function calculateMagneticEffect(e) {
    if (!elementRef.value) return

    const rect = elementRef.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = e.clientX - centerX
    const deltaY = e.clientY - centerY
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    
    if (distance < maxDistance) {
      isHovering.value = true
      targetX = deltaX * strength
      targetY = deltaY * strength
    } else {
      isHovering.value = false
      targetX = 0
      targetY = 0
    }
  }

  function animate() {
    currentX += (targetX - currentX) * speed
    currentY += (targetY - currentY) * speed
    
    position.value = {
      x: Math.round(currentX * 100) / 100,
      y: Math.round(currentY * 100) / 100
    }
    
    if (elementRef.value) {
      elementRef.value.style.transform = `translate3d(${position.value.x}px, ${position.value.y}px, 0)`
    }
    
    rafId = requestAnimationFrame(animate)
  }

  function handleMouseMove(e) {
    calculateMagneticEffect(e)
  }

  function handleMouseLeave() {
    isHovering.value = false
    targetX = 0
    targetY = 0
  }

  onMounted(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseleave', handleMouseLeave)
      animate()
    }
  })

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseleave', handleMouseLeave)
  })

  return {
    position,
    isHovering
  }
}