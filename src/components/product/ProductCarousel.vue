<template>
  <div class="product-carousel">
    <swiper
      :slides-per-view="1"
      :space-between="20"
      :loop="true"
      :autoplay="{
        delay: 7000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }"
      :pagination="{ clickable: true }"
      :navigation="true"
      :breakpoints="{
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      }"
      :modules="modules"
      class="product-swiper"
    >
      <swiper-slide v-for="product in products" :key="product.id">
        <ProductCard :product="product" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import ProductCard from './ProductCard.vue'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

defineProps({
  products: {
    type: Array,
    required: true
  }
})

const modules = [Autoplay, Pagination, Navigation]
</script>

<style scoped>
.product-carousel {
  width: 100%;
  max-width: 1400px;
  position: relative;
  padding: 0 1rem;
}

.product-swiper {
  padding-bottom: 3rem;
}

:deep(.swiper-pagination-bullet) {
  background: rgba(255, 215, 0, 0.3);
  width: 10px;
  height: 10px;
  opacity: 1;
}

:deep(.swiper-pagination-bullet-active) {
  background: var(--primary-gold);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
  transform: scale(1.3);
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: var(--primary-gold);
  background: rgba(10, 10, 10, 0.8);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid rgba(255, 215, 0, 0.3);
  backdrop-filter: blur(10px);
}

:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
  font-size: 20px;
  font-weight: 900;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background: rgba(255, 215, 0, 0.1);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

/* Hide navigation on mobile */
@media (max-width: 768px) {
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    display: none;
  }
}
</style>