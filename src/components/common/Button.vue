<template>
  <button 
    ref="buttonRef"
    class="btn-primary-ripple" 
    :class="variant"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useRipple } from '../../composables/useRipple'

defineProps({
  variant: {
    type: String,
    default: 'primary'
  }
})

const emit = defineEmits(['click'])
const buttonRef = ref(null)

useRipple(buttonRef, {
  color: 'rgba(255, 215, 0, 0.4)',
  duration: 600
})

function handleClick(e) {
  emit('click', e)
}
</script>

<style scoped>
.btn-primary-ripple {
  position: relative;
  overflow: hidden;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #ffd700 0%, #f4c430 100%);
  border: none;
  border-radius: 8px;
  color: #0a0a0a;
  font-size: 1rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255,215,0,0.3);
}

.btn-primary-ripple:hover {
  background: linear-gradient(135deg, #ffed4e 0%, #ffd700 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(255,215,0,0.5);
}

.btn-primary-ripple:active {
  transform: translateY(0);
}
</style>