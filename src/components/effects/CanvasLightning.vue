<template>
  <canvas ref="canvas" class="lightning-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx, bolts = [], fogParticles = []
let isMobile = false
let isPaused = false

// Smooth fog particle that merges together
class FogParticle {
  constructor(w, h) {
    this.x = Math.random() * w
    this.y = Math.random() * (h * 0.15)
    this.size = Math.random() * 180 + 120
    this.baseOpacity = Math.random() * 0.25 + 0.15
    this.opacity = this.baseOpacity
    this.targetOpacity = this.baseOpacity
    this.vx = (Math.random() - 0.5) * 0.15  // Gentler movement
    this.vy = (Math.random() - 0.5) * 0.08  // Vertical drift
  }
  
  update(w, h) {
    // Smooth gentle movement
    this.x += this.vx
    this.y += this.vy
    
    // Wrap around smoothly
    if (this.x < -this.size) this.x = w + this.size
    if (this.x > w + this.size) this.x = -this.size
    if (this.y < -this.size / 2) this.y = h * 0.15
    if (this.y > h * 0.15 + this.size / 2) this.y = -this.size / 2
    
    // Smooth opacity transition
    const opacityDiff = this.targetOpacity - this.opacity
    this.opacity += opacityDiff * 0.05  // Smooth interpolation
  }
  
  draw(ctx) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
    gradient.addColorStop(0, `rgba(80, 60, 20, ${this.opacity})`)
    gradient.addColorStop(0.4, `rgba(60, 45, 15, ${this.opacity * 0.7})`)
    gradient.addColorStop(0.7, `rgba(45, 35, 12, ${this.opacity * 0.4})`)
    gradient.addColorStop(1, 'rgba(30, 25, 10, 0)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2)
  }
  
  flash(intensity = 1.0) {
    // Smooth flash effect
    this.targetOpacity = Math.min(this.baseOpacity * (2 + intensity), 0.5)
    setTimeout(() => {
      this.targetOpacity = this.baseOpacity
    }, 100)
  }
}

// Realistic physics-based FULL lightning branch with more zigzag
class LightningBranch {
  constructor(startX, startY, angle, length, thickness, generation = 0, maxGeneration = 3, angleHistory = []) {
    this.startX = startX
    this.startY = startY
    this.angle = angle
    this.length = length
    this.thickness = thickness
    this.generation = generation
    this.maxGeneration = maxGeneration
    this.angleHistory = [...angleHistory]
    this.points = []
    this.subBranches = []
    this.generateRealisticPath()
    this.generateSubBranches()
  }

  generateRealisticPath() {
    const segments = Math.max(15, Math.floor(this.length / 15))  // More segments = more zigzag
    let currentAngle = this.angle
    let momentum = 0

    this.points.push({ x: this.startX, y: this.startY, width: this.thickness })

    for (let i = 1; i <= segments; i++) {
      const progress = i / segments
      
      // INCREASED ANGLE DEVIATION: More frequent, bigger changes
      const desiredAngleChange = (Math.random() - 0.5) * 0.6  // Was 0.3, now 0.6 (2x bigger)
      
      // Apply momentum
      momentum += desiredAngleChange
      
      // Less damping = more zigzag
      momentum *= 0.75  // Was 0.85, now 0.75 (keeps momentum longer)
      
      // Apply angle change
      currentAngle += momentum
      
      // RARE 360° CURVE BACK (1% chance per segment)
      if (Math.random() < 0.01 && this.generation === 0) {
        currentAngle += Math.PI  // 180° turn
        momentum = 0  // Reset momentum
      }
      
      this.angleHistory.push(currentAngle)
      if (this.angleHistory.length > 3) this.angleHistory.shift()

      // Segment length
      const segmentLength = (this.length / segments) * (0.8 + Math.random() * 0.4)
      
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
      Math.floor(Math.random() * 2) + 2,
      Math.floor(Math.random() * 2) + 1,
      Math.random() > 0.5 ? 1 : 0
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
        this.angleHistory
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

// CLOUD lightning (smooth curve in fog)
class CloudLightning {
  constructor(w, h) {
    this.startTime = Date.now()
    this.duration = 120
    this.fadeDuration = 500
    this.type = 'cloud'
    
    // Horizontal lightning in fog
    this.startX = Math.random() * w
    this.startY = Math.random() * (h * 0.12) + 20
    
    const horizontalLength = w * (0.25 + Math.random() * 0.35)
    const direction = Math.random() > 0.5 ? 1 : -1
    this.endX = this.startX + (horizontalLength * direction)
    this.endY = this.startY + (Math.random() - 0.5) * 60
    
    this.opacity = 0.6 + Math.random() * 0.3
    this.thickness = 1.8 + Math.random() * 0.7
    
    // Generate smooth curved path
    this.generateSmoothPath()
  }

  generateSmoothPath() {
    this.points = []
    const segments = 12
    let angle = Math.atan2(this.endY - this.startY, this.endX - this.startX)
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const x = this.startX + (this.endX - this.startX) * t
      const y = this.startY + (this.endY - this.startY) * t
      
      // LESS TURBULENCE: Small smooth curves
      const curvature = Math.sin(t * Math.PI * 2) * 8  // Gentle sine wave
      const perpX = Math.cos(angle + Math.PI / 2)
      const perpY = Math.sin(angle + Math.PI / 2)
      
      this.points.push({
        x: x + perpX * curvature,
        y: y + perpY * curvature + (Math.random() - 0.5) * 5  // Minimal random deviation
      })
    }
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
    ctx.globalAlpha = opacity * 0.08
    ctx.strokeStyle = '#ffd700'
    ctx.shadowColor = '#ffd700'
    ctx.shadowBlur = 450
    ctx.lineWidth = this.thickness
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Draw smooth curve
    ctx.beginPath()
    ctx.moveTo(this.points[0].x, this.points[0].y)
    
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y)
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
  
  // Generate more fog particles that merge
  fogParticles = []
  const fogCount = isMobile ? 35 : 60
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
  
  // Smooth fog flash
  fogParticles.forEach(f => f.flash(1.5))
}

function spawnCloudLightning() {
  const w = canvas.value.width
  const h = canvas.value.height
  bolts.push(new CloudLightning(w, h))
  
  // Subtle fog shine
  fogParticles.forEach((f, i) => {
    if (i % 2 === 0) f.flash(0.5)  // Only half of fog particles
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
  
  // Draw fog layer with smooth merging
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
  
  // FULL LIGHTNING: 2-3 per minute
  fullLightningInterval = setInterval(() => {
    if (Math.random() > 0.5) {
      spawnFullLightning()
    }
  }, 25000)
  
  // CLOUD LIGHTNING: 4-6 per minute
  cloudLightningInterval = setInterval(() => {
    spawnCloudLightning()
  }, 12000)
  
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