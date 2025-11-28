import api from './api'

/**
 * Placeholder wrapper for Pickrr integration.
 * In production, this will call your FastAPI backend, not Pickrr directly from frontend.
 */
export async function createShipment(orderPayload) {
  // Example payload forwarded to backend which talks to Pickrr
  // orderPayload should include: address, items, codAmount, shippingPaid etc.
  const { data } = await api.post('/logistics/pickrr/create-shipment/', orderPayload)
  return data
}

export async function trackShipment(trackingId) {
  const { data } = await api.get(`/logistics/pickrr/track/${trackingId}/`)
  return data
}