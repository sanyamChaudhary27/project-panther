<template>
  <Tooltip 
    v-if="tooltipInfo"
    :title="tooltipInfo.title"
    :content="tooltipInfo.description"
    position="top"
  >
    <div class="ingredient-badge">
      <div class="ingredient-icon">💊</div>
      <div class="ingredient-info">
        <div class="ingredient-amount">{{ amount }}</div>
        <div class="ingredient-name">{{ name }}</div>
        <div class="ingredient-benefit">{{ benefit }}</div>
      </div>
      <div class="info-icon">ℹ️</div>
    </div>
  </Tooltip>
  
  <div v-else class="ingredient-badge">
    <div class="ingredient-icon">💊</div>
    <div class="ingredient-info">
      <div class="ingredient-amount">{{ amount }}</div>
      <div class="ingredient-name">{{ name }}</div>
      <div class="ingredient-benefit">{{ benefit }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Tooltip from '../common/Tooltip.vue'
import { getIngredientInfo } from '../../data/ingredientGlossary'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  benefit: {
    type: String,
    required: true
  }
})

const tooltipInfo = computed(() => {
  return getIngredientInfo(props.name)
})
</script>

<style scoped>
.ingredient-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255,215,0,0.05);
  border: 1px solid rgba(255,215,0,0.15);
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: help;
}

.ingredient-badge:hover {
  background: rgba(255,215,0,0.1);
  border-color: rgba(255,215,0,0.3);
  transform: translateX(4px);
}

.ingredient-icon {
  font-size: 1.2rem;
  filter: grayscale(0.3);
}

.ingredient-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.ingredient-amount {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--primary-gold);
}

.ingredient-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ingredient-benefit {
  font-size: 0.7rem;
  color: #888;
}

.info-icon {
  font-size: 0.9rem;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.ingredient-badge:hover .info-icon {
  opacity: 1;
}
</style>