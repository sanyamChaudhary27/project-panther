<template>
  <article class="product-card-skeleton">
    <div class="skeleton-image">
      <LoadingSkeleton variant="rect" width="100%" height="280px" />
    </div>

    <div class="skeleton-content">
      <div class="skeleton-header">
        <LoadingSkeleton variant="text" width="60%" height="1.5rem" />
        <LoadingSkeleton variant="text" width="30%" height="0.8rem" />
      </div>

      <div class="skeleton-description">
        <LoadingSkeleton variant="text" width="100%" height="0.9rem" />
        <LoadingSkeleton variant="text" width="85%" height="0.9rem" />
      </div>

      <div class="skeleton-ingredients">
        <LoadingSkeleton variant="rect" width="100%" height="3rem" />
        <LoadingSkeleton variant="rect" width="100%" height="3rem" />
        <LoadingSkeleton variant="rect" width="100%" height="3rem" />
      </div>

      <div class="skeleton-footer">
        <LoadingSkeleton variant="text" width="30%" height="1.2rem" />
        <LoadingSkeleton variant="text" width="25%" height="0.9rem" />
      </div>

      <LoadingSkeleton variant="rect" width="100%" height="3rem" />
    </div>
  </article>
</template>

<script setup>
import LoadingSkeleton from '../common/LoadingSkeleton.vue'
</script>

<style scoped>
.product-card-skeleton {
  max-width: 420px;
  padding: 0;
  background: linear-gradient(135deg, rgba(30,30,30,0.85) 0%, rgba(10,10,10,0.9) 100%);
  border-radius: 16px;
  border: 2px solid rgba(255,215,0,0.15);
  box-shadow: 0 0 40px rgba(0,0,0,0.8);
  overflow: hidden;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.skeleton-image {
  width: 100%;
  height: 280px;
  background: rgba(20,20,20,0.9);
}

.skeleton-content {
  padding: 1.5rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.skeleton-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-description {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-ingredients {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.skeleton-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 480px) {
  .skeleton-image {
    height: 220px;
  }
  
  .skeleton-content {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
  }
}
</style>