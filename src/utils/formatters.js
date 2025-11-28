export function formatCurrencyINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatGrams(value) {
  return `${value} g`
}

export function formatMg(value) {
  return `${value} mg`
}