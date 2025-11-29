<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="show" class="success-overlay" @click="handleClose">
        <div class="success-container" @click.stop>
          <div class="success-circle">
            <svg class="checkmark" viewBox="0 0 52 52">
              <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          <h3 class="success-title">{{ title }}</h3>
          <p class="success-message">{{ message }}</p>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Success!'
  },
  message: {
    type: String,
    default: 'Action completed successfully.'
  }
})

const emit = defineEmits(['close'])

function handleClose() {
  emit('close')
}
</script>

<style scoped>
.success-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  cursor: pointer;
}

.success-container {
  text-align: center;
  cursor: default;
  animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes popIn {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.success-circle {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem auto;
  position: relative;
}

.checkmark {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: block;
  stroke-width: 3;
  stroke: #4ade80;
  stroke-miterlimit: 10;
  filter: drop-shadow(0 0 20px rgba(74, 222, 128, 0.6));
}

.checkmark-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 3;
  stroke: #4ade80;
  fill: none;
  animation: strokeCircle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark-check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke-width: 3;
  stroke: #4ade80;
  animation: strokeCheck 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards;
}

@keyframes strokeCircle {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes strokeCheck {
  100% {
    stroke-dashoffset: 0;
  }
}

.success-title {
  font-size: 2rem;
  font-weight: 900;
  color: var(--primary-gold);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  animation: titleGlow 2s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.4); }
  50% { text-shadow: 0 0 30px rgba(255, 215, 0, 0.7); }
}

.success-message {
  font-size: 1.1rem;
  color: #aaa;
  max-width: 350px;
  margin: 0 auto;
  line-height: 1.6;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .success-circle {
    width: 100px;
    height: 100px;
    margin-bottom: 1.5rem;
  }
  
  .success-title {
    font-size: 1.6rem;
  }
  
  .success-message {
    font-size: 1rem;
    max-width: 280px;
    padding: 0 1rem;
  }
}
</style>