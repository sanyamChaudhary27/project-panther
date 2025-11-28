<template>
  <nav class="nav-bar" :class="{ scrolled }">
    <div class="logo">PANTHER</div>
    <ul class="nav-links">
      <li><router-link to="/">HOME</router-link></li>
      <li><router-link to="/orders">ORDERS</router-link></li>
      <li><router-link to="/account">ACCOUNT</router-link></li>
      <li><router-link to="/cart">CART</router-link></li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const scrolled = ref(false)
function onScroll() {
  scrolled.value = window.scrollY > 30
}
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.nav-bar {
  position: fixed;
  width: 100vw;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(180deg, #0a0a0a 80%, transparent 100%);
  font-weight: 600;
  letter-spacing: 2px;
  transition: box-shadow 0.3s;
  box-shadow: none;
}

.nav-bar.scrolled {
  box-shadow: 0 2px 24px 0 rgba(255,215,0,0.10);
  background: rgba(10,10,10,0.97);
}

.logo {
  font-size: clamp(0.9rem, 3vw, 1.2rem);
  color: var(--primary-gold);
  text-transform: uppercase;
  animation: glow 3s infinite;
}

.nav-links {
  display: flex;
  gap: clamp(0.5rem, 2vw, 2rem);
  list-style: none;
  flex-wrap: nowrap;
}

.nav-links li {
  font-size: clamp(0.55rem, 1.8vw, 0.8rem);
  white-space: nowrap;
}

a, .router-link-active {
  color: #bbb;
  text-decoration: none;
  text-transform: uppercase;
  position: relative;
  font-weight: 700;
  letter-spacing: clamp(0.5px, 0.5vw, 1px);
  transition: color 0.2s;
}

a:hover, .router-link-active {
  color: var(--primary-gold);
  text-shadow: 0 0 6px rgba(255,215,0,0.3);
}

/* Mobile optimization */
@media (max-width: 480px) {
  .nav-bar {
    padding: 1rem 1rem;
  }
  
  .logo {
    font-size: 0.85rem;
    letter-spacing: 1px;
  }
  
  .nav-links {
    gap: 0.4rem;
  }
  
  .nav-links li {
    font-size: 0.55rem;
  }
  
  a, .router-link-active {
    letter-spacing: 0.3px;
  }
}

@media (max-width: 360px) {
  .nav-links li {
    font-size: 0.5rem;
  }
}
</style>