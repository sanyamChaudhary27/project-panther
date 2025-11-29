<template>
  <article class="product-card">
    <div class="product-image-section">
      <div class="image-wrapper">
        <img 
          v-if="product.imageUrl" 
          :src="product.imageUrl" 
          :alt="product.name"
          @error="handleImageError"
          class="product-image"
        />
        <div v-else class="emoji-fallback">{{ product.image }}</div>
      </div>
      <div class="rating-badge">
        <span class="stars">⭐ {{ product.rating }}</span>
        <span class="reviews">({{ product.reviews }} reviews)</span>
      </div>
    </div>

    <div class="product-header">
      <h3>{{ product.name }}</h3>
      <span class="in-stock" v-if="product.inStock">✓ In Stock</span>
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
import { ref } from 'vue'
import { useCartStore } from '../../stores/cart'
import IngredientBadge from './IngredientBadge.vue'

const props = defineProps({
  product: { type: Object, required: true }
})
const cart = useCartStore()
const imageError = ref(false)

function handleAdd() {
  cart.addToCart(props.product, 1)
}

function handleImageError() {
  imageError.value = true
}
</script>

<style scoped>
.product-card {
  max-width: 420px;
  padding: 0;
  background: linear-gradient(135deg, rgba(30,30,30,0.85) 0%, rgba(10,10,10,0.9) 100%);
  border-radius: 16px;
  border: 2px solid rgba(255,215,0,0.25);
  box-shadow: 0 0 40px rgba(0,0,0,0.8);
  position: relative;
  overflow: hidden;
  animation: float 4s ease-in-out infinite;
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255,215,0,0.4);
  box-shadow: 0 8px 60px rgba(255,215,0,0.2);
}

.product-image-section {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,1) 100%);
}

.image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.85;
  transition: opacity 0.3s, transform 0.3s;
}

.product-card:hover .product-image {
  opacity: 1;
  transform: scale(1.05);
}

.emoji-fallback {
  font-size: 5rem;
  filter: drop-shadow(0 0 20px rgba(255,215,0,0.6));
}

.rating-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(10,10,10,0.9);
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  border: 1px solid rgba(255,215,0,0.3);
  font-size: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: flex-end;
}

.stars {
  color: var(--primary-gold);
  font-weight: 700;
}

.reviews {
  color: #999;
  font-size: 0.65rem;
}

.product-header {
  padding: 1.5rem 2rem 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

h3 {
  font-size: 1.5rem;
  letter-spacing: 1px;
  flex: 1;
}

.in-stock {
  font-size: 0.7rem;
  color: #4ade80;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.description {
  color: #b3b3b3;
  font-size: 0.9rem;
  padding: 0 2rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.ingredient-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;
  margin: 0 2rem 1.5rem 2rem;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 2rem 1.2rem 2rem;
  font-size: 0.9rem;
}

.price {
  font-weight: 800;
  color: var(--primary-gold);
  font-size: 1.3rem;
}

.servings {
  color: #aaa;
}

.w-full {
  width: calc(100% - 4rem);
  margin: 0 2rem 2rem 2rem;
}

@media (max-width: 480px) {
  .product-image-section {
    height: 220px;
  }
  
  .product-header {
    padding: 1rem 1.5rem 0.5rem 1.5rem;
  }
  
  .description {
    padding: 0 1.5rem;
  }
  
  .ingredient-grid {
    margin: 0 1.5rem 1.2rem 1.5rem;
  }
  
  .meta {
    margin: 0 1.5rem 1rem 1.5rem;
  }
  
  .w-full {
    width: calc(100% - 3rem);
    margin: 0 1.5rem 1.5rem 1.5rem;
  }
}
</style>