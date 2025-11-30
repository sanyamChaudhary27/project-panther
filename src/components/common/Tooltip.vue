<template>
  <div 
    ref="wrapperRef"
    class="tooltip-wrapper" 
    @mouseenter="handleMouseEnter" 
    @mouseleave="handleMouseLeave" 
    @click.stop="handleClick"
  >
    <slot></slot>
    
    <!-- Desktop Tooltip (No Overlay) -->
    <transition name="tooltip-slide">
      <div 
        v-if="isVisible && !isMobile" 
        class="tooltip-desktop"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <div class="tooltip-inner-desktop">
          <h4 v-if="title" class="tooltip-title">{{ title }}</h4>
          <p class="tooltip-text">{{ content }}</p>
        </div>
        <div class="tooltip-arrow-desktop"></div>
      </div>
    </transition>
  </div>
  
  <!-- Mobile Tooltip (With Overlay) -->
  <teleport to="body">
    <transition name="tooltip-fade">
      <div v-if="isVisible && isMobile" class="tooltip-overlay-mobile" @click="hide">
        <div class="tooltip-content-mobile" @click.stop>
          <button class="tooltip-close" @click="hide">✕</button>
          <h4 v-if="title" class="tooltip-title">{{ title }}</h4>
          <p class="tooltip-text">{{ content }}</p>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true
  }
})

const wrapperRef = ref(null)
const isVisible = ref(false)
const isMobile = ref(false)
let timeout = null

function checkMobile() {
  isMobile.value = window.innerWidth < 768
}

function handleMouseEnter() {
  if (!isMobile.value) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      isVisible.value = true
    }, 200)
  }
}

function handleMouseLeave() {
  if (!isMobile.value) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      isVisible.value = false
    }, 10)
  }
}

function handleClick() {
  if (isMobile.value) {
    isVisible.value = !isVisible.value
  }
}

function hide() {
  isVisible.value = false
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  clearTimeout(timeout)
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
  cursor: help;
}

/* ============ DESKTOP TOOLTIP (NO OVERLAY) ============ */
.tooltip-desktop {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  pointer-events: auto;
}

.tooltip-inner-desktop {
  background: rgba(15, 15, 15, 0.98);
  border: 2px solid rgba(255, 215, 0, 0.4);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  min-width: 280px;
  max-width: 320px;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.8),
    0 0 30px rgba(255, 215, 0, 0.15),
    inset 0 0 20px rgba(255, 215, 0, 0.05);
  backdrop-filter: blur(10px);
}

.tooltip-arrow-desktop {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid rgba(255, 215, 0, 0.4);
}

.tooltip-arrow-desktop::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 7px solid rgba(15, 15, 15, 0.98);
}

/* Desktop Slide Animation */
.tooltip-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tooltip-slide-leave-active {
  transition: all 0.2s ease;
}

.tooltip-slide-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

.tooltip-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(5px);
}

/* ============ MOBILE TOOLTIP (WITH OVERLAY) ============ */
.tooltip-overlay-mobile {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.tooltip-content-mobile {
  background: rgba(15, 15, 15, 0.98);
  border: 2px solid rgba(255, 215, 0, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: calc(100vw - 40px);
  width: 100%;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.9),
    0 0 40px rgba(255, 215, 0, 0.3);
  position: relative;
  animation: mobileTooltipPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes mobileTooltipPop {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.tooltip-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: var(--primary-gold);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border-radius: 50%;
  line-height: 1;
}

.tooltip-close:hover {
  background: rgba(255, 215, 0, 0.2);
  transform: rotate(90deg);
}

/* Mobile Fade Animation */
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.3s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}

/* ============ SHARED STYLES ============ */
.tooltip-title {
  font-size: 0.9rem;
  font-weight: 900;
  color: var(--primary-gold);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.tooltip-text {
  font-size: 0.85rem;
  color: #ddd;
  line-height: 1.7;
  margin: 0;
}

@media (max-width: 768px) {
  .tooltip-title {
    font-size: 1rem;
    padding-right: 2rem;
  }
  
  .tooltip-text {
    font-size: 0.9rem;
  }
}
</style>