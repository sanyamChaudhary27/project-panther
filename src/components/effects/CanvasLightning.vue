<template>
  <canvas ref="canvas" class="lightning-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx, bolts = [], fogParticles = []
let isMobile = false
let isPaused = false

// Fog particle for cloud layer
class FogParticle {
  constructor(w, h) {
    this.x = Math.random() * w
    this.y = Math.random() * (h * 0.15) // Top 15% of screen
    this.size = Math.random() * 150 + 100
    this.opacity = Math.random() * 0.15 + 0.05
    this.vx = (Math.random() - 0.5) * 0.3
    this.baseOpacity = this.opacity
  }
  
  update(w, h) {
    this.x += this.vx
    
    // Wrap around
    if (this.x < -this.size) this.x = w + this.size
    if (this.x > w + this.size) this.x = -this.size
  }
  
  draw(ctx) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
    gradient.addColorStop(0, `rgba(40, 40, 45, ${this.opacity})`)
    gradient.addColorStop(0.5, `rgba(30, 30, 35, ${this.opacity * 0.5})`)
    gradient.addColorStop(1, 'rgba(20, 20, 25, 0)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2)
  }
  
  flash() {
    // Flash fog when lightning strikes
    this.opacity = Math.min(this.baseOpacity * 3, 0.4)
    setTimeout(() => {
      this.opacity = this.baseOpacity
    }, 150)
  }
}

// Realistic physics-based lightning branch
class LightningBranch {
  constructor(startX, startY, angle, length, thickness, generation = 0, maxGeneration = 3, angleHistory = []) {
    this.startX = startX
    this.startY = startY
    this.angle = angle
    this.length = length
    this.thickness = thickness
    this.generation = generation
    this.maxGeneration = maxGeneration
    this.angleHistory = [...angleHistory] // Track angle changes for realistic physics
    this.points = []
    this.subBranches = []
    this.generateRealisticPath()
    this.generateSubBranches()
  }

  generateRealisticPath() {
    const segments = Math.max(12, Math.floor(this.length / 18))
    let currentAngle = this.angle
    let momentum = 0 // Angle momentum for realistic physics

    this.points.push({ x: this.startX, y: this.startY, width: this.thickness })

    for (let i = 1; i <= segments; i++) {
      const progress = i / segments
      
      // REALISTIC PHYSICS: If angle changes by 15°, it compensates by ~5° in opposite direction
      const desiredAngleChange = (Math.random() - 0.5) * 0.3 // Random deviation
      
      // Apply momentum (creates the "zigzag" realistic effect)
      momentum += desiredAngleChange
      
      // Damping: reduce momentum over time (creates compensation)
      momentum *= 0.85
      
      // Apply angle change with momentum
      currentAngle += momentum
      
      // Store angle history
      this.angleHistory.push(currentAngle)
      
      // Keep recent history only (last 3 angles)
      if (this.angleHistory.length > 3) this.angleHistory.shift()

      // Segment length with variance
      const segmentLength = (this.length / segments) * (0.85 + Math.random() * 0.3)
      
      const prevPoint = this.points[i - 1]
      const nextX = prevPoint.x + Math.sin(currentAngle) * segmentLength
      const nextY = prevPoint.y + Math.cos(currentAngle) * segmentLength

      // Progressive thinning
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

      const angleSpread = (Math.PI / 3) * 1.2
      const branchAngle = this.angle + (Math.random() - 0.5) * angleSpread

      const remainingLength = this.length * (1 - spawnProgress)
      const branchLength = remainingLength * (0.35 + Math.random() * 0.25)

      this.subBranches.push(new LightningBranch(
        branchPoint.x,
        branchPoint.y,
        branchAngle,
        branchLength,
        subBranchThickness,
        this.generation + 1,
        this.maxGeneration,
        this.angleHistory // Pass angle history for physics continuity
      ))
    }
  }

  draw(ctx, progress, opacity) {
    if (this.points.length < 2) return

    ctx.save()
    ctx.globalAlpha = opacity
    ctx.strokeStyle = '#ffd700'
    ctx.shadowColor = '#ffd700'
    ctx.shadowBlur = isMobile ? 12 : 18
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const visiblePoints = Math.ceil(this.points.length * progress)

    // Main bolt
    for (let i = 0; i < visiblePoints - 1; i++) {
      const p1 = this.points[i]
      const p2 = this.points[i + 1]
      
      ctx.lineWidth = p1.width
      
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
    }

    // Inner glow
    ctx.globalAlpha = opacity * 0.5
    ctx.strokeStyle = '#fff'
    ctx.shadowBlur = 4
    
    for (let i = 0; i < visiblePoints - 1; i++) {
      const p1 = this.points[i]
      const p2 = this.points[i + 1]
      
      ctx.lineWidth = p1.width * 0.3
      
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
    }

    ctx.restore()

    // Sub-branches
    if (progress > 0.3) {
      const subBranchProgress = Math.max(0, (progress - 0.3) / 0.7)
      for (const subBranch of this.subBranches) {
        subBranch.draw(ctx, subBranchProgress, opacity * 0.88)
      }
    }
  }
}

// FULL lightning (ground strike)
class FullLightning {
  constructor(startX, startY, targetX, targetY, isMobileDevice = false) {
    this.startX = startX
    this.startY = startY
    this.targetX = targetX
    this.targetY = targetY
    this.startTime = Date.now()
    this.duration = 150
    this.fadeDuration = 800
    this.opacity = 1
    this.isMobile = isMobileDevice
    this.type = 'full'
    
    const dx = targetX - startX
    const dy = targetY - startY
    this.totalLength = Math.sqrt(dx * dx + dy * dy) * 0.85
    
    const baseAngle = Math.atan2(dx, dy)
    const angleVariation = (Math.random() - 0.5) * (Math.PI / 12)
    this.mainAngle = baseAngle + angleVariation
    
    this.mainThickness = isMobileDevice ? 3.0 : 3.5
    
    this.rootBranch = new LightningBranch(
      startX, startY, this.mainAngle, this.totalLength, this.mainThickness, 0, 3
    )
  }

