<template>
  <div 
    ref="wrapperRef"
    class="tooltip-wrapper" 
    @mouseenter="show" 
    @mouseleave="hide" 
    @click.stop="toggle"
  >
    <slot></slot>
  </div>
  
  <teleport to="body">
    <transition name="tooltip-fade">
      <div v-if="isVisible" class="tooltip-overlay" @click="handleOverlayClick">
        <div 
          class="tooltip-content" 
          :style="tooltipStyle"
          @click.stop
        >
          <button class="tooltip-close" @click="toggle">✕</button>
          <h4 v-if="title" class="tooltip-title">{{ title }}</h4>
          <p class="tooltip-text">{{ content }}</p>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'top'
  }
})

const wrapperRef = ref(null)
const isVisible = ref(false)
const tooltipStyle = ref({})
let timeout = null

function calculatePosition() {
  if (!wrapperRef.value) return
  
  const rect = wrapperRef.value.getBoundingClientRect()
  const isMobile = window.innerWidth < 768
  
  if (isMobile) {
    // Center on screen for mobile
    tooltipStyle.value = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: 'calc(100vw - 40px)',
      minWidth: 'calc(100vw - 40px)'
    }
  } else {
    // Position near element for desktop
    tooltipStyle.value = {
      position: 'fixed',
      top: `${rect.bottom + 10}px`,
      left: `${rect.left + rect.width / 2}px`,
      transform: 'translateX(-50%)',
      maxWidth: '320px',
      minWidth: '250px'
    }
  }
}

function show() {
  if (window.innerWidth >= 768) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      calculatePosition()
      isVisible.value = true
    }, 300)
  }
}

function hide() {
  if (window.innerWidth >= 768) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      isVisible.value = false
    }, 200)
  }
}

function toggle() {
  if (isVisible.value) {
    isVisible.value = false
  } else {
    calculatePosition()
    isVisible.value = true
    
    // Auto-hide after 8 seconds
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      isVisible.value = false
    }, 8000)
  }
}

function handleOverlayClick() {
  isVisible.value = false
}
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
  cursor: help;
}

.tooltip-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tooltip-content {
  background: rgba(15, 15, 15, 0.98);
  border: 2px solid rgba(255, 215, 0, 0.4);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 0 40px rgba(255, 215, 0, 0.2);
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 10001;
  animation: tooltipPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes tooltipPop {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

.tooltip-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  color: #999;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border-radius: 50%;
  line-height: 1;
}

.tooltip-close:hover {
  color: var(--primary-gold);
  background: rgba(255, 215, 0, 0.1);
  transform: rotate(90deg);
}

.tooltip-title {
  font-size: 0.95rem;
  font-weight: 900;
  color: var(--primary-gold);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding-right: 2rem;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.tooltip-text {
  font-size: 0.85rem;
  color: #ddd;
  line-height: 1.7;
  margin: 0;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.3s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .tooltip-content {
    padding: 1.5rem;
  }
  
  .tooltip-title {
    font-size: 1rem;
  }
  
  .tooltip-text {
    font-size: 0.9rem;
  }
}
</style>