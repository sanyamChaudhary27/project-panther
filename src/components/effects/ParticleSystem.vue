<template>
  <canvas ref="canvas" class="sparks-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx, particles = []

class Particle {
  constructor(w, h) {
    this.x = Math.random() * w
    this.y = h + 10
    this.vx = (Math.random()-0.5) * 0.5
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
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2)
    ctx.fill()
    ctx.restore()
  }
  get alive() { return this.opacity > 0 && this.y > -10 }
}

function resizeCanvas() {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
}

let frame
function animate() {
  if (!canvas.value) return
  const w = canvas.value.width
  const h = canvas.value.height
  ctx.clearRect(0,0,w,h)
  if (particles.length < 80) {
    particles.push(new Particle(w,h))
  }
  particles = particles.filter(p=>p.alive)
  for(const p of particles) {
    p.update()
    p.draw(ctx)
  }
  frame = requestAnimationFrame(animate)
}

onMounted(() => {
  resizeCanvas()
  ctx = canvas.value.getContext('2d')
  animate()
  window.addEventListener('resize', resizeCanvas)
})
onUnmounted(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('resize', resizeCanvas)
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