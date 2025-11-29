<template>
  <section class="hero" id="hero">
    <div class="hero-content">
      <h1>UNLEASH<br />THE BEAST</h1>
      <p class="hero-subtitle">Elite Pre-Workout Performance</p>
      <button ref="heroButtonRef" class="btn-primary hero-btn" @click="strikeBtn">DISCOVER MORE</button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useMagneticHover } from '../../composables/useMagneticHover'

const heroButtonRef = ref(null)

useMagneticHover(heroButtonRef, {
  strength: 0.35,
  speed: 0.18,
  maxDistance: 100
})
function strikeBtn(e) {
  const rect = e.target.getBoundingClientRect()
  const detail = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  }
  window.dispatchEvent(new CustomEvent('strikeLightning', { detail }))
}
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  background: radial-gradient(circle at 50% 50%, rgba(20,20,20,0.8) 0%, rgba(10,10,10,1) 100%);
  overflow: hidden;
}
.hero-content {
  z-index: 6;
  position: relative;
  animation: fadeIn 1s;
}
.hero h1 {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 900;
  color: var(--primary-gold);
  text-shadow: 0 0 30px rgba(255,215,0,0.23);
  line-height: 1.08;
  margin-bottom: 1rem;
}
.hero-subtitle {
  font-size: clamp(0.8rem,2vw,1.2rem);
  color: #aaa;
  letter-spacing: 2px;
  margin-bottom: 2.5rem;
  text-transform: uppercase;
  font-weight: 600;
}
.hero-btn {
  margin-top: 1.8rem;
}
</style>