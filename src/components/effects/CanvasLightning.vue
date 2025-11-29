<template>
  <canvas ref="canvas" class="lightning-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx, bolts = []
let isMobile = false

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
      
      // Physics: turbulence decreases with progress
      const turbulence = (1 - progress) * 0.2
      const angleDeviation = (Math.random() - 0.5) * turbulence
      currentAngle += angleDeviation

      const segmentLength = (this.length / segments) * (0.85 + Math.random() * 0.3)
      
      const prevPoint = this.points[i - 1]
      const nextX = prevPoint.x + Math.sin(currentAngle) * segmentLength
      const nextY = prevPoint.y + Math.cos(currentAngle) * segmentLength

      // PROGRESSIVE THINNING - reduces by 70% from start to end
      const thicknessReduction = 1 - (progress * 0.7)
      const width = this.thickness * thicknessReduction

      this.points.push({ x: nextX, y: nextY, width: Math.max(0.3, width) })
    }
  }

  generateSubBranches() {
    // CLIENT REQ: Sub-branches should also have sub-branches (recursive)
    if (this.generation >= this.maxGeneration) return
    if (this.points.length < 5) return

    // Number of sub-branches based on generation
    // Gen 0 (main): 2-3 branches
    // Gen 1: 1-2 branches
    // Gen 2+: 0-1 branches
    const branchCountByGen = [
      Math.floor(Math.random() * 2) + 2, // Gen 0: 2-3
      Math.floor(Math.random() * 2) + 1, // Gen 1: 1-2
      Math.random() > 0.5 ? 1 : 0         // Gen 2+: 0-1
    ]
    
    const branchCount = branchCountByGen[Math.min(this.generation, 2)]

    for (let i = 0; i < branchCount; i++) {
      // Branch spawns at 30-70% along the parent
      const spawnProgress = 0.3 + Math.random() * 0.4
      const pointIndex = Math.floor(this.points.length * spawnProgress)
      const branchPoint = this.points[pointIndex]
      
      if (!branchPoint) continue

      // CLIENT REQ: Main branch becomes thinner as it partitions
      // At branch point, thickness is already reduced by parent's progressive thinning
      const thicknessAtBranchPoint = branchPoint.width
      
      // Sub-branch takes 40-60% of parent thickness at that point
      const subBranchThickness = thicknessAtBranchPoint * (0.4 + Math.random() * 0.2)

      // Branch angle: ±60° spread
      const angleSpread = Math.PI / 3 // ±60°
      const branchAngle = this.angle + (Math.random() - 0.5) * angleSpread

      // Branch length: 30-50% of remaining parent length
      const remainingLength = this.length * (1 - spawnProgress)
      const branchLength = remainingLength * (0.3 + Math.random() * 0.2)

      // Create sub-branch (which will recursively create its own sub-branches)
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
    ctx.shadowBlur = isMobile ? 10 : 15
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const visiblePoints = Math.ceil(this.points.length * progress)

    // Draw main path with progressive width
    for (let i = 0; i < visiblePoints - 1; i++) {
      const p1 = this.points[i]
      const p2 = this.points[i + 1]
      
      ctx.lineWidth = p1.width
      
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
    }

    // Secondary glow
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
    if (progress > 0.3) { // Sub-branches appear after 30% of parent is drawn
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
    
    // CLIENT REQ: More cinematic lightning (25% chance, was 15%)
    this.isSlow = Math.random() < 0.25
    this.duration = this.isSlow ? 900 : 200
    this.fadeDuration = this.isSlow ? 1400 : 800
    
    this.opacity = 1
    this.isMobile = isMobileDevice
    
    const dx = targetX - startX
    const dy = targetY - startY
    this.totalLength = Math.sqrt(dx * dx + dy * dy) * 0.8
    
    const baseAngle = Math.atan2(dx, dy)
    const angleVariation = (Math.random() - 0.5) * (Math.PI / 9) // ±20°
    this.mainAngle = baseAngle + angleVariation
    
    this.mainThickness = isMobileDevice ? 2.5 : 3.0
    
    // Create root branch (which will recursively create all sub-branches)
    this.rootBranch = new LightningBranch(
      startX,
      startY,
      this.mainAngle,
      this.totalLength,
      this.mainThickness,
      0,
      3 // Max 3 generations of branches
    )
  }

  draw(ctx) {
    const elapsed = Date.now() - this.startTime
    let progress = 1
    let opacity = 1

    if (elapsed < this.duration) {
      // Drawing phase
      progress = Math.min(elapsed / this.duration, 1)
      
      if (this.isSlow) {
        progress = this.easeOutCubic(progress)
      }
      
      opacity = 1
    } else {
      // Fade phase
      const fadeElapsed = elapsed - this.duration
      const fadeProgress = Math.min(fadeElapsed / this.fadeDuration, 1)
      opacity = 1 - fadeProgress
      progress = 1
    }

    if (opacity <= 0) return

    // Draw entire branch tree recursively
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
  
  const toX = fromX + (Math.random() - 0.5) * 200
  const toY = fromY + Math.random() * (h * 0.5) + (h * 0.2)
  
  bolts.push(new Lightning(fromX, fromY, toX, toY, isMobile))
}

function animate() {
  if (!canvas.value) return
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

let intervalId = null

onMounted(() => {
  isMobile = window.innerWidth < 768
  
  resizeCanvas()
  ctx = canvas.value.getContext('2d')
  animate()
  
  intervalId = setInterval(() => {
    if (Math.random() > 0.70) { // Slightly reduced frequency
      if (!isMobile || Math.random() > 0.5) {
        spawnRandom()
      }
    }
  }, 2400)
  
  window.addEventListener('resize', () => {
    isMobile = window.innerWidth < 768
    resizeCanvas()
  })
  window.addEventListener('strikeLightning', e => onButtonLightning(e.detail))
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  clearInterval(intervalId)
  window.removeEventListener('strikeLightning', e => onButtonLightning(e.detail))
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