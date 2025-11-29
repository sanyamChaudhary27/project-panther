<template>
  <section class="arsenal" id="products">
    <h2 class="arsenal-title">OUR ARSENAL</h2>
    
    <ProductCardSkeleton v-if="loading" />
    <ProductCarousel v-else-if="allProducts.length > 0" :products="allProducts" />
    <p v-else class="error-message">No products available</p>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '../../stores/products'
import ProductCarousel from '../product/ProductCarousel.vue'
import ProductCardSkeleton from '../product/ProductCardSkeleton.vue'

const productsStore = useProductsStore()
const loading = ref(true)

const allProducts = computed(() => productsStore.allProducts)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1500)
})
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

.error-message {
  color: #ef4444;
  font-size: 1rem;
  text-align: center;
}
</style>