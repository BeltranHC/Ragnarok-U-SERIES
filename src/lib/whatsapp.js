const envGroup = import.meta.env.VITE_WHATSAPP_GROUP_URL?.trim() || ''

// Solo se aceptan enlaces https de chat.whatsapp.com.
export function resolveGroup(raw) {
  try {
    const url = new URL(raw)
    return url.protocol === 'https:' && url.hostname === 'chat.whatsapp.com' && url.pathname.length > 1 ? url.href : ''
  } catch {
    return ''
  }
}

// Enlace del grupo de la comunidad: el configurado en el panel o, si no hay, el de la variable de entorno.
export const communityLink = (settings) => resolveGroup(settings?.whatsapp_group_url || envGroup)
