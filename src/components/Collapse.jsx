import { useId, useState } from 'react'

// Sección que se pliega y se despliega. variant "stage" = fase completa; "sub" = bloque dentro de una fase.
export default function Collapse({ title, meta, defaultOpen = false, variant = 'sub', children }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <section className={`cl cl--${variant} ${open ? 'cl--open' : ''}`}>
      <button type="button" className="cl-head" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <span className="cl-title">{title}</span>
        {meta && <span className="cl-meta">{meta}</span>}
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <div className="cl-panel" id={id} inert={!open}>
        <div className="cl-inner">{children}</div>
      </div>
    </section>
  )
}
