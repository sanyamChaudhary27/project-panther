// Placeholder stub: you can wire actual Supabase client here later.
export function logEvent(name, payload = {}) {
  // For now, just log; later replace with Supabase insert.
  console.debug('[SupabaseEvent]', name, payload)
}