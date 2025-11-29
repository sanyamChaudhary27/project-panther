<template>
  <teleport to="body">
    <div class="toast-container">
      <transition-group name="toast-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="[`toast-${toast.type}`, { 'toast-visible': toast.visible }]"
          @click="handleRemove(toast.id)"
        >
          <div class="toast-glow"></div>
          <div class="toast-content">
            <div class="toast-icon">
              <div class="icon-circle">
                <span v-if="toast.type === 'success'" class="icon">✓</span>
                <span v-else-if="toast.type === 'error'" class="icon">✕</span>
                <span v-else-if="toast.type === 'warning'" class="icon">⚠</span>
                <span v-else class="icon">ℹ</span>
              </div>
            </div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { useToast } from '../../composables/useToast'

const { toasts, remove } = useToast()

function handleRemove(id) {
  remove(id)
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 90px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  padding: 0;
  border-radius: 12px;
  min-width: 320px;
  max-width: 420px;
  pointer-events: auto;
  cursor: pointer;
  opacity: 0;
  transform: translateX(450px) scale(0.9);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(20, 20, 20, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 215, 0, 0.1) inset;
}

.toast-visible {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.toast-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
  animation: pulse 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  position: relative;
  z-index: 2;
  width: 100%;
}

.toast-icon {
  flex-shrink: 0;
}

.icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: iconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes iconBounce {
  0% { transform: scale(0) rotate(-180deg); }
  60% { transform: scale(1.2) rotate(10deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.icon {
  font-size: 20px;
  font-weight: 900;
  position: relative;
  z-index: 2;
}

.toast-success .icon-circle {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.2) 0%, rgba(34, 197, 94, 0.15) 100%);
  border: 2px solid rgba(74, 222, 128, 0.4);
  box-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
}

.toast-success .icon {
  color: #4ade80;
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.6);
}

.toast-success {
  border-color: rgba(74, 222, 128, 0.3);
}

.toast-error .icon-circle {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%);
  border: 2px solid rgba(239, 68, 68, 0.4);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

.toast-error .icon {
  color: #ef4444;
  text-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
}

.toast-error {
  border-color: rgba(239, 68, 68, 0.3);
}

.toast-warning .icon-circle {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%);
  border: 2px solid rgba(251, 191, 36, 0.4);
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
}

.toast-warning .icon {
  color: #fbbf24;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.6);
}

.toast-warning {
  border-color: rgba(251, 191, 36, 0.3);
}

.toast-info .icon-circle {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(234, 179, 8, 0.15) 100%);
  border: 2px solid rgba(255, 215, 0, 0.4);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.toast-info .icon {
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
}

.toast-info {
  border-color: rgba(255, 215, 0, 0.3);
}

.toast-message {
  color: #f5f5f5;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.3px;
}

.toast:hover {
  transform: translateX(-8px) scale(1.02);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 215, 0, 0.2);
}

.toast:active {
  transform: translateX(-8px) scale(0.98);
}

@media (max-width: 480px) {
  .toast-container {
    top: 75px;
    right: 12px;
    left: 12px;
  }
  
  .toast {
    min-width: auto;
    max-width: none;
  }
}

.toast-list-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-list-leave-active {
  transition: all 0.3s ease;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(450px) scale(0.8);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(450px) scale(0.8);
}

.toast-list-move {
  transition: transform 0.3s ease;
}
</style>