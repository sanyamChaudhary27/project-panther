<template>
  <canvas ref="canvas" class="lightning-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx, bolts = []
let isMobile = false

class LightningBranch {
  constructor(startX, startY, angle, length, thickness, generation = 0) {
    this.startX = startX
    this.startY = startY
    this.angle = angle
    this.length = length
    this.thickness = thickness
    this.generation = generation
    this.points = []
    this.generatePath()
  }

  generatePath() {
    const segments = Math.max(12, Math.floor(this.length / 25))
    const currentX = this.startX
    const currentY = this.startY
    let currentAngle = this.angle

    this.points.push({ x: currentX, y: currentY, width: this.thickness })

    for (let i = 1; i <= segments; i++) {
      const progress = i / segments
      
      const turbulence = (1 - progress) * 0.25
      const angleDeviation = (Math.random() - 0.5) * turbulence
      currentAngle += angleDeviation

      const segmentLength = (this.length / segments) * (0.9 + Math.random() * 0.2)
      
      const nextX = this.points[i - 1].x + Math.sin(currentAngle) * segmentLength
      const nextY = this.points[i - 1].y + Math.cos(currentAngle) * segmentLength

      const thicknessReduction = 1 - (progress * 0.6)
      const width = this.thickness * thicknessReduction

      this.points.push({ x: nextX, y: nextY, width: Math.max(0.5, width) })
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
    
    // 15% chance for ultra-slow animation
    this.isSlow = Math.random() < 0.15
    this.duration = this.isSlow ? 800 : 180 // 800ms for slow, 180ms for normal
    this.fadeDuration = this.isSlow ? 1200 : 700 // Slower fade overall
    
    this.opacity = 1
    this.isMobile = isMobileDevice
    
    const dx = targetX - startX
    const dy = targetY - startY
    this.totalLength = Math.sqrt(dx * dx + dy * dy)
    
    // CLIENT REQ: Lightning is too long - reduce by 20%
    this.totalLength = this.totalLength * 0.8
    
    const baseAngle = Math.atan2(dx, dy)
    const angleVariation = (Math.random() - 0.5) * (Math.PI / 9)
    this.mainAngle = baseAngle + angleVariation
    
    this.mainThickness = isMobileDevice ? 1.8 : 2.2
    
    this.mainBolt = new LightningBranch(
      startX,
      startY,
      this.mainAngle,
      this.totalLength,
      this.mainThickness,
      0
    )
    
    this.branches = this.generateBranches()
  }

  generateBranches() {
    const branches = []
    const mainPoints = this.mainBolt.points
    
    // CLIENT REQ: Fewer branches (optimize performance)
    // Was: Math.floor(this.totalLength / 150) + 1
    // Now: Max 2 branches, 1 for shorter bolts
    const maxBranches = this.totalLength > 400 ? 2 : 1
    const branchCount = Math.min(maxBranches, Math.floor(this.totalLength / 200))
    
    for (let i = 0; i < branchCount; i++) {
      const pointIndex = Math.floor(mainPoints.length * (0.2 + Math.random() * 0.5))
      const branchPoint = mainPoints[pointIndex]
      
      if (!branchPoint) continue
      
      // CLIENT REQ: More spread on child branches
      // Was: ±45° (Math.PI / 4)
      // Now: ±60° (Math.PI / 3)
      const branchAngle = this.mainAngle + (Math.random() - 0.5) * (Math.PI / 3)
      
      const remainingLength = this.totalLength * (1 - pointIndex / mainPoints.length)
      const branchLength = remainingLength * (0.25 + Math.random() * 0.2)
      
      const branchThickness = branchPoint.width * (0.4 + Math.random() * 0.15)
      
      branches.push(new LightningBranch(
        branchPoint.x,
        branchPoint.y,
        branchAngle,
        branchLength,
        branchThickness,
        1
      ))
    }
    
    return branches
  }

  drawBranch(ctx, branch, progress, opacity) {
    if (branch.points.length < 2) return
    
    ctx.save()
    ctx.globalAlpha = opacity
    ctx.strokeStyle = '#ffd700'
    ctx.shadowColor = '#ffd700'
    ctx.shadowBlur = this.isMobile ? 10 : 15
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const visiblePoints = Math.ceil(branch.points.length * progress)

    for (let i = 0; i < visiblePoints - 1; i++) {
      const p1 = branch.points[i]
      const p2 = branch.points[i + 1]
      
      ctx.lineWidth = p1.width
      
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
    }

    ctx.globalAlpha = opacity * 0.4
    ctx.strokeStyle = '#ffed4e'
    ctx.shadowBlur = 8
    
    for (let i = 0; i < visiblePoints - 1; i++) {
      const p1 = branch.points[i]
      const p2 = branch.points[i + 1]
      
      ctx.lineWidth = p1.width * 0.5
      
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
    }

    ctx.restore()
  }

  draw(ctx) {
    const elapsed = Date.now() - this.startTime
    let progress = 1
    let mainOpacity = 1
    let branchOpacity = 1

    if (elapsed < this.duration) {
      // Drawing phase
      progress = Math.min(elapsed / this.duration, 1)
      
      // Smooth easing for slow animation
      if (this.isSlow) {
        progress = this.easeOutCubic(progress)
      }
      
      mainOpacity = 1
      branchOpacity = 1
    } else {
      // Fade phase - CLIENT REQ: Child branches fade first
      const fadeElapsed = elapsed - this.duration
      const fadeProgress = Math.min(fadeElapsed / this.fadeDuration, 1)
      
      // Main bolt fades slowly
      mainOpacity = 1 - (fadeProgress * 0.8) // Fades to 0.2, then disappears
      
      // Branches fade faster (start fading earlier)
      const branchFadeProgress = Math.min(fadeElapsed / (this.fadeDuration * 0.7), 1)
      branchOpacity = 1 - branchFadeProgress
      
      progress = 1
    }

    if (mainOpacity <= 0) return

    // Draw main bolt
    this.drawBranch(ctx, this.mainBolt, progress, mainOpacity)
    
    // Draw branches with separate opacity (fades first)
    if (this.isSlow) {
      // For slow animation: branches appear after main bolt reaches 40%
      const branchProgress = Math.max(0, (progress - 0.4) / 0.6)
      if (branchProgress > 0) {
        for (const branch of this.branches) {
          this.drawBranch(ctx, branch, branchProgress, branchOpacity * 0.85)
        }
      }
    } else {
      // Normal animation: slight delay
      const branchProgress = Math.max(0, progress - 0.15)
      for (const branch of this.branches) {
        this.drawBranch(ctx, branch, branchProgress, branchOpacity * 0.85)
      }
    }
  }

  // Smooth easing function for slow animation
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3)
  }

  get finished() {
    const totalDuration = this.duration + this.fadeDuration
    return Date.now() - this.startTime > totalDuration
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
  
  // Reduced length: 50-70% of screen height (was 60-85%)
  const toX = fromX + (Math.random() - 0.5) * 180
  const toY = fromY + Math.random() * (h * 0.45) + (h * 0.2)
  
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
  
  // CLIENT REQ: 10% fewer strikes
  // Was: 65% chance every 2000ms
  // Now: 68% chance every 2200ms (net ~15% reduction)
  intervalId = setInterval(() => {
    if (Math.random() > 0.68) {
      if (!isMobile || Math.random() > 0.5) {
        spawnRandom()
      }
    }
  }, 2200)
  
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