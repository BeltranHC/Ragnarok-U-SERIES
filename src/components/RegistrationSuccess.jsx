import { useEffect, useRef } from 'react'

// Pantalla de inscripción enviada: animación de confirmación, resumen, qué sigue y el enlace de la
// comunidad de WhatsApp (si la organización lo configuró).
export default function RegistrationSuccess({ teamName, gameName, amount, whatsappGroup, onClose }) {
  const ref = useRef(null)
  useEffect(() => { ref.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }) }, [])

  return (
    <section className="rs-success" ref={ref} role="status" aria-live="polite">
      <div className="rs-burst" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ '--a': `${i * 30}deg`, '--d': `${i % 2 ? 0.05 : 0}s` }} />)}
        <svg className="rs-check" viewBox="0 0 52 52">
          <circle className="rs-check-ring" cx="26" cy="26" r="23" fill="none" />
          <path className="rs-check-mark" fill="none" d="M14 27.5 22.5 36 38 18" />
        </svg>
      </div>

      <h2 className="rs-title">¡INSCRIPCIÓN ENVIADA!</h2>
      <p className="rs-sub"><b>{teamName}</b> ya está registrado en {gameName}.</p>
      <p className="rs-status"><span className="rs-status-dot" aria-hidden="true" />Pendiente de verificación del pago{amount ? ` · ${amount}` : ''}</p>

      <ol className="rs-steps">
        <li><b>1</b><span>La organización revisará tu comprobante de pago.</span></li>
        <li><b>2</b><span>Te avisaremos por WhatsApp al número del capitán.</span></li>
        <li><b>3</b><span>{whatsappGroup ? 'Únete a la comunidad para recibir el fixture y las novedades.' : 'Estate atento a las novedades del torneo.'}</span></li>
      </ol>

      {whatsappGroup && (
        <a className="rs-whatsapp" href={whatsappGroup} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.8 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z" /></svg>
          UNIRME A LA COMUNIDAD DE WHATSAPP
        </a>
      )}
      {onClose && <button type="button" className="rs-close" onClick={onClose}>Cerrar</button>}
    </section>
  )
}
