import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim()

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase no está configurado. Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (o VITE_SUPABASE_PUBLISHABLE_KEY) a tu archivo .env.',
  )
}

// Una clave service_role en el navegador daría acceso total a la base: se rechaza siempre.
function assertNotServiceRole(key) {
  try {
    const parts = key.split('.')
    if (parts.length >= 2) {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
      if (payload.role === 'service_role') {
        throw new Error('VITE_SUPABASE_ANON_KEY contiene una clave service_role. Usa solo la clave pública (anon/publishable).')
      }
    }
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('VITE_SUPABASE_ANON_KEY')) throw err
  }
}

if (supabaseAnonKey?.startsWith('sb_secret_')) {
  throw new Error('VITE_SUPABASE_ANON_KEY contiene una clave secreta. Usa solo la clave pública (publishable).')
}
if (supabaseAnonKey) assertNotServiceRole(supabaseAnonKey)

// El sitio público no inicia sesión: no se guarda ni se refresca ninguna sesión.
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key',
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
)
