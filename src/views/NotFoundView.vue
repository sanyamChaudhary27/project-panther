<template>
  <main class="nf">
    <h2>404</h2>
    <p>Looks like the panther leaped too far.</p>
    <router-link to="/" class="btn-primary back">Back to Home</router-link>
  </main>
</template>

<script setup></script>

<style scoped>
.nf {
  padding: 7rem 1.5rem 4rem 1.5rem;
  min-height: 70vh;
  text-align: center;
}
p {
  margin: 1rem 0 2rem 0;
}
.back {
  display: inline-block;
}
</style>