<template>
  <div 
    class="tooltip-wrapper" 
    @mouseenter="show" 
    @mouseleave="hide" 
    @click.stop="toggle"
  >
    <slot></slot>
    <teleport to="body">
      <transition name="tooltip-fade">
        <div v-if="isVisible" class="tooltip-overlay" @click="hide">
          <div class="tooltip-content" :class="position" @click.stop>
            <div class="tooltip-arrow"></div>
            <div class="tooltip-inner">
              <button class="tooltip-close" @click="hide">✕</button>
              <h4 v-if="title" class="tooltip-title">{{ title }}</h4>
              <p class="tooltip-text">{{ content }}</p>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
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
    default: 'top',
    validator: (val) => ['top', 'bottom', 'left', 'right'].includes(val)
  }
})

const isVisible = ref(false)
let timeout = null

function show() {
  if (window.innerWidth >= 768) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      isVisible.value = true
    }, 300)
  }
}

function hide() {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    isVisible.value = false
  }, 100)
}

function toggle() {
  if (window.innerWidth < 768) {
    isVisible.value = !isVisible.value
    if (isVisible.value) {
      setTimeout(() => {
        isVisible.value = false
      }, 3000)
    }
  }
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
  z-index: 9998;
  background: rgba(0, 0, 0, 0.7);
  display: none;
  backdrop-filter: blur(4px);
}

.tooltip-content {
  position: absolute;
  z-index: 9999;
  min-width: 200px;
  max-width: 300px;
  padding: 0;
  pointer-events: auto;
}

.tooltip-content.top {
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-content.bottom {
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-content.left {
  right: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
}

.tooltip-content.right {
  left: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
}

.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
}

.top .tooltip-arrow {
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(20, 20, 20, 0.98);
}

.bottom .tooltip-arrow {
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid rgba(20, 20, 20, 0.98);
}

.left .tooltip-arrow {
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 6px solid rgba(20, 20, 20, 0.98);
}

.right .tooltip-arrow {
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid rgba(20, 20, 20, 0.98);
}

.tooltip-inner {
  background: rgba(20, 20, 20, 0.98);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  position: relative;
}

.tooltip-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: #999;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: none;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.tooltip-close:hover {
  color: var(--primary-gold);
}

.tooltip-title {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--primary-gold);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-right: 1.5rem;
}

.tooltip-text {
  font-size: 0.8rem;
  color: #ddd;
  line-height: 1.5;
  margin: 0;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.2s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}

/* Mobile styles */
@media (max-width: 768px) {
  .tooltip-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .tooltip-content {
    position: relative !important;
    bottom: auto !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    transform: none !important;
    min-width: calc(100vw - 40px);
    max-width: calc(100vw - 40px);
    margin: 0 20px;
  }
  
  .tooltip-arrow {
    display: none;
  }
  
  .tooltip-close {
    display: flex;
  }
}
</style>