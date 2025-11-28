<template>
  <main class="details">
    <section v-if="product" class="content">
      <header>
        <span class="emoji">{{ product.image }}</span>
        <div>
          <h2>{{ product.name }}</h2>
          <p class="tagline">{{ product.description }}</p>
        </div>
      </header>

      <section class="grid">
        <div class="left">
          <h3>Formula Highlights</h3>
          <IngredientBadge
            v-for="ing in product.ingredients"
            :key="ing.name"
            :name="ing.name"
            :amount="ing.amount"
            :benefit="ing.benefit"
          />
        </div>
        <aside class="right">
          <p class="price">₹ {{ product.price }}</p>
          <p class="servings">{{ product.servings }} servings</p>
          <button class="btn-primary w-full" @click="addToCart">
            Add to Cart
          </button>
        </aside>
      </section>
    </section>
    <p v-else class="missing">Product not found.</p>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import IngredientBadge from '../components/product/IngredientBadge.vue'

const route = useRoute()
const productsStore = useProductsStore()
const cart = useCartStore()

const product = computed(() => productsStore.getProductById(route.params.id))

function addToCart() {
  if (product.value) cart.addToCart(product.value, 1)
}
</script>

<style scoped>
.details {
  padding: 7rem 1.5rem 4rem 1.5rem;
  max-width: 960px;
  margin: 0 auto;
}
header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}
.emoji {
  font-size: 3rem;
}
.tagline {
  color: #aaa;
}
.grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}
.left {
  display: grid;
  gap: 0.75rem;
}
.right {
  padding: 1.5rem;
  border-radius: 12px;
  background: #141414;
  border: 1px solid rgba(255,215,0,0.2);
}
.price {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--primary-gold);
}
.servings {
  color: #aaa;
  margin-bottom: 1.5rem;
}
.w-full {
  width: 100%;
}
.missing {
  margin-top: 6rem;
  text-align: center;
}
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>