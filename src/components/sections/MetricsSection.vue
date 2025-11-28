<template>
  <section class="metrics" id="metrics">
    <h2 class="metrics-title">PERFORMANCE<br />METRICS</h2>
    <div class="metrics-grid">
      <div v-for="m in metrics" :key="m.label" class="metric-card">
        <span class="metric-value">{{ m.value }}</span>
        <span class="metric-label">{{ m.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
const metrics = reactive([
  { label: 'MG CAFFEINE', value: 0, target: 250 },
  { label: 'G CITRULLINE', value: 0, target: 5 },
  { label: 'G BETA-ALANINE', value: 0, target: 2.5 },
  { label: 'G CREATINE', value: 0, target: 1.5 }
])
function animateMetrics() {
  metrics.forEach(m => {
    let start = 0
    const increment = m.target / 60
    const interval = setInterval(() => {
      start += increment
      if (start >= m.target) {
        m.value = m.target
        clearInterval(interval)
      } else {
        m.value = Number(start.toFixed(1))
      }
    }, 24)
  })
}
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateMetrics()
        observer.unobserve(entry.target)
      }
    })
  })
  const section = document.querySelector('.metrics')
  if (section) observer.observe(section)
})
</script>

<style scoped>
.metrics {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 1rem 2rem 1rem;
  background: linear-gradient(180deg, #0a0a0a 0%, #121212 100%);
  position: relative;
}

.metrics-title {
  font-size: clamp(2rem, 6vw, 3.5rem);
  margin-bottom: 3rem;
  text-shadow: 0 0 20px rgba(255,215,0,0.18);
  letter-spacing: -1px;
  text-align: center;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  max-width: 700px;
  width: 100%;
  padding: 0 1rem;
}

.metric-card {
  text-align: center;
  padding: 2rem 1rem;
  border-radius: 8px;
  background: rgba(255,215,0,0.02);
  border: 1px solid rgba(255,215,0,0.15);
  animation: float 3s ease-in-out infinite;
  transition: background 0.4s;
}

.metric-value {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 900;
  color: var(--primary-gold);
  display: block;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: clamp(0.6rem, 1.5vw, 0.7rem);
  text-transform: uppercase;
  color: #999;
  letter-spacing: 0.5px;
  font-weight: 600;
  display: block;
}

.metric-card:hover {
  background: rgba(255,215,0,0.08);
  border-color: rgba(255,215,0,0.4);
}

/* CRITICAL: Mobile 2×2 grid */
@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    max-width: 400px;
  }
  
  .metric-card {
    padding: 1.5rem 0.75rem;
  }
  
  .metric-value {
    font-size: 2rem;
  }
  
  .metric-label {
    font-size: 0.6rem;
    letter-spacing: 0.3px;
  }
}

@media (max-width: 480px) {
  .metrics {
    padding: 3rem 0.5rem 2rem 0.5rem;
  }
  
  .metrics-grid {
    gap: 0.75rem;
    max-width: 100%;
    padding: 0 0.5rem;
  }
  
  .metric-card {
    padding: 1.2rem 0.5rem;
  }
  
  .metric-value {
    font-size: 1.6rem;
  }
  
  .metric-label {
    font-size: 0.55rem;
  }
}
</style>