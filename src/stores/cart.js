import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('panther_cart')) || [],
    shippingFee: 100, // ₹100 shipping fee (prepaid in partial COD)
  }),

  getters: {
    cartCount: (state) => state.items.length,
    
    subtotal: (state) => {
      return state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    totalWithShipping: (state) => {
      const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return subtotal + state.shippingFee;
    },

    cartItems: (state) => state.items,
  },

  actions: {
    addToCart(product, quantity = 1) {
      const existingItem = this.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image
        });
      }
      
      this.saveCart();
    },

    removeFromCart(productId) {
      this.items = this.items.filter(item => item.id !== productId);
      this.saveCart();
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId);
      if (item && quantity > 0) {
        item.quantity = quantity;
        this.saveCart();
      }
    },

    clearCart() {
      this.items = [];
      this.saveCart();
    },

    saveCart() {
      localStorage.setItem('panther_cart', JSON.stringify(this.items));
    }
  }
});