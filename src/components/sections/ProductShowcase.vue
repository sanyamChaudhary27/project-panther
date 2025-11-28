<template>
  <section class="arsenal" id="products">
    <h2 class="arsenal-title">OUR ARSENAL</h2>
    <ProductCard :product="coreProduct" />
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useProductsStore } from '../../stores/products'
import ProductCard from '../product/ProductCard.vue'

const productsStore = useProductsStore()
const coreProduct = computed(() => productsStore.getProductById('panther-core'))
</script>

<style scoped>
.arsenal {
  min-height: 100vh;
  padding: 4rem 1rem 5rem 1rem;
  background: linear-gradient(180deg, #121212 0%, #0a0a0a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.arsenal-title {
  font-size: clamp(2rem, 6vw, 3.5rem);
  margin-bottom: 3rem;
  text-align: center;
  text-shadow: 0 0 20px rgba(255,215,0,0.2);
}
</style>