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
  background: radial-gradient(circle at 50% 50%, rgba(255,215,0,0.09) 0%, transparent 60%),
              radial-gradient(circle at 50% 25%, rgba(255,215,0,0.03) 0%, transparent 100%),
              linear-gradient(180deg, rgba(10,10,10,0.9) 60%, transparent 100%);
  animation: bg-pulse 6s infinite alternate cubic-bezier(.57,1.65,.71,1.14);
}
@keyframes bg-pulse {
  0%   { opacity: 0.8; filter: blur(0px);}
  100% { opacity: 1;   filter: blur(1px);}
}
</style>