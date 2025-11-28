export function useLightning() {
  function strikeElement(el) {
    if (!el) return
    const rect = el.getBoundingClientRect()
    const detail = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }
    window.dispatchEvent(new CustomEvent('strikeLightning', { detail }))
  }

  function strikePoint(x, y) {
    window.dispatchEvent(new CustomEvent('strikeLightning', { detail: { x, y } }))
  }

  return { strikeElement, strikePoint }
}