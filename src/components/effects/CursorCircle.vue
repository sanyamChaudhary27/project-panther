<template>
  <div ref="circle" class="cursor-circle"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const circle = ref(null)

let mouseX = 0
let mouseY = 0
let rafId = null
let isVisible = false

function animateCircle() {
  if (circle.value && isVisible) {
    circle.value.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`
  }
  rafId = requestAnimationFrame(animateCircle)
}

function onMove(e) {
  mouseX = e.clientX
  mouseY = e.clientY
  
  if (!isVisible && circle.value) {
    isVisible = true
    circle.value.style.opacity = '1'
  }
}

function onLeave() {
  if (circle.value) {
    isVisible = false
    circle.value.style.opacity = '0'
  }
}

onMounted(() => {
  // Wait for DOM to be ready
  setTimeout(() => {
    if (circle.value) {
      circle.value.style.opacity = '0'
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseleave', onLeave)
      animateCircle()
    }
  }, 100)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  document.removeEventListener('mousemove', onMove)
  document.removeEventListener('mouseleave', onLeave)
})
</script>

<style scoped>
.cursor-circle {
  position: fixed;
  z-index: 999;
  width: 8px;
  height: 8px;
  border: 2px solid var(--primary-gold);
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  transition: opacity 0.2s ease;
  will-change: transform;
  top: 0;
  left: 0;
}

/* Hide on touch devices */
@media (hover: none) and (pointer: coarse) {
  .cursor-circle {
    display: none;
  }
}
</style>