/**
 * Minimal Razorpay frontend helper.
 * Real keys and order creation should be done via backend (FastAPI/Supabase).
 */

export function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      return resolve(true)
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('Razorpay SDK failed to load'))
    document.body.appendChild(script)
  })
}

export async function openRazorpay(order, onSuccess, onFailure) {
  await loadRazorpayScript()

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_xxxxxx',
    amount: order.amount * 100,
    currency: 'INR',
    name: 'The Panther',
    description: order.description || 'Panther Order',
    order_id: order.razorpayOrderId,
    handler: (response) => onSuccess(response),
    prefill: {
      name: order.customerName,
      email: order.customerEmail,
      contact: order.customerPhone
    },
    theme: {
      color: '#ffd700'
    }
  }

  const rzp = new window.Razorpay(options)
  rzp.on('payment.failed', onFailure)
  rzp.open()
}