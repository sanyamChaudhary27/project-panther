<template>
  <div class="skeleton" :class="[variant, { animated: animate }]" :style="computedStyle"></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'text',
    validator: (val) => ['text', 'rect', 'circle', 'card', 'product'].includes(val)
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: null
  },
  animate: {
    type: Boolean,
    default: true
  }
})

const computedStyle = computed(() => {
  const styles = {
    width: props.width
  }
  
  if (props.height) {
    styles.height = props.height
  } else {
    // Default heights based on variant
    if (props.variant === 'text') styles.height = '1rem'
    else if (props.variant === 'rect') styles.height = '120px'
    else if (props.variant === 'circle') styles.height = props.width
    else if (props.variant === 'card') styles.height = '400px'
    else if (props.variant === 'product') styles.height = '600px'
  }
  
  return styles
})
</script>

<style scoped>
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 215, 0, 0.03) 0%,
    rgba(255, 215, 0, 0.08) 50%,
    rgba(255, 215, 0, 0.03) 100%
  );
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.skeleton.animated::before {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 150%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 215, 0, 0.15) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    left: -150%;
  }
  100% {
    left: 150%;
  }
}

.skeleton.circle {
  border-radius: 50%;
}

.skeleton.card {
  border-radius: 16px;
  border: 1px solid rgba(255, 215, 0, 0.1);
}

.skeleton.product {
  border-radius: 16px;
  border: 2px solid rgba(255, 215, 0, 0.15);
}

.skeleton.rect {
  border-radius: 8px;
}

.skeleton.text {
  border-radius: 4px;
}
</style>