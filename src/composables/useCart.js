import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '../stores/cart'

export function useCart() {
  const cart = useCartStore()
  const { cartItems, cartCount, subtotal, totalWithShipping, shippingFee } = storeToRefs(cart)

  const hasItems = computed(() => cartCount.value > 0)

  return {
    cart,
    cartItems,
    cartCount,
    subtotal,
    totalWithShipping,
    shippingFee,
    hasItems
  }
}