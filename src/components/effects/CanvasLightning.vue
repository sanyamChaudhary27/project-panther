<template>
  <canvas ref="canvas" class="lightning-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx, bolts = []

class Lightning {
  constructor(startX, startY, endX, endY) {
    this.startX = startX
    this.startY = startY
    this.endX = endX
    this.endY = endY
    this.startTime = Date.now()
    this.duration = 150
    this.opacity = 1
    this.generatePath()
  }
  generatePath() {
    this.points = []
    const steps = 50
    const dx = this.endX - this.startX
    const dy = this.endY - this.startY
    for (let i=0; i<=steps; i++) {
      const t = i/steps
      let x = this.startX + dx*t
      let y = this.startY + dy*t
      if (i>0 && i<steps) {
        x += (Math.random()-0.5)*50
        y += (Math.random()-0.5)*30
      }
      this.points.push({x,y})
    }
  }
  draw(ctx) {
    const elapsed = Date.now() - this.startTime
    const progress = Math.min(elapsed/this.duration, 1)
    this.opacity = Math.max(0, 1-progress)
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.strokeStyle = '#ffd700'
    ctx.lineWidth = 2+Math.random()*1.5
    ctx.shadowColor = '#ffd700'
    ctx.shadowBlur = 20
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(this.points[0].x, this.points[0].y)
    const visiblePoints = Math.ceil(this.points.length*progress)
    for (let i=1; i<visiblePoints; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y)
    }
    ctx.stroke()
    ctx.globalAlpha = this.opacity*0.6;
    ctx.strokeStyle = '#ffed4e'
    ctx.lineWidth = 1
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.moveTo(this.points[0].x, this.points[0].y)
    for (let i=1; i<visiblePoints; i++) {
      const offset = (Math.random()-0.5)*3
      ctx.lineTo(this.points[i].x+offset, this.points[i].y)
    }
    ctx.stroke()
    ctx.restore()
  }
  get finished() { return Date.now()-this.startTime > this.duration+200 }
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
  const fromX = Math.random()*w
  const fromY = Math.random()*(h*0.4)
  const toX = fromX + (Math.random()-0.5)*200
  const toY = fromY + Math.random()*300+100
  bolts.push(new Lightning(fromX, fromY, toX, toY))
}

function animate() {
  if (!canvas.value) return
  const w = canvas.value.width
  const h = canvas.value.height
  ctx.clearRect(0,0,w,h)
  bolts = bolts.filter(b=>!b.finished)
  for(const b of bolts) b.draw(ctx)
  frame = requestAnimationFrame(animate)
}

function onButtonLightning({ x, y }) {
  // spawn lightning from a random top point to (x,y)
  const w = canvas.value.width
  const h = canvas.value.height
  const fromX = Math.random()*w
  const fromY = Math.random()*(h*0.5)
  bolts.push(new Lightning(fromX, fromY, x, y))
}

let intervalId = null

onMounted(() => {
  resizeCanvas()
  ctx = canvas.value.getContext('2d')
  animate()
  intervalId = setInterval(()=>{ if(Math.random()>0.7) spawnRandom() },1500)
  window.addEventListener('resize', resizeCanvas)
  // EventBus: listen for events "strikeLightning:{ x, y }"
  window.addEventListener('strikeLightning', e => onButtonLightning(e.detail))
})
onUnmounted(() => {
  cancelAnimationFrame(frame)
  clearInterval(intervalId)
  window.removeEventListener('resize', resizeCanvas)
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