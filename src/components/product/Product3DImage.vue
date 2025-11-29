<template>
  <div class="product-3d-container">
    <swiper
      :slides-per-view="1"
      :loop="true"
      :autoplay="{
        delay: 7000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }"
      :effect="'coverflow'"
      :coverflowEffect="{
        rotate: 20,
        stretch: 0,
        depth: 200,
        modifier: 1,
        slideShadows: true,
      }"
      :pagination="{ clickable: true }"
      :modules="modules"
      class="image-swiper"
    >
      <swiper-slide v-for="(img, index) in images" :key="index">
        <div class="floating-image">
          <img :src="img" :alt="`Product view ${index + 1}`" />
          <div class="glow-effect"></div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

defineProps({
  images: {
    type: Array,
    required: true
  }
})

const modules = [Autoplay, EffectCoverflow, Pagination]
</script>

<style scoped>
.product-3d-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
}

.image-swiper {
  padding: 2rem 0 3rem 0;
}

.floating-image {
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-15px) rotate(2deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(-10px) rotate(-2deg);
  }
}

.floating-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
  transition: transform 0.3s ease;
}

.floating-image:hover img {
  transform: scale(1.05) rotate(5deg);
}

.glow-effect {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
  filter: blur(30px);
  animation: pulse 3s ease-in-out infinite;
  pointer-events: none;
  z-index: -1;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

:deep(.swiper-pagination-bullet) {
  background: rgba(255, 215, 0, 0.4);
  width: 8px;
  height: 8px;
}

:deep(.swiper-pagination-bullet-active) {
  background: var(--primary-gold);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
}

@media (max-width: 480px) {
  .floating-image {
    height: 300px;
  }
}
</style>