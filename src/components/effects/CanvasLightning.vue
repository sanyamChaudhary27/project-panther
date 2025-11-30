<template>
  <canvas ref="canvas" class="lightning-canvas"></canvas>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx, bolts = []
let isMobile = false
let isPaused = false

class LightningBranch {
  constructor(startX, startY, angle, length, thickness, generation = 0, maxGeneration = 3) {
    this.startX = startX
    this.startY = startY
    this.angle = angle
    this.length = length
    this.thickness = thickness
    this.generation = generation
    this.maxGeneration = maxGeneration
    this.points = []
    this.subBranches = []
    this.generatePath()
    this.generateSubBranches()
  }

  generatePath() {
    const segments = Math.max(10, Math.floor(this.length / 20))
    let currentAngle = this.angle

    this.points.push({ x: this.startX, y: this.startY, width: this.thickness })

    for (let i = 1; i <= segments; i++) {
      const progress = i / segments
      
      // OPTIMIZATION: 10% MORE CHAOS (0.2 → 0.22)
      const turbulence = (1 - progress) * 0.22
      const angleDeviation = (Math.random() - 0.5) * turbulence
      currentAngle += angleDeviation

      // OPTIMIZATION: More segment variance (0.85+0.3 → 0.8+0.4)
      const segmentLength = (this.length / segments) * (0.8 + Math.random() * 0.4)
      
      const prevPoint = this.points[i - 1]
      const nextX = prevPoint.x + Math.sin(currentAngle) * segmentLength
      const nextY = prevPoint.y + Math.cos(currentAngle) * segmentLength

      // Progressive thinning - NO COMPROMISE
      const thicknessReduction = 1 - (progress * 0.7)
      const width = this.thickness * thicknessReduction

      this.points.push({ x: nextX, y: nextY, width: Math.max(0.3, width) })
    }
  }

  generateSubBranches() {
    if (this.generation >= this.maxGeneration) return
    if (this.points.length < 5) return

    const branchCountByGen = [
      Math.floor(Math.random() * 2) + 2, // Gen 0: 2-3
      Math.floor(Math.random() * 2) + 1, // Gen 1: 1-2
      Math.random() > 0.5 ? 1 : 0         // Gen 2+: 0-1
    ]
    
    const branchCount = branchCountByGen[Math.min(this.generation, 2)]

    for (let i = 0; i < branchCount; i++) {
      const spawnProgress = 0.3 + Math.random() * 0.4
      const pointIndex = Math.floor(this.points.length * spawnProgress)
      const branchPoint = this.points[pointIndex]
      
      if (!branchPoint) continue

      const thicknessAtBranchPoint = branchPoint.width
      const subBranchThickness = thicknessAtBranchPoint * (0.4 + Math.random() * 0.2)

      // OPTIMIZATION: 10% wider angles (±60° → ±66°)
      const angleSpread = (Math.PI / 3) * 1.1
      const branchAngle = this.angle + (Math.random() - 0.5) * angleSpread

      const remainingLength = this.length * (1 - spawnProgress)
      const branchLength = remainingLength * (0.3 + Math.random() * 0.2)

      this.subBranches.push(new LightningBranch(
        branchPoint.x,
        branchPoint.y,
        branchAngle,
        branchLength,
        subBranchThickness,
        this.generation + 1,
        this.maxGeneration
      ))
    }
  }

  draw(ctx, progress, opacity) {
    if (this.points.length < 2) return

    ctx.save()
    ctx.globalAlpha = opacity
    ctx.strokeStyle = '#ffd700'
    ctx.shadowColor = '#ffd700'
    ctx.shadowBlur = isMobile ? 10 : 15 // NO COMPROMISE on glow
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const visiblePoints = Math.ceil(this.points.length * progress)

    // Main path
    for (let i = 0; i < visiblePoints - 1; i++) {
      const p1 = this.points[i]
      const p2 = this.points[i + 1]
      
      ctx.lineWidth = p1.width
      
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
    }

    // Secondary glow - NO COMPROMISE
    ctx.globalAlpha = opacity * 0.4
    ctx.strokeStyle = '#ffed4e'
    ctx.shadowBlur = 8
    
    for (let i = 0; i < visiblePoints - 1; i++) {
      const p1 = this.points[i]
      const p2 = this.points[i + 1]
      
      ctx.lineWidth = p1.width * 0.5
      
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
    }

    ctx.restore()

    // Draw sub-branches recursively
    if (progress > 0.3) {
      const subBranchProgress = Math.max(0, (progress - 0.3) / 0.7)
      for (const subBranch of this.subBranches) {
        subBranch.draw(ctx, subBranchProgress, opacity * 0.9)
      }
    }
  }
}

