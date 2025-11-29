<template>
  <div id="app">
    <CursorCircle />
    <AmbientGradient />
    <ParticleSystem />
    <CanvasLightning />
    <Navbar />
    <router-view />
    <Footer />
    <Toast />
    <SuccessCheckmark 
      :show="successVisible" 
      :title="successTitle" 
      :message="successMessage" 
      @close="hideSuccess" 
    />
  </div>
</template>

<script setup>
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import CursorCircle from './components/effects/CursorCircle.vue'
import AmbientGradient from './components/effects/AmbientGradient.vue'
import ParticleSystem from './components/effects/ParticleSystem.vue'
import CanvasLightning from './components/effects/CanvasLightning.vue'
import Toast from './components/common/Toast.vue'
import SuccessCheckmark from './components/common/SuccessCheckmark.vue'
import { useSuccess } from './composables/useSuccess'

const { isVisible: successVisible, title: successTitle, message: successMessage, hide: hideSuccess } = useSuccess()
</script>

<style>
#app {
  min-height: 100vh;
  background: var(--primary-dark);
  position: relative;
  overflow-x: hidden;
}
</style>