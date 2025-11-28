<template>
  <article class="product-card">
    <div class="product-header">
      <div class="emoji">{{ product.image }}</div>
      <h3>{{ product.name }}</h3>
    </div>
    <p class="description">{{ product.description }}</p>

    <div class="ingredient-grid">
      <IngredientBadge
        v-for="ing in product.ingredients"
        :key="ing.name"
        :name="ing.name"
        :amount="ing.amount"
        :benefit="ing.benefit"
      />
    </div>

    <div class="meta">
      <span class="price">₹ {{ product.price }}</span>
      <span class="servings">{{ product.servings }} servings</span>
    </div>

    <button class="btn-primary w-full" @click="handleAdd">
      Add to Cart
    </button>
  </article>
</template>

<script setup>
import { useCartStore } from '../../stores/cart'
import IngredientBadge from './IngredientBadge.vue'

const props = defineProps({
  product: { type: Object, required: true }
})
const cart = useCartStore()

function handleAdd() {
  cart.addToCart(props.product, 1)
}
</script>

<style scoped>
.product-card {
  max-width: 420px;
  padding: 2.5rem 2rem;
  background: linear-gradient(135deg, rgba(30,30,30,0.85) 0%, rgba(10,10,10,0.9) 100%);
  border-radius: 12px;
  border: 2px solid rgba(255,215,0,0.25);
  box-shadow: 0 0 40px rgba(0,0,0,0.8);
  position: relative;
  overflow: hidden;
  animation: float 4s ease-in-out infinite;
}
.product-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.emoji {
  font-size: 2.2rem;
  filter: drop-shadow(0 0 10px rgba(255,215,0,0.6));
}
h3 {
  font-size: 1.5rem;
  letter-spacing: 1px;
}
.description {
  color: #b3b3b3;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}
.ingredient-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}
.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  font-size: 0.9rem;
}
.price {
  font-weight: 800;
  color: var(--primary-gold);
  font-size: 1.1rem;
}
.servings {
  color: #aaa;
}
.w-full {
  width: 100%;
}
</style>