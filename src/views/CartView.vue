<template>
  <main class="cart-page">
    <h2>Your Cart</h2>
    <div v-if="items.length === 0" class="empty">
      <p>Your cart is empty. Add Panther Core to begin.</p>
    </div>
    <div v-else class="cart-grid">
      <div class="cart-items">
        <div v-for="item in items" :key="item.id" class="cart-item">
          <div class="left">
            <div class="emoji">{{ item.image }}</div>
            <div>
              <h3>{{ item.name }}</h3>
              <p class="price">₹ {{ item.price }}</p>
            </div>
          </div>
          <div class="right">
            <input type="number" min="1" v-model.number="item.quantity" @change="update(item)" />
            <button class="remove" @click="remove(item.id)">Remove</button>
          </div>
        </div>
      </div>
      <aside class="summary">
        <h3>Summary</h3>
        <p>Subtotal: <span>₹ {{ subtotal }}</span></p>
        <p>Shipping: <span>₹ {{ shippingFee }}</span></p>
        <p class="total">Total: <span>₹ {{ totalWithShipping }}</span></p>
        <router-link to="/checkout" class="btn-primary w-full">Proceed to Checkout</router-link>
      </aside>
    </div>
  </main>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from '../stores/cart'

const cart = useCartStore()
const { cartItems: items, subtotal, totalWithShipping, shippingFee } = storeToRefs(cart)

function update(item) {
  cart.updateQuantity(item.id, item.quantity)
}

function remove(id) {
  cart.removeFromCart(id)
}
</script>

<style scoped>
.cart-page {
  padding: 7rem 1.5rem 4rem 1.5rem;
  min-height: 80vh;
  max-width: 900px;
  margin: 0 auto;
}
.cart-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.cart-item {
  padding: 1rem;
  border-radius: 10px;
  background: #151515;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.emoji {
  font-size: 2rem;
}
.price {
  color: #ccc;
  font-size: 0.85rem;
}
.right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
input[type="number"] {
  width: 60px;
  padding: 0.3rem;
  background: #0b0b0b;
  border-radius: 4px;
  border: 1px solid #444;
  color: #fff;
}
.remove {
  background: transparent;
  color: #ff6b6b;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
}
.summary {
  padding: 1.5rem;
  border-radius: 12px;
  background: #141414;
  border: 1px solid rgba(255,215,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.summary p {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}
.total {
  margin-top: 0.5rem;
  font-weight: 800;
}
.w-full {
  display: inline-block;
  text-align: center;
  margin-top: 1rem;
}
.empty {
  margin-top: 2rem;
  color: #aaa;
}
@media (max-width: 768px) {
  .cart-grid {
    grid-template-columns: 1fr;
  }
}
</style>