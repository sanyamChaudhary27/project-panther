<template>
  <section class="cta" id="contact">
    <h2>READY TO<br />DOMINATE?</h2>
    <p class="subtitle">Lock in your first batch of Panther Core and experience the difference.</p>
    <button ref="ctaButtonRef" class="btn-primary" @click="strikeAndScroll">
      GET STARTED NOW
    </button>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useMagneticHover } from '../../composables/useMagneticHover'
import { useRipple } from '../../composables/useRipple'

const ctaButtonRef = ref(null)

useRipple(ctaButtonRef, {
  color: 'rgba(255, 215, 0, 0.4)',
  duration: 700
})

useMagneticHover(ctaButtonRef, {
  strength: 0.4,
  speed: 0.2,
  maxDistance: 120
})

function strikeAndScroll(e) {
  const rect = e.target.getBoundingClientRect()
  const detail = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  window.dispatchEvent(new CustomEvent('strikeLightning', { detail }))
}
</script>

<style scoped>
.cta {
  min-height: 60vh;
  padding: 4rem 1.5rem 5rem 1.5rem;
  background: linear-gradient(180deg, #0a0a0a 0%, rgba(255,215,0,0.05) 50%, #0a0a0a 100%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  will-change: transform;
  transition: all 0.3s ease;
}
h2 {
  margin-bottom: 1.5rem;
}
.subtitle {
  max-width: 420px;
  margin-bottom: 2rem;
  color: #aaa;
}
@media (max-width: 768px) {
  .cta-btn {
    transform: none !important;
  }
}
</style>