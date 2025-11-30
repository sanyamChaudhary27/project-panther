<template>
  <canvas ref="canvas" class="sparks-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx, particles = []
let isMobile = false
let isPaused = false
let deviceTier = 'medium' // 'low', 'medium', 'high'
let maxParticles = 70

// DEVICE PERFORMANCE DETECTION
function detectDevicePerformance() {
  const ua = navigator.userAgent.toLowerCase()
  const cores = navigator.hardwareConcurrency || 2
  const memory = navigator.deviceMemory || 4 // GB
  const width = window.innerWidth
  const height = window.innerHeight
  const pixelRatio = window.devicePixelRatio || 1
  
  // Calculate performance score
  let score = 0
  
  // CPU cores weight
  if (cores >= 8) score += 30
  else if (cores >= 4) score += 20
  else if (cores >= 2) score += 10
  else score += 5
  
  // RAM weight
  if (memory >= 8) score += 30
  else if (memory >= 4) score += 20
  else score += 10
  
  // Resolution weight
  const pixels = width * height * pixelRatio
  if (pixels > 2073600) score += 20 // > 1080p
  else if (pixels > 921600) score += 15 // > 720p
  else score += 10
  
  // Mobile detection penalty
  if (isMobile) score -= 20
  
  // GPU/High-end device detection
  if (ua.includes('iphone 15') || ua.includes('iphone 16')) score += 20
  if (ua.includes('samsung') && ua.includes('s2')) score += 15
  if (ua.includes('pixel') && ua.includes('pro')) score += 15
  
  // Low-end indicators
  if (ua.includes('android 8') || ua.includes('android 9')) score -= 15
  if (cores <= 2 && memory <= 2) score -= 20
  
  // Classify device tier
  if (score >= 70) {
    deviceTier = 'high'
    maxParticles = isMobile ? 50 : 95 // High-end: 95 desktop, 50 mobile
  } else if (score >= 50) {
    deviceTier = 'medium'
    maxParticles = isMobile ? 35 : 70 // Medium: 70 desktop, 35 mobile
  } else {
    deviceTier = 'low'
    maxParticles = isMobile ? 25 : 50 // Low-end: 50 desktop, 25 mobile
  }
  
  console.log(`🎮 Device Tier: ${deviceTier.toUpperCase()} | Particles: ${maxParticles} | Score: ${score}`)
}

class Particle {
  constructor(w, h) {
    this.x = Math.random() * w
    this.y = h + 10
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = -(Math.random() * 1.5 + 0.5)
    this.size = Math.random() * 2 + 1
    this.opacity = Math.random() * 0.8 + 0.2
    this.fadeRate = Math.random() * 0.005 + 0.002
    this.hue = Math.random() * 60 + 40
  }
  
  update() {
    this.x += this.vx
    this.y += this.vy
    this.opacity -= this.fadeRate
    this.vy -= 0.05
  }
  
  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = Math.max(0, this.opacity)
    ctx.fillStyle = `hsl(${this.hue},100%,50%)`
    ctx.shadowColor = ctx.fillStyle
    ctx.shadowBlur = deviceTier === 'low' ? 4 : 8 // Reduce blur on low-end
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  
  get alive() { 
    return this.opacity > 0 && this.y > -10 
  }
}

function resizeCanvas() {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  isMobile = window.innerWidth < 768
}

let frame
let lastSpawnTime = 0
let spawnInterval = 200 // Will adjust based on device tier

function animate(currentTime) {
  if (!canvas.value || isPaused) {
    frame = requestAnimationFrame(animate)
    return
  }
  
  const w = canvas.value.width
  const h = canvas.value.height
  
  ctx.clearRect(0, 0, w, h)
  
  // Adaptive spawn rate based on device tier
  if (deviceTier === 'high') spawnInterval = 150 // Faster spawn
  else if (deviceTier === 'medium') spawnInterval = 200 // Normal
  else spawnInterval = 300 // Slower spawn for low-end
  
  // Spawn new particles
  if (currentTime - lastSpawnTime > spawnInterval && particles.length < maxParticles) {
    particles.push(new Particle(w, h))
    lastSpawnTime = currentTime
  }
  
  // Update and draw in single pass
  particles = particles.filter(p => {
    if (!p.alive) return false
    p.update()
    p.draw(ctx)
    return true
  })
  
  frame = requestAnimationFrame(animate)
}

// Pause when tab is hidden
function handleVisibilityChange() {
  isPaused = document.hidden
}

onMounted(() => {
  resizeCanvas()
  detectDevicePerformance() // Detect device capabilities
  
  ctx = canvas.value.getContext('2d', { alpha: true })
  animate(0)
  
  window.addEventListener('resize', resizeCanvas)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('resize', resizeCanvas)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
.sparks-canvas {
  position: fixed;
  inset: 0;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 3;
  pointer-events: none;
  background: none;
}
</style>