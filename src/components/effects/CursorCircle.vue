<template>
  <div ref="circle" class="cursor-circle"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const circle = ref(null)

let mouseX = 0
let mouseY = 0
let rafId

function animateCircle() {
  if (!circle.value) return;
  circle.value.style.transform = `translate3d(${mouseX - 4}px,${mouseY - 4}px,0)`
  rafId = requestAnimationFrame(animateCircle)
}

function onMove(e) {
  mouseX = e.clientX
  mouseY = e.clientY
  if (circle.value.style.display === 'none') circle.value.style.display = 'block'
}

onMounted(() => {
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseleave', () => { if (circle.value) circle.value.style.display = 'none' })
  animateCircle()
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  document.removeEventListener('mousemove', onMove)
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
  opacity: 0.8;
  box-shadow: 0 0 10px rgba(255,215,0,0.5);
  display: none;
  transition: filter 0.2s;
  will-change: transform;
}
</style>