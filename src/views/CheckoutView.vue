<template>
  <main class="checkout">
    <h2>Checkout</h2>
    <div v-if="items.length === 0" class="empty">
      <p>No items in cart.</p>
    </div>
    <div v-else class="checkout-grid">
      <section class="left">
        <h3>Shipping Details</h3>
        <form class="form">
          <input v-model="form.name" placeholder="Full Name" />
          <input v-model="form.phone" placeholder="Phone Number" />
          <input v-model="form.address" placeholder="Address" />
          <input v-model="form.city" placeholder="City" />
          <input v-model="form.pincode" placeholder="Pincode" />
        </form>

        <h3>Payment Method</h3>
        <div class="payment-options">
          <label>
            <input type="radio" value="partial-cod" v-model="paymentMode" />
            COD with prepaid delivery fee (recommended)
          </label>
          <label>
            <input type="radio" value="online" v-model="paymentMode" />
            Full online payment
          </label>
        </div>
      </section>
      <aside class="right">
        <h3>Order Summary</h3>
        <ul>
          <li v-for="item in items" :key="item.id">
            {{ item.name }} x {{ item.quantity }}
          </li>
        </ul>
        <p>Subtotal: <span>₹ {{ subtotal }}</span></p>
        <p>Shipping (prepaid): <span>₹ {{ shippingFee }}</span></p>
        <p class="total">Pay now: 
          <span v-if="paymentMode === 'partial-cod'">₹ {{ shippingFee }} (rest COD)</span>
          <span v-else>₹ {{ totalWithShipping }}</span>
        </p>
        <button class="btn-primary w-full" @click="placeOrder">
          Place Order
        </button>
      </aside>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '../stores/cart'

const cart = useCartStore()
const { cartItems: items, subtotal, totalWithShipping, shippingFee } = storeToRefs(cart)

const form = reactive({
  name: '',
  phone: '',
  address: '',
  city: '',
  pincode: ''
})
const paymentMode = ref('partial-cod')

function placeOrder() {
  // Placeholder: later wire to Razorpay/Pickrr services
  alert(`Order placed with ${paymentMode.value.toUpperCase()}!`)
}
</script>

<style scoped>
.checkout {
  padding: 7rem 1.5rem 4rem 1.5rem;
  max-width: 960px;
  margin: 0 auto;
}
.checkout-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}
.left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form {
  display: grid;
  gap: 0.75rem;
}
.form input {
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: #0b0b0b;
  color: #eee;
}
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
}
.right {
  padding: 1.5rem;
  border-radius: 12px;
  background: #141414;
  border: 1px solid rgba(255,215,0,0.2);
}
.right ul {
  list-style: none;
  margin: 0 0 1rem 0;
  padding: 0;
  font-size: 0.9rem;
}
.right p {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}
.total {
  margin-top: 0.5rem;
  font-weight: 800;
}
.w-full {
  width: 100%;
  margin-top: 1rem;
}
.empty {
  margin-top: 2rem;
  color: #aaa;
}
@media (max-width: 768px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}
</style>