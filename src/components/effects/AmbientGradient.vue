<template>
  <div class="ambient-gradient"></div>
</template>

<script setup>
</script>

<style scoped>
.ambient-gradient {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: 
    radial-gradient(circle at 50% 10%, rgba(255,215,0,0.06) 0%, transparent 50%),
    radial-gradient(circle at 50% 90%, rgba(255,215,0,0.04) 0%, transparent 50%),
    linear-gradient(180deg, rgba(10,10,10,0.7) 0%, transparent 30%, transparent 70%, rgba(10,10,10,0.7) 100%);
  opacity: 0.85;
  animation: bg-pulse 8s infinite alternate ease-in-out;
}

@keyframes bg-pulse {
  0%   { opacity: 0.75; }
  100% { opacity: 0.9; }
}

/* Ensure it doesn't interfere with scrolled content */
@media (max-width: 768px) {
  .ambient-gradient {
    opacity: 0.7;
    background: 
      radial-gradient(circle at 50% 15%, rgba(255,215,0,0.04) 0%, transparent 40%),
      linear-gradient(180deg, rgba(10,10,10,0.6) 0%, transparent 25%, transparent 75%, rgba(10,10,10,0.6) 100%);
  }
}
</style>