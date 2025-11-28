// Placeholder for future advanced particle controls (enable/disable, density, etc.)
import { ref } from 'vue'

export function useParticles() {
  const enabled = ref(true)

  function toggle() {
    enabled.value = !enabled.value
  }

  return { enabled, toggle }
}