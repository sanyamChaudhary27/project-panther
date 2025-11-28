<template>
  <div class="ingredient-badge">
    <span class="amount">{{ amount }}</span>
    <span class="name">{{ name }}</span>
    <span class="benefit">{{ benefit }}</span>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  amount: String,
  benefit: String
})
</script>

<style scoped>
.ingredient-badge {
  padding: 0.75rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(255,215,0,0.25);
  background: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 200px;
}
.amount {
  font-weight: 800;
  color: var(--primary-gold);
  font-size: 0.85rem;
}
.name {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #ddd;
}
.benefit {
  font-size: 0.75rem;
  color: #999;
}
</style>