class Lightning {
  constructor(startX, startY, targetX, targetY, isMobileDevice = false) {
    this.startX = startX
    this.startY = startY
    this.targetX = targetX
    this.targetY = targetY
    this.startTime = Date.now()
    
    // Cinematic lightning: 25% chance
    this.isSlow = Math.random() < 0.25
    this.duration = this.isSlow ? 900 : 200
    this.fadeDuration = this.isSlow ? 1400 : 800
    
    this.opacity = 1
    this.isMobile = isMobileDevice
    
    const dx = targetX - startX
    const dy = targetY - startY
    this.totalLength = Math.sqrt(dx * dx + dy * dy) * 0.8
    
    const baseAngle = Math.atan2(dx, dy)
    
    // OPTIMIZATION: 10% more initial angle variation (±20° → ±22°)
    const angleVariation = (Math.random() - 0.5) * (Math.PI / 9) * 1.1
    this.mainAngle = baseAngle + angleVariation
    
    this.mainThickness = isMobileDevice ? 2.5 : 3.0
    
    this.rootBranch = new LightningBranch(
      startX,
      startY,
      this.mainAngle,
      this.totalLength,
      this.mainThickness,
      0,
      3
    )
  }

  draw(ctx) {
    const elapsed = Date.now() - this.startTime
    let progress = 1
    let opacity = 1

    if (elapsed < this.duration) {
      progress = Math.min(elapsed / this.duration, 1)
      
      if (this.isSlow) {
        progress = this.easeOutCubic(progress)
      }
      
      opacity = 1
    } else {
      const fadeElapsed = elapsed - this.duration
      const fadeProgress = Math.min(fadeElapsed / this.fadeDuration, 1)
      opacity = 1 - fadeProgress
      progress = 1
    }

    if (opacity <= 0) return

    this.rootBranch.draw(ctx, progress, opacity)
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3)
  }

  get finished() {
    return Date.now() - this.startTime > this.duration + this.fadeDuration
  }
}

function resizeCanvas() {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
}

let frame

function spawnRandom() {
  const w = canvas.value.width
  const h = canvas.value.height
  
  const fromX = Math.random() * w
  const fromY = Math.random() * (h * 0.05)
  
  // OPTIMIZATION: 10% more horizontal variance (±200 → ±220)
  const toX = fromX + (Math.random() - 0.5) * 220
  const toY = fromY + Math.random() * (h * 0.5) + (h * 0.2)
  
  bolts.push(new Lightning(fromX, fromY, toX, toY, isMobile))
}

function animate() {
  if (!canvas.value || isPaused) {
    frame = requestAnimationFrame(animate)
    return
  }
  
  const w = canvas.value.width
  const h = canvas.value.height
  ctx.clearRect(0, 0, w, h)
  
  bolts = bolts.filter(b => !b.finished)
  
  for (const b of bolts) b.draw(ctx)
  
  frame = requestAnimationFrame(animate)
}

function onButtonLightning({ x, y }) {
  const w = canvas.value.width
  const h = canvas.value.height
  
  const fromX = Math.random() * w
  const fromY = Math.random() * (h * 0.05)
  
  bolts.push(new Lightning(fromX, fromY, x, y, isMobile))
}

function handleVisibilityChange() {
  isPaused = document.hidden
}

let intervalId = null

onMounted(() => {
  isMobile = window.innerWidth < 768
  
  resizeCanvas()
  ctx = canvas.value.getContext('2d')
  animate()
  
  // OPTIMIZATION: 30% less lightning frequency
  // Desktop: 22% chance every 3000ms (was 30% every 2400ms)
  // Mobile: 35% chance (was 50%)
  intervalId = setInterval(() => {
    if (Math.random() > 0.78) { // 22% chance
      if (!isMobile || Math.random() > 0.65) { // Mobile: 35%
        spawnRandom()
      }
    }
  }, 3000) // 3000ms (was 2400ms)
  
  window.addEventListener('resize', () => {
    isMobile = window.innerWidth < 768
    resizeCanvas()
  })
  window.addEventListener('strikeLightning', e => onButtonLightning(e.detail))
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  clearInterval(intervalId)
  window.removeEventListener('strikeLightning', e => onButtonLightning(e.detail))
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
.lightning-canvas {
  position: fixed;
  inset: 0;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 10;
  pointer-events: none;
  background: none;
}
</style>