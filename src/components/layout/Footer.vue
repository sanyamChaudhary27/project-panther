<template>
  <footer class="footer">
    <div class="footer-content">
      <div>
        <h3>PANTHER</h3>
        <p class="brand-desc">Elite pre-workout engineered for champions.</p>
      </div>
      <div>
        <h3>PRODUCTS</h3>
        <ul>
          <li><router-link to="/">Panther Core</router-link></li>
          <li><router-link to="/">Panther Extreme</router-link></li>
          <li><router-link to="/">Panther Elite</router-link></li>
        </ul>
      </div>
      <div>
        <h3>COMPANY</h3>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Press</a></li>
        </ul>
      </div>
      <div>
        <h3>SUPPORT</h3>
        <ul>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      &copy; 2025 The Panther. All rights reserved. | Crafted with excellence.
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.footer {
  background: #0a0a0a;
  border-top: 1px solid rgba(255,215,0,0.08);
  padding: 2.5rem 2rem 1rem 2rem;
  position: relative;
  z-index: 2;
  color: #888;
}
.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px,1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}
h3 {
  color: var(--primary-gold);
  font-size: 0.97rem;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  text-transform: uppercase;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 0.5rem;
}
.brand-desc {
  color: #888;
  font-size: 0.95rem;
  margin-top: 0.5rem;
}
.footer-bottom {
  text-align: center;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(255,215,0,0.1);
  color: #666;
  font-size: 0.82rem;
}
</style>