  draw(ctx) {
    const elapsed = Date.now() - this.startTime
    let progress = 1
    let opacity = 1

    if (elapsed < this.duration) {
      progress = Math.min(elapsed / this.duration, 1)
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

  get finished() {
    return Date.now() - this.startTime > this.duration + this.fadeDuration
  }
}

// CLOUD lightning (horizontal flash in fog)
class CloudLightning {
  constructor(w, h) {
    this.startTime = Date.now()
    this.duration = 100
    this.fadeDuration = 400
    this.type = 'cloud'
    
    // Horizontal lightning in top 20% of screen
    this.startX = Math.random() * w
    this.startY = Math.random() * (h * 0.12) + 20
    
    const horizontalLength = w * (0.2 + Math.random() * 0.3)
    const direction = Math.random() > 0.5 ? 1 : -1
    this.endX = this.startX + (horizontalLength * direction)
    this.endY = this.startY + (Math.random() - 0.5) * 40
    
    this.opacity = 0.7 + Math.random() * 0.3
    this.thickness = 1.5 + Math.random()
  }

  draw(ctx) {
    const elapsed = Date.now() - this.startTime
    let opacity = this.opacity

    if (elapsed < this.duration) {
      opacity = this.opacity
    } else {
      const fadeElapsed = elapsed - this.duration
      const fadeProgress = Math.min(fadeElapsed / this.fadeDuration, 1)
      opacity = this.opacity * (1 - fadeProgress)
    }

    if (opacity <= 0) return

    ctx.save()
    ctx.globalAlpha = opacity
    ctx.strokeStyle = '#ffd700'
    ctx.shadowColor = '#ffd700'
    ctx.shadowBlur = 25
    ctx.lineWidth = this.thickness
    ctx.lineCap = 'round'

    // Jagged horizontal line
    const segments = 8
    ctx.beginPath()
    ctx.moveTo(this.startX, this.startY)
    
    for (let i = 1; i <= segments; i++) {
      const t = i / segments
      const x = this.startX + (this.endX - this.startX) * t
      const y = this.startY + (this.endY - this.startY) * t + (Math.random() - 0.5) * 15
      ctx.lineTo(x, y)
    }
    
    ctx.stroke()
    ctx.restore()
  }

  get finished() {
    return Date.now() - this.startTime > this.duration + this.fadeDuration
  }
}

function resizeCanvas() {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  
  // Regenerate fog
  fogParticles = []
  const fogCount = isMobile ? 20 : 35
  for (let i = 0; i < fogCount; i++) {
    fogParticles.push(new FogParticle(canvas.value.width, canvas.value.height))
  }
}

let frame

function spawnFullLightning(targetX = null, targetY = null) {
  const w = canvas.value.width
  const h = canvas.value.height
  
  const fromX = Math.random() * w
  const fromY = Math.random() * (h * 0.12)
  
  const toX = targetX || (fromX + (Math.random() - 0.5) * 300)
  const toY = targetY || (fromY + h * (0.5 + Math.random() * 0.3))
  
  bolts.push(new FullLightning(fromX, fromY, toX, toY, isMobile))
  
  // Flash fog
  fogParticles.forEach(f => f.flash())
}

function spawnCloudLightning() {
  const w = canvas.value.width
  const h = canvas.value.height
  bolts.push(new CloudLightning(w, h))
  
  // Subtle fog flash
  fogParticles.slice(0, 5).forEach(f => {
    f.opacity = Math.min(f.opacity * 1.5, 0.25)
    setTimeout(() => f.opacity = f.baseOpacity, 100)
  })
}

function animate() {
  if (!canvas.value || isPaused) {
    frame = requestAnimationFrame(animate)
    return
  }
  
  const w = canvas.value.width
  const h = canvas.value.height
  ctx.clearRect(0, 0, w, h)
  
  // Draw fog layer
  for (const fog of fogParticles) {
    fog.update(w, h)
    fog.draw(ctx)
  }
  
  // Draw lightning
  bolts = bolts.filter(b => !b.finished)
  for (const b of bolts) b.draw(ctx)
  
  frame = requestAnimationFrame(animate)
}

function onButtonLightning({ x, y }) {
  spawnFullLightning(x, y)
}

function handleVisibilityChange() {
  isPaused = document.hidden
}

let fullLightningInterval = null
let cloudLightningInterval = null

onMounted(() => {
  isMobile = window.innerWidth < 768
  
  resizeCanvas()
  ctx = canvas.value.getContext('2d')
  animate()
  
  // FULL LIGHTNING: 2-3 per minute (every 20-30 seconds)
  fullLightningInterval = setInterval(() => {
    if (Math.random() > 0.5) { // 50% chance = ~1.5 strikes per check
      spawnFullLightning()
    }
  }, 25000) // Every 25 seconds
  
  // CLOUD LIGHTNING: 4-6 per minute (every 10-15 seconds)
  cloudLightningInterval = setInterval(() => {
    spawnCloudLightning()
  }, 12000) // Every 12 seconds
  
  window.addEventListener('resize', () => {
    isMobile = window.innerWidth < 768
    resizeCanvas()
  })
  window.addEventListener('strikeLightning', onButtonLightning)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  clearInterval(fullLightningInterval)
  clearInterval(cloudLightningInterval)
  window.removeEventListener('strikeLightning', onButtonLightning)